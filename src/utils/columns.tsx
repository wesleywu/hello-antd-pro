import { ProColumns } from "@ant-design/pro-components";
import { DatePicker, Popconfirm, Space } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { JSX } from "react/jsx-runtime";

import { MetadataFactory } from "@/utils/metadata";
import {
  Class, Visibility, visible,
  ControlType,
} from "@/utils/types";
import { FieldConfig } from "@/utils/decorators";
import { getControlType, getProFieldValueType } from "@/utils/controltype";

export function showInList(visibility?: Visibility): boolean {
  if (visibility === undefined) {
    return true;
  }
  return (visibility & visible.list) === visible.list;
}

export function showInDetail(visibility?: Visibility): boolean {
  if (visibility === undefined) {
    return true;
  }
  return (visibility & visible.detail) === visible.detail;
}

export function showInSearch(visibility?: Visibility): boolean {
  if (visibility === undefined) {
    return true;
  }
  return (visibility & visible.search) === visible.search;
}

function getColumnProps(fieldName: string, fieldConfig: FieldConfig): ProColumns {
  const searchControlType = getControlType(fieldConfig.columnType, fieldConfig.controlTypeInSearchForm);
  const result: ProColumns = {
    title: fieldConfig.description,
    dataIndex: fieldName,
    valueType: getProFieldValueType(searchControlType),
    valueEnum: fieldConfig.displayValueMapping,
  }
  if (fieldConfig.displayValueMapping !== undefined) {
    result.fieldProps = { mode: 'multiple', placeholder: '请选择', };
    // result.render = ( _: any, entity: Record<string, any>) => (fieldConfig.displayValueMapping?.get(entity[fieldName]))
  }
  // valueType 字段会同时应用于 list 和 searchForm，如果 search 的控件是日期范围类型，必须另外指定 renderFormItem
  if (searchControlType === ControlType.DateRangePicker) {
    result.renderFormItem = () => {
      return (<DatePicker.RangePicker/>);
    };
  } else if (searchControlType === ControlType.DateTimeRangePicker) {
    result.renderFormItem = () => {
      return (<DatePicker.RangePicker showTime/>);
    };
  }
  if (!showInList(fieldConfig.visibility)) {
    result.hideInTable = true;
  }
  if (!showInDetail(fieldConfig.visibility)) {
    result.hideInDescriptions = true;
  }
  if (!showInSearch(fieldConfig.visibility)) {
    result.hideInSearch = true;
  }
  return result;
}

export function getColumns<T extends Record<string, any>>(recordClass: Class<T>, onUpdateClick: (record: T) => void, onDeleteClick: (record: T) => void): ProColumns[] {
  const metadata = MetadataFactory.get(recordClass);
  const tableConfig = metadata.tableConfig();
  const fieldConfigs = metadata.fieldConfigs();
  const columns: ProColumns[] = [];
  // 生成字段对应的列
  fieldConfigs.forEach((fieldConfig, fieldName) => {
    columns.push(getColumnProps(fieldName, fieldConfig));
  });
  // 生成操作列
  if (tableConfig.allowModify || tableConfig.allowDelete) {
    const operations: ((record: T) => JSX.Element)[] = []
    if (tableConfig.allowModify) {
      const opModify = (record: T) => (
        <a
          key="config"
          onClick={ e => {
            e.stopPropagation();
            onUpdateClick(record);
          } }
        >
          修改
        </a>
      )
      operations.push(opModify);
    }
    if (tableConfig.allowDelete) {
      const opDelete = (record: T) => (
        <Popconfirm
          key='delete-confirm'
          title="删除记录"
          description="确定要删除这条记录吗？"
          icon={ <QuestionCircleOutlined style={ { color: 'red' } }/> }
          onConfirm={ e => {
            e?.stopPropagation();
            onDeleteClick(record);
          } }
          onCancel={ e => e?.stopPropagation() }
        >
          <a key='delete' onClick={ e => {
            e.stopPropagation();
          } }> 删除 </a>
        </Popconfirm>
      )
      operations.push(opDelete);
    }
    const opColumn: ProColumns = {
      title: '操作',
      valueType: 'option',
      render: (_: any, record: T) => (
        <Space size={"middle"}>
          {operations.map(value => value(record))}
        </Space>
      )
    }
    columns.push(opColumn);
  }
  return columns;
}
