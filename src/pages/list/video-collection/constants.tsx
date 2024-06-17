import React from "react";
import { BorderHorizontalOutlined, BorderVerticleOutlined, FileTextOutlined } from "@ant-design/icons";
import { ProSchemaValueEnumType } from "@ant-design/pro-provider";
import { FieldConfig } from "@/utils/requestParams";
import { MultiType, OperatorType, ProtoType, WildcardType } from "@/utils/types";
import { CrudApi } from "@/utils/crudApi";
import { VideoCollection } from "@/pages/list/video-collection/data";

// contentType 字段的显示转换速查表
export const contentTypeMap: Map<string, React.ReactNode> = new Map([
  ['TextImage', (<div key={1}><FileTextOutlined /> 图文</div>)],
  ['LandscapeVideo', (<div key={2}><BorderHorizontalOutlined /> 竖版短视频</div>)],
  ['PortraitVideo', (<div key={9}><BorderVerticleOutlined/> 横版短视频</div>)],
]);

// filterType 字段的显示转换速查表
export const filterTypeMap: Map<string, string> = new Map([
  ['Ruled', '规则筛选'],
  ['Manual', '人工'],
]);

// isOnline 字段的显示转换速查表
export const isOnlineMap: Map<boolean, ProSchemaValueEnumType> = new Map([
  [false, {
    text: '未上线',
    status: 'Default',
  }],
  [true, {
    text: '已上线',
    status: 'Processing',
  }],
]);

// api base
const videoCollectionApiBase = '/v1/video-collection';

// 查询记录使用的字段配置表
const videoCollectionSearchFieldConfigs: FieldConfig[] = [
  new FieldConfig('id', ProtoType.StringValue, OperatorType.EQ, MultiType.NoMulti),
  new FieldConfig('name', ProtoType.StringValue, OperatorType.Like, MultiType.NoMulti, WildcardType.Contains),
  new FieldConfig('contentType', ProtoType.StringValue, OperatorType.EQ, MultiType.In),
  new FieldConfig('filterType', ProtoType.StringValue, OperatorType.EQ, MultiType.In),
  new FieldConfig('count', ProtoType.UInt32Value, OperatorType.EQ, MultiType.Between),
  new FieldConfig('isOnline', ProtoType.BoolValue, OperatorType.EQ, MultiType.In),
  new FieldConfig('createdAt', ProtoType.Date, OperatorType.EQ, MultiType.Between),
  new FieldConfig('updatedAt', ProtoType.Date, OperatorType.EQ, MultiType.Between),
]

// 删除多条记录使用的字段配置表
const videoCollectionDeleteFieldConfigs: FieldConfig[] = [
  new FieldConfig('id', ProtoType.StringValue, OperatorType.EQ, MultiType.In),
]

// 后端 api
export const videoCollectionApi = new CrudApi<VideoCollection>(videoCollectionApiBase, videoCollectionSearchFieldConfigs, videoCollectionDeleteFieldConfigs);
