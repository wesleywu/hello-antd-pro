import React from "react";
import { BorderHorizontalOutlined, BorderVerticleOutlined, FileTextOutlined } from "@ant-design/icons";
import { ProSchemaValueEnumType } from "@ant-design/pro-provider";
import { MultiType, OperatorType, ProtoType, visible, WildcardType } from "@/utils/types";
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
  @field({
    dbColumnName: "_id",
    description: "视频集编号",
    columnType: ProtoType.StringValue,
    required: true,
    visibility: visible.search,
  })
  id: string;
  @field({
    dbColumnName: "name",
    description: "视频集名称",
    columnType: ProtoType.StringValue,
    required: true,
  })
  @search(OperatorType.Like, MultiType.NoMulti, WildcardType.Contains)
  name: string;
  @field({
    dbColumnName: "content_type",
    description: "内容体裁",
    columnType: ProtoType.StringValue,
    required: true,
    displayValueMapping: contentTypeMap,
  })
  contentType: string;
  @field({
    dbColumnName: "filter_type",
    description: "筛选方式",
    columnType: ProtoType.StringValue,
    required: true,
    displayValueMapping: filterTypeMap,
  })
  filterType: string;
  @field({
    dbColumnName: "count",
    description: "内容量",
    columnType: ProtoType.Int32Value,
    required: true,
  })
  count: number;
  @field({
    dbColumnName: "is_online",
    description: "是否上线",
    columnType: ProtoType.BoolValue,
    required: true,
    displayValueMapping: isOnlineMap,
  })
  isOnline: boolean;
  @field({
    dbColumnName: "created_at",
    description: "创建时间",
    columnType: ProtoType.Date,
    required: true,
    visibility: visible.search,
  })
  createdAt: Date;
  @field({
    dbColumnName: "updated_at",
    description: "更新时间",
    columnType: ProtoType.Date,
    required: true,
    visibility: visible.search,
  })
  updatedAt: Date;
}

// 后端 api
export const videoCollectionApi = new Crud(VideoCollection, '/v1/video-collection');
