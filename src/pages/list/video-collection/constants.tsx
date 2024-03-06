import React from "react";
import { BorderHorizontalOutlined, BorderVerticleOutlined, FileTextOutlined } from "@ant-design/icons";
import { ProSchemaValueEnumType } from "@ant-design/pro-provider";

export const contentTypeMap: Map<number, React.ReactNode> = new Map([
  [1, (<div key={1}><FileTextOutlined /> 图文</div>)],
  [2, (<div key={2}><BorderHorizontalOutlined /> 横版短视频</div>)],
  [9, (<div key={9}><BorderVerticleOutlined/> 竖版短视频</div>)],
]);
export const filterTypeMap: Map<number, string> = new Map([
  [0, '规则筛选'],
  [1, '人工'],
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
