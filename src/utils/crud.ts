import { request } from '@umijs/max';
import type { SortOrder } from "antd/lib/table/interface";
import { FieldConfig, ListRes, PageRequest, SearchConfig, Sort } from "@/utils/types";
import { AxiosResponse } from "axios";
import { toCondition } from "@/utils/conditions";
import { FIELD_CONFIGS, SEARCH_CONFIGS, newSearchConfig } from "@/utils/decorators";

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

export function getFieldConfigs(table: any): Map<string, FieldConfig> {
  return table.prototype[FIELD_CONFIGS] as Map<string, FieldConfig>;
  // const configs = table.prototype[FIELD_CONFIGS] as FieldConfig[];
  // const result = new Map<string, FieldConfig>();
  // configs.forEach(value => {
  //   result.set(value.fieldName, value);
  // })
  // return result
}

export function getSearchConfigs(table: any): Map<string, SearchConfig> {
  return table.prototype[SEARCH_CONFIGS] as Map<string, SearchConfig>;
  // const configs = table.prototype[SEARCH_CONFIGS] as SearchConfig[];
  // const result = new Map<string, SearchConfig>();
  // configs.forEach(value => {
  //   result.set(value.fieldName, value);
  // })
  // return result
}

export class Crud {
  // API 的 base uri，例如 /v1/your_repo_name
  private readonly apiBaseUri: string;
  // 字段配置列表
  private readonly fieldConfigs: Map<string, FieldConfig>;
  // 查询配置列表
  private readonly searchConfigs: Map<string, SearchConfig>;

  constructor(poClass: any, apiBaseUri: string) {
    this.apiBaseUri = apiBaseUri;
    this.fieldConfigs = getFieldConfigs(poClass);
    this.searchConfigs = getSearchConfigs(poClass);
    // console.log("fieldConfigs", this.fieldConfigs);
    // console.log("searchConfigs", this.searchConfigs);
  }

  /** 获取记录列表 POST ${apiBaseUri}/list */
  list = async <T>(
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
    console.log('toRequest: ' + conditions.join(',\n'));
    return `{
    ${conditions.join(',\n')}
  }`
  }

}
