import { request } from '@umijs/max';
import type { SortOrder } from "antd/lib/table/interface";
import { Class, FieldConfig, ListRes, PageRequest, SearchConfig, Sort, TableConfig } from "@/utils/types";
import { AxiosResponse } from "axios";
import { toCondition } from "@/utils/conditions";
import { FIELD_CONFIGS, SEARCH_CONFIGS, newSearchConfig, TABLE_CONFIG } from "@/utils/decorators";
import { getColumnProps } from "@/utils/columns";
import { ProColumns } from "@ant-design/pro-components";

// Axios Response 的拦截器，针对返回的每一条记录，将 id 字段额外赋值给 key 字段
function populateKeyWithId(response: AxiosResponse) {
  const { data } = response;
  if (data && data.items) {
    response.data.items = data.items.map((item: any) => {
      if (item.id) {
        return ({
          key: item.id,
          ...item,
        })
      }
      return item;
    });
  }
  return response
}

export function getFieldConfigs(table: Class): Map<string, FieldConfig> {
  const configMap = table.prototype[FIELD_CONFIGS] as Map<string, FieldConfig>;
  if (configMap === undefined) {
    throw new Error(`没有数据类 ${table.name} 的属性上使用 @field 装饰器定义元数据`);
  }
  return configMap;
}

export function getSearchConfigs(table: Class): Map<string, SearchConfig> {
  let configMap = table.prototype[SEARCH_CONFIGS] as Map<string, SearchConfig>;
  if (configMap === undefined) {
    configMap = new Map<string, SearchConfig>();
  }
  return configMap;
}

export function getTableConfig(table: Class): TableConfig {
  const config = table.prototype[TABLE_CONFIG] as TableConfig;
  if (config === undefined) {
    throw new Error("必须在持久化对象类(Persistent Object class)上使用 @table 装饰器定义元数据");
  }
  if (config.description === undefined) {
    config.description = table.name;
  }
  return config;
}

abstract class Metadata {
  // 数据类元数据
  private readonly tableConfig: TableConfig;
  // 字段元数据列表
  private readonly fieldConfigs: Map<string, FieldConfig>;
  // 查询配置列表
  private readonly searchConfigs: Map<string, SearchConfig>;

  constructor(poClass: any) {
    this.tableConfig = getTableConfig(poClass);
    this.fieldConfigs = getFieldConfigs(poClass);
    this.searchConfigs = getSearchConfigs(poClass);
    // console.log("tableConfig", this.tableConfig);
    // console.log("fieldConfigs", this.fieldConfigs);
    // console.log("searchConfigs", this.searchConfigs);
  }
  columns = (): ProColumns[] => {
    const columns: ProColumns[] = [];
    this.fieldConfigs.forEach((fieldConfig, fieldName) => {
      columns.push(getColumnProps(fieldName, fieldConfig));
    });
    return columns;
  }
}

// 可以用 new 创建实例的 Metadata 类，仅仅是继承了 abstract 的 Metadata
class MetadataImpl extends Metadata {}

// 用于获得 Crud 类实例的工厂，只提供一个静态方法: get
export class MetadataFactory {
  private static instanceMap: Map<Class, Metadata> = new Map<Class, Metadata>();
  // 根据 class （类），返回其对应的 Crud API 实现，以同样的 class 参数多次调用不会重复创建实例
  public static get = <T> (clazz: Class<T>): Metadata => {
    let metadata = MetadataFactory.instanceMap.get(clazz)
    if (metadata === undefined) {
      metadata = new MetadataImpl(clazz);
      MetadataFactory.instanceMap.set(clazz, metadata);
    }
    return metadata;
  }
}


// Crud API 的实际实现，为了避免让使用者直接 new Crud()，将其标记为 abstract
abstract class Crud<T> {
  // API 的 base uri，例如 /v1/your_repo_name
  private readonly apiBaseUri: string;
  // 数据类元数据
  private readonly tableConfig: TableConfig;
  // 字段元数据列表
  private readonly fieldConfigs: Map<string, FieldConfig>;
  // 查询配置列表
  private readonly searchConfigs: Map<string, SearchConfig>;

  constructor(poClass: Class<T>) {
    this.tableConfig = getTableConfig(poClass);
    this.fieldConfigs = getFieldConfigs(poClass);
    this.searchConfigs = getSearchConfigs(poClass);
    // console.log("tableConfig", this.tableConfig);
    // console.log("fieldConfigs", this.fieldConfigs);
    // console.log("searchConfigs", this.searchConfigs);
    this.apiBaseUri = this.tableConfig.apiBaseUrl;
  }

  /** 获取记录列表 POST ${apiBaseUri}/list */
  list = async (
    params: T & {
      pageSize?: number;
      current?: number;
      keyword?: string;
    },
    sort: Record<string, SortOrder>,
    // filter : Record<string, (string | number)[] | null>,
  ) => {
    // todo 实现 filter
    // 将 params, sort 等参数转换为服务端定义的 request 结构体
    const data = this.toRequestBody(params, params.current ? params.current : 1, params.pageSize ? params.pageSize : 10, sort)
    const resp = await request<ListRes<T>>(`${this.apiBaseUri}/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      data: data,
      responseInterceptors: [populateKeyWithId],
    });
    return {
      data: resp.items,
      current: resp.pageInfo.number,
      // success 请返回 true，
      // 不然 table 会停止解析数据，即使有数据
      success: true,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: resp.pageInfo.totalElements,
    };
  }

  /** 更新记录 PATCH ${apiBaseUri}/$id */
  update = (idValue: string, data: { [key: string]: any }, options?: { [key: string]: any }) => {
    return request(`${this.apiBaseUri}/${idValue}`, {
      data,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      ...(options || {}),
    });
  }

  /** 新建记录 POST ${apiBaseUri} */
  create = (data: { [key: string]: any }, options?: { [key: string]: any }) => {
    return request(this.apiBaseUri, {
      data,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      ...(options || {}),
    });
  }

  /** 删除单个记录 DELETE ${apiBaseUri}/$id */
  delete = (data: { id: string }, options?: { [key: string]: any }) => {
    return request(`${this.apiBaseUri}/${data.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      ...(options || {}),
    });
  }

  /** 删除多个记录 POST ${apiBaseUri}/delete */
  deleteMulti = (params: any, options?: { [key: string]: any }) => {
    // 将 params, sort 等参数转换为服务端定义的 request 结构体
    const data = this.toRequestBody(params)
    return request(`${this.apiBaseUri}/delete`, {
      data,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      ...(options || {}),
    });
  }

  toRequestBody = (req: NonNullable<any>, pageNum?: number, pageSize?: number,
                   sort?: Record<string, SortOrder>): string => {
    const conditions: string[] = []
    for (const fieldName of Object.keys(req)) {
      const fieldConfig = this.fieldConfigs.get(fieldName);
      if (fieldConfig === undefined) {
        continue
      }
      let searchConfig = this.searchConfigs.get(fieldName);
      if (searchConfig === undefined) {
        searchConfig = newSearchConfig();
      }
      const fieldValue = req[fieldName];
      if (fieldValue === undefined) {
        continue;
      }
      const condition = toCondition(fieldName, fieldValue, fieldConfig, searchConfig);
      if (condition !== undefined && condition.trim().length === 0) {
        continue;
      }
      conditions.push(condition);
    }
    if (pageNum !== undefined && pageSize !== undefined) {
      const pageRequest: PageRequest = {
        number: pageNum,
        size: pageSize,
      }
      if (sort) {
        let sorts: Sort[] = []
        for (const field in sort) {
          if (!Object.hasOwn(sort, field)) {
            continue
          }
          const fieldConfig = this.fieldConfigs.get(field);
          if (fieldConfig === undefined) {
            continue
          }
          const order = sort[field];
          let orderDirection = 'Asc'
          if (order === 'descend') {
            orderDirection = 'Desc';
          }
          sorts.push({
            property: fieldConfig.dbColumnName,
            direction: orderDirection,
          })
        }
        if (sorts.length > 0) {
          pageRequest.sorts = sorts
        }
      }
      conditions.push(`"pageRequest": ${JSON.stringify(pageRequest)}`);
    }
    console.log(`request: {
      ${conditions.join(',\n')}
    }`);
    return `{
      ${conditions.join(',\n')}
    }`
  }
}

// 可以用 new 创建实例的 Crud 类，仅仅是继承了 abstract 的 Crud
class CrudImpl<T> extends Crud<T> { }

// 用于获得 Crud 类实例的工厂，只提供一个静态方法: get
export class CrudApiFactory {
  private static instanceMap: Map<Class<any>, Crud<any>> = new Map<Class, Crud<any>>();
  // 根据 class （类），返回其对应的 Crud API 实现，以同样的 class 参数多次调用不会重复创建实例
  public static get = <T> (clazz: Class<T>): Crud<T> => {
    let crud = CrudApiFactory.instanceMap.get(clazz)
    if (crud === undefined) {
      crud = new CrudImpl(clazz);
      CrudApiFactory.instanceMap.set(clazz, crud);
    }
    return crud;
  }
}
