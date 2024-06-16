import React from "react";
import { BorderHorizontalOutlined, BorderVerticleOutlined, FileTextOutlined } from "@ant-design/icons";
import { ProSchemaValueEnumType } from "@ant-design/pro-provider";
import { FieldConfig } from "@/utils/requestParams";
import { MultiType, OperatorType, ProtoType, WildcardType } from "@/utils/types";

export const contentTypeMap: Map<string, React.ReactNode> = new Map([
  ['TextImage', (<div key={1}><FileTextOutlined /> 图文</div>)],
  ['LandscapeVideo', (<div key={2}><BorderHorizontalOutlined /> 竖版短视频</div>)],
  ['PortraitVideo', (<div key={9}><BorderVerticleOutlined/> 横版短视频</div>)],
]);
export const filterTypeMap: Map<string, string> = new Map([
  ['Ruled', '规则筛选'],
  ['Manual', '人工'],
]);
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

export const VideoCollectionSearchFieldConfigs: FieldConfig[] = [
  new FieldConfig('id', ProtoType.StringValue, OperatorType.EQ, MultiType.NoMulti),
  new FieldConfig('name', ProtoType.StringValue, OperatorType.Like, MultiType.NoMulti, WildcardType.Contains),
  new FieldConfig('contentType', ProtoType.StringValue, OperatorType.EQ, MultiType.In),
  new FieldConfig('filterType', ProtoType.StringValue, OperatorType.EQ, MultiType.In),
  new FieldConfig('count', ProtoType.UInt32Value, OperatorType.EQ, MultiType.Between),
  new FieldConfig('isOnline', ProtoType.BoolValue, OperatorType.EQ, MultiType.In),
  new FieldConfig('createdAt', ProtoType.Date, OperatorType.EQ, MultiType.Between),
  new FieldConfig('updatedAt', ProtoType.Date, OperatorType.EQ, MultiType.Between),
]

export const VideoCollectionDeleteFieldConfigs: FieldConfig[] = [
  new FieldConfig('id', ProtoType.StringValue, OperatorType.EQ, MultiType.In),
]
