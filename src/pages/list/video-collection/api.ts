// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { VideoCollectionItem } from './data';

/** 获取规则列表 GET /api/rule */
export async function listVideoCollection(
  params: VideoCollectionItem & {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
  // 如果需要转化参数可以在这里进行修改
  const msg = await request<{
    items: VideoCollectionItem[];
    /** 列表的内容总数 */
    total?: number;
    current?: number;
  }>('/v1/video-collection/list', {
    method: 'POST',
    data: {
      ...params,
    },
  });
  return {
    data: msg.items,
    current: msg.current,
    // success 请返回 true，
    // 不然 table 会停止解析数据，即使有数据
    success: true,
    // 不传会使用 data 的长度，如果是分页一定要传
    total: msg.total,
  };
}

/** 新建规则 PUT /api/rule */
export async function updateVideoCollection(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<VideoCollectionItem>('/v1/video-collection', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addVideoCollection(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<VideoCollectionItem>('/v1/video-collection', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeVideoCollection(data: { id: string }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('video-collection/' + data.id, {
    method: 'DELETE',
    ...(options || {}),
  });
}
