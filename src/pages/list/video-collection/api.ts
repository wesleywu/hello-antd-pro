// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { PageInfo, VideoCollectionItem } from './data.d';
import { MultiType, OperatorType, ProtoType, RequestParamConfig, toRequest, WildcardType } from "@/utils/requestParams";
import type { SortOrder } from "antd/lib/table/interface";

export const ColumnConfigs: RequestParamConfig[] = [
  new RequestParamConfig('id', ProtoType.ObjectID, OperatorType.EQ, MultiType.NoMulti),
  new RequestParamConfig('name', ProtoType.StringValue, OperatorType.Like, MultiType.NoMulti, WildcardType.Contains),
  new RequestParamConfig('contentType', ProtoType.StringSlice, OperatorType.EQ, MultiType.In),
  new RequestParamConfig('filterType', ProtoType.StringSlice, OperatorType.EQ, MultiType.In),
  new RequestParamConfig('count', ProtoType.UInt32Slice, OperatorType.EQ, MultiType.Between),
  new RequestParamConfig('isOnline', ProtoType.BoolSlice, OperatorType.EQ, MultiType.In),
  new RequestParamConfig('createdAt', ProtoType.DateBetween, OperatorType.EQ, MultiType.Between),
  new RequestParamConfig('updatedAt', ProtoType.DateTimeBetween, OperatorType.EQ, MultiType.Between),
]

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
  const data = toRequest(ColumnConfigs, params, params.current ? params.current : 1, params.pageSize ? params.pageSize : 10, sort)
  const resp = await request<{
    items: VideoCollectionItem[];
    /** 列表的内容总数 */
    pageInfo: PageInfo;
  }>('/v1/video-collection/list', {
    method: 'POST',
    data: data,
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
  return request<VideoCollectionItem>('/v1/video-collection/' + idValue, {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建视频集 POST /v1/video-collection */
export async function addVideoCollection(data: { [key: string]: any }, options?: { [key: string]: any }) {
  console.log(data);
  return request<VideoCollectionItem>('/v1/video-collection', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除视频集 DELETE /v1/video-collection */
export async function removeVideoCollection(data: { id: string }, options?: { [key: string]: any }) {
  console.log('delete id: ' + data.id);
  return request<Record<string, any>>('/v1/video-collection/' + data.id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With1': 'XMLHttpRequest'
    },
    ...(options || {}),
  });
}
