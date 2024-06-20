import React from "react";
import { BorderHorizontalOutlined, BorderVerticleOutlined, FileTextOutlined } from "@ant-design/icons";
import { ProSchemaValueEnumType } from "@ant-design/pro-provider";
import { OperatorType, ProtoType, visible, WildcardType } from "@/utils/types";
import { field, search, table } from "@/utils/decorators";
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

// 数据类定义
@table({
  description: "视频集",
  allowModify: true,
  allowDelete: true,
  apiBaseUrl: "/v1/video-collection",
})
export class VideoCollection implements Record<string, any> {
  @field({
    description: "视频集编号",
    columnType: ProtoType.StringValue,
    required: true,
    visibility: visible.none,
  })
  id: string;

  @field({
    description: "视频集名称",
    columnType: ProtoType.StringValue,
    required: true,
  })
  @search({
    operator: OperatorType.Like,
    wildcard: WildcardType.Contains,
  })
  name: string;

  @field({
    description: "内容体裁",
    columnType: ProtoType.StringValue,
    required: true,
    displayValueMapping: contentTypeMap,
  })
  contentType: string;

  @field({
    description: "筛选方式",
    columnType: ProtoType.StringValue,
    required: true,
    displayValueMapping: filterTypeMap,
  })
  filterType: string;

  @field({
    description: "内容量",
    columnType: ProtoType.Int32Value,
    visibility: visible.list | visible.detail | visible.create | visible.update,
    required: true,
  })
  count: number;

  @field({
    description: "是否上线",
    columnType: ProtoType.BoolValue,
    required: true,
    displayValueMapping: isOnlineMap,
  })
  isOnline: boolean;

  @field({
    description: "创建时间",
    columnType: ProtoType.Date,
    required: true,
    visibility: visible.list | visible.detail | visible.search,
  })
  createdAt: Date;

  @field({
    description: "更新时间",
    columnType: ProtoType.Date,
    required: true,
    visibility: visible.list | visible.detail,
  })
  updatedAt: Date;
}
