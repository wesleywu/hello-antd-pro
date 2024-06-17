import { request } from '@umijs/max';
import type { SortOrder } from "antd/lib/table/interface";
import { ListRes } from "@/utils/types";
import { FieldConfig, toRequest } from "@/utils/requestParams";
import { AxiosResponse } from "axios";

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

export class CrudApi<T> {
  // API 的 base uri，例如 /v1/your_repo_name
  private readonly apiBaseUri: string;
  // 查询使用的字段配置列表
  private readonly searchConfigs: FieldConfig[];
  // 删除多条就来使用的字段配置列表
  private readonly deleteConfigs: FieldConfig[];

  constructor(apiBaseUri: string, searchConfigs: FieldConfig[], deleteConfigs: FieldConfig[]) {
    this.apiBaseUri = apiBaseUri;
    this.searchConfigs = searchConfigs;
    this.deleteConfigs = deleteConfigs;
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
    const data = toRequest(this.searchConfigs, params, params.current ? params.current : 1, params.pageSize ? params.pageSize : 10, sort)
    const resp = await  request<ListRes<T>>(`${this.apiBaseUri}/list`, {
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
    const data = toRequest(this.deleteConfigs, params)
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

}
