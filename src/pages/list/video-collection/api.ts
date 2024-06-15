// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import {
  VideoCollectionItem,
  VideoCollectionDeleteFieldConfigs,
  VideoCollectionSearchFieldConfigs
} from './data.d';
import { ListRes } from "@/utils/types.d";
import { toRequest } from "@/utils/requestParams";
import type { SortOrder } from "antd/lib/table/interface";
import { populateKeyWithId } from "@/utils/responseInterceptors";

/** 获取视频集列表 GET /v1/video-collection/list */
export async function listVideoCollection(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  sort: Record<string, SortOrder>,
  options?: { [key: string]: any },
) {
  // 将 params, sort 等参数转换为服务端定义的 request 结构体
  const data = toRequest(VideoCollectionSearchFieldConfigs, params, params.current ? params.current : 1, params.pageSize ? params.pageSize : 10, sort)
  const resp = await request<ListRes<VideoCollectionItem>>('/v1/video-collection/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    data: data,
    responseInterceptors: [populateKeyWithId],
    ...(options || {})
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

/** 新建视频集 PUT /api/rule */
export async function updateVideoCollection(idValue: string, data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request('/v1/video-collection/' + idValue, {
    data,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    ...(options || {}),
  });
}

/** 新建视频集 POST /v1/video-collection */
export async function createVideoCollection(data: { [key: string]: any }, options?: { [key: string]: any }) {
  console.log(data);
  return request('/v1/video-collection', {
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    ...(options || {}),
  });
}

/** 删除视频集 DELETE /v1/video-collection */
export async function deleteVideoCollection(data: { id: string }, options?: { [key: string]: any }) {
  return request('/v1/video-collection/' + data.id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    ...(options || {}),
  });
}

/** 删除多个视频集 POST /v1/video-collection/delete */
export async function deleteMultiVideoCollection(params: any) {
  // 将 params, sort 等参数转换为服务端定义的 request 结构体
  const data = toRequest(VideoCollectionDeleteFieldConfigs, params)
  return request('/v1/video-collection/delete', {
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
  });
}
