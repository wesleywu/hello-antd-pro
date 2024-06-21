import React from "react";
import { BorderHorizontalOutlined, BorderVerticleOutlined, FileTextOutlined } from "@ant-design/icons";
import { ProSchemaValueEnumType } from "@ant-design/pro-provider";
import { OperatorType, ProtoType, visible, WildcardType } from "@/utils/types";
import { field, search, table } from "@/utils/decorators";
import "reflect-metadata";

// contentType 字段的显示转换速查表
export const contentTypeMap: Map<string, React.ReactNode> = new Map([
  ['news', (<div key={1}><FileTextOutlined /> 新闻</div>)],
  ['comedy', (<div key={2}><BorderHorizontalOutlined /> 喜剧</div>)],
  ['sports', (<div key={9}><BorderVerticleOutlined/> 体育</div>)],
]);

// filterType 字段的显示转换速查表
export const filterTypeMap: Map<string, string> = new Map([
  ['ruled', '规则筛选'],
  ['manual', '人工'],
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

// 数据类定义
@table({
  description: "音频单集",
  allowModify: true,
  allowDelete: true,
  apiBaseUrl: "/v1/episode",
})
export class VideoCollection implements Record<string, any> {
  @field({
    description: "音频编号",
    columnType: ProtoType.StringValue,
    required: true,
    visibility: visible.none,
  })
  id: string;

  @field({
    description: "音频名称",
    columnType: ProtoType.StringValue,
    required: true,
  })
  @search({
    operator: OperatorType.Like,
    wildcard: WildcardType.Contains,
  })
  name: string;

  @field({
    description: "内容类型",
    columnType: ProtoType.StringValue,
    required: true,
    sortable: true,
    displayValueMapping: contentTypeMap,
  })
  contentType: string;

  @field({
    description: "筛选方式",
    columnType: ProtoType.StringValue,
    required: true,
    sortable: true,
    displayValueMapping: filterTypeMap,
    filterable: true,
  })
  filterType: string;

  @field({
    description: "播放量",
    columnType: ProtoType.Int32Value,
    required: true,
    visibility: visible.list | visible.detail | visible.create | visible.update,
    sortable: true,
  })
  count: number;

  @field({
    description: "是否上线",
    columnType: ProtoType.BoolValue,
    required: true,
    displayValueMapping: isOnlineMap,
    filterable: true,
  })
  isOnline: boolean;

  @field({
    description: "关键词",
    columnType: ProtoType.StringValue,
  })
  keywords: string[];

  @field({
    description: "提纲",
    columnType: ProtoType.StringValue,
  })
  outlines: Map<string, string>;

  @field({
    description: "提问&回答",
    columnType: ProtoType.StringValue,
  })
  qas: string[];

  @field({
    description: "创建时间",
    columnType: ProtoType.Date,
    required: true,
    visibility: visible.list | visible.detail | visible.search,
    sortable: true,
  })
  createdAt: Date;

  @field({
    description: "更新时间",
    columnType: ProtoType.Date,
    required: true,
    visibility: visible.list | visible.detail,
    sortable: true,
  })
  updatedAt: Date;
}
