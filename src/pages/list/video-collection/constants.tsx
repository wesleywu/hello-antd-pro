import React from "react";
import { BorderHorizontalOutlined, BorderVerticleOutlined, FileTextOutlined } from "@ant-design/icons";
import { ProSchemaValueEnumType } from "@ant-design/pro-provider";
import { MultiType, OperatorType, ProtoType, WildcardType } from "@/utils/types";
import { field, search } from "@/utils/decorators";
import { Crud } from "@/utils/crud";
import "reflect-metadata";

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

// 表字段定义
export class VideoCollection {
  @field("_id", ProtoType.StringValue)
  id: string;
  @field("name", ProtoType.StringValue)
  @search(OperatorType.Like, MultiType.NoMulti, WildcardType.Contains)
  name: string;
  @field("content_type", ProtoType.StringValue)
  // @search(OperatorType.EQ, MultiType.In)
  contentType: string;
  @field("filter_type", ProtoType.StringValue)
  // @search(OperatorType.EQ, MultiType.In)
  filterType: string;
  @field("count", ProtoType.Int32Value)
  count: number;
  @field("is_online", ProtoType.BoolValue)
  isOnline: boolean;
  @field("created_at", ProtoType.Date)
  // @search(OperatorType.EQ, MultiType.Between)
  createdAt: Date;
  @field("updated_at", ProtoType.Date)
  updatedAt: Date;
}

// 后端 api
export const videoCollectionApi = new Crud(VideoCollection, '/v1/video-collection');
