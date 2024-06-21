import { ProColumns } from "@ant-design/pro-components";
import { Collapse, DatePicker, Descriptions, Popconfirm, Space } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { JSX } from "react/jsx-runtime";

import { MetadataFactory, showInDetail, showInList, showInSearch } from "./metadata";
import { Class, ControlType, ProtoType } from "./types";
import { FieldConfig } from "./decorators";
import { getControlType, getProFieldValueType } from "./controltype";

const renderSimpleArray = (fieldName: string) => ( _: any, entity: Record<string, any>) => {
  const fieldValue = entity[fieldName] as Array<any>;
  if (fieldValue === undefined || fieldValue.length === 0) {
    return "";
  }
  const subItems = [];
  for (const item of fieldValue) {
    subItems.push(<Descriptions.Item label={''} key={item}>{item}</Descriptions.Item>);
  }
  return (
    <Descriptions title={""} layout={"horizontal"} column={1} colon={false} size={"small"}>
      {subItems}
    </Descriptions>
  );
};

const renderSimpleMap = (fieldName: string) => ( _: any, entity: Record<string, any>) => {
  const fieldValue = entity[fieldName] as Map<any, any>;
  if (fieldValue === undefined || Object.keys(fieldValue).length === 0) {
    return "";
  }
  const subItems = [];
  for (const key in fieldValue) {
    if (Object.prototype.hasOwnProperty.call(fieldValue, key)) {
      const value = fieldValue[key];
      subItems.push(<Descriptions.Item label={key} key={key}>{value}</Descriptions.Item>);
    }
  }
  return (
    <Descriptions title={""} layout={"horizontal"} column={1} colon={false} size={"small"}>
      {subItems}
    </Descriptions>
  );
};

const renderObjectArray = (fieldName: string) => ( _: any, entity: Record<string, any>) => {
  const fieldValue = entity[fieldName] as Array<any>;
  if (fieldValue === undefined || fieldValue.length === 0) {
    return "";
  }
  const subObjects = [];
  for (const item of fieldValue) {
    const subProperties = [];
    for (const propKey of Object.keys(item)) {
      const propValue = item[propKey];
      subProperties.push(<Descriptions.Item label={propKey} key={propKey}>{propValue}</Descriptions.Item>);
    }
    subObjects.push(
      <Descriptions title={""} layout={"horizontal"} column={1} colon={false} size={"small"}>
        {subProperties}
      </Descriptions>
    );
  }
  return subObjects;
};

function getProColumn(fieldName: string, fieldConfig: FieldConfig, forDetail?: boolean): ProColumns {
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
  if (fieldConfig.sortable) {
    result.sorter = true;
  }
  if (fieldConfig.filterable) {
    result.filters = true;
  }
  if (fieldConfig.columnType === ProtoType.SimpleArray) {
    if (forDetail) {
      result.render = renderSimpleArray(fieldName);
    } else {
      result.width = 200;
      result.render = ( _: any, entity: Record<string, any>) => {
        const fieldValue = entity[fieldName] as Map<any, any>;
        if (fieldValue === undefined || Object.keys(fieldValue).length === 0) {
          return "";
        }
        const size = Object.keys(fieldValue).length;
        return (<Collapse ghost accordion size={"small"}
                          items={[{
                            key: '缺省不展开',
                            label: `查看 ${size} 条内容`,
                            onClick: (e: any) => {e.stopPropagation();},
                            children: renderSimpleArray(fieldName)(null, entity)
                          }]}>
        </Collapse>)
      }}
  } else if (fieldConfig.columnType === ProtoType.SimpleMap) {
    if (forDetail) {
      result.render = renderSimpleMap(fieldName);
    } else {
      result.width = 200;
      result.render = ( _: any, entity: Record<string, any>) => {
        const fieldValue = entity[fieldName] as Map<any, any>;
        if (fieldValue === undefined || Object.keys(fieldValue).length === 0) {
          return "";
        }
        const size = Object.keys(fieldValue).length;
        return (<Collapse ghost accordion size={"small"}
                   items={[{
                       key: '缺省不展开',
                       label: `查看 ${size} 条内容`,
                       onClick: (e: any) => {e.stopPropagation();},
                       children: renderSimpleMap(fieldName)(null, entity)
                   }]}>
        </Collapse>)
      }}
  } else if (fieldConfig.columnType === ProtoType.ObjectArray) {
    if (forDetail) {
      result.render = renderObjectArray(fieldName);
    } else {
      result.width = 200;
      result.render = ( _: any, entity: Record<string, any>) => {
        const fieldValue = entity[fieldName] as Map<any, any>;
        if (fieldValue === undefined || Object.keys(fieldValue).length === 0) {
          return "";
        }
        const size = Object.keys(fieldValue).length;
        return (<Collapse ghost accordion size={"small"}
                          items={[{
                            key: '缺省不展开',
                            label: `查看 ${size} 条内容`,
                            onClick: (e: any) => {e.stopPropagation();},
                            children: renderObjectArray(fieldName)(null, entity)
                          }]}>
        </Collapse>)
      }}
  } else if (fieldConfig.columnType === ProtoType.ObjectMap) {
    result.render = ( _: any, entity: Record<string, any>) => {
      return "todo";
    }
  }
  return result;
}

export function getTableColumns<T extends Record<string, any>>(recordClass: Class<T>, onUpdateClick: (record: T) => void, onDeleteClick: (record: T) => void): ProColumns[] {
  const metadata = MetadataFactory.get(recordClass);
  const tableConfig = metadata.tableConfig();
  const fieldConfigs = metadata.fieldConfigs();
  const columns: ProColumns[] = [];
  // 生成字段对应的列
  fieldConfigs.forEach((fieldConfig, fieldName) => {
    columns.push(getProColumn(fieldName, fieldConfig));
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

export function getDetailColumns<T extends Record<string, any>>(recordClass: Class<T>): ProColumns[] {
  const metadata = MetadataFactory.get(recordClass);
  const fieldConfigs = metadata.fieldConfigs();
  const columns: ProColumns[] = [];
  // 生成字段对应的列
  fieldConfigs.forEach((fieldConfig, fieldName) => {
    columns.push(getProColumn(fieldName, fieldConfig, true));
  });
  return columns;
}
