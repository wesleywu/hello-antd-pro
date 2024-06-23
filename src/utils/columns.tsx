import { ProColumns, ProDescriptions, ProDescriptionsItemProps } from "@ant-design/pro-components";
import { Collapse, DatePicker, Descriptions, Divider, Popconfirm, Space } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { JSX } from "react/jsx-runtime";

import { MetadataFactory, showInList, showInSearch } from "./metadata";
import { Class, ControlType, ProtoType } from "./types";
import { FieldConfig } from "./decorators";
import { getControlType, getProFieldValueType } from "./controltype";

export type SimpleArrayValueWrapper<T> = {
  value: T;
}

export type SimpleMapValueWrapper<T> = {
  key: string;
  value: T;
}

/**
 * unwrapSimpleArray 将 [{value: "1"}, {value: "2"}] 转换为 ["1", "2"]
 * @param value
 */
function unwrapSimpleArray(value: SimpleArrayValueWrapper<any>[]): any[] {
  return value.map((item) => item.value);
}

/**
 * unwrapSimpleMap 将 [{"key": "key1", "value": "value1"}, {"key": "key2", "value": "value2"}] 转换为 [{key1: "value1"}, {key2: "value2"}]
 * @param fieldValue
 */
function unwrapSimpleMap(fieldValue: SimpleMapValueWrapper<any>[]): any {
  const result = {};
  for (const item of fieldValue) {
    result[item.key] = item.value;
  }
  return result;
}

/**
 * unwrapFieldsValue 将 [{value: "1"}, {value: "2"}] 转换为 ["1", "2"]
 * @param value
 * @param fieldsNeedUnwrapping
 */
export function unwrapFieldsValue<T extends Record<string, any>>(value: T, fieldsNeedUnwrapping: Map<string, FieldConfig>): T {
  console.log("value before unwrapping", value);
  const unwrappedValue: Record<string, any> = Object.assign({}, value);
  for (const fieldName of Object.keys(value)) {
    if (fieldsNeedUnwrapping.has(fieldName)) {
      switch (fieldsNeedUnwrapping.get(fieldName)?.columnType) {
        case ProtoType.SimpleArray:
          unwrappedValue[fieldName] = unwrapSimpleArray(value[fieldName]);
          break;
        case ProtoType.SimpleMap:
          unwrappedValue[fieldName] = unwrapSimpleMap(value[fieldName]);
          break;
        case ProtoType.ObjectArray:
          unwrappedValue[fieldName] = value[fieldName];
          break;
        // case ProtoType.ObjectMap:
        //   unwrappedValue[fieldName] = unwrapObjectArray(value[fieldName]);
        //   break;
        default:
          unwrappedValue[fieldName] = unwrapSimpleArray(value[fieldName])
          break;
      }
    }
  }
  console.log("value after unwrapping", unwrappedValue);
  return unwrappedValue as T;
}

function wrapSimpleArray(value: any): SimpleArrayValueWrapper<any>[] {
  if (Array.isArray(value)) {
    const result = value.map((item) => ({ value: item }));
    console.log("wrapSimpleArray: value after wrapping", result);
    return result;
  } else {
    return [{ value }];
  }
}

function wrapSimpleMap(value: any): SimpleMapValueWrapper<any>[] {
  if (value instanceof Map) {
    const entries = Array.from(value.entries());
    const result = entries.map(([key, value]) => ({ key, value }));
    console.log("wrapSimpleMap: value after wrapping", result);
    return result;
  } else {
    console.log("wrapSimpleMap: value before wrapping", value);
    const result: SimpleMapValueWrapper<any>[] = [];
    for (const fieldName of Object.keys(value)) {
      result.push({
        key: fieldName,
        value: value[fieldName]
      })
    }
    console.log("wrapSimpleMap: value after wrapping", result);
    return result;
  }
}

export function wrapFieldsValue<T extends Record<string, any>>(value: T, fieldsNeedUnwrapping: Map<string, FieldConfig>): Partial<T>  {
  if (!value) {
    return value;
  }
  console.log("fieldsNeedUnwrapping", fieldsNeedUnwrapping);
  const wrappedValue: Record<string, any> = Object.assign({}, value);
  for (const fieldName of Object.keys(value)) {
    if (fieldsNeedUnwrapping.has(fieldName)) {
      switch (fieldsNeedUnwrapping.get(fieldName)?.columnType) {
        case ProtoType.SimpleArray:
          wrappedValue[fieldName] = wrapSimpleArray(value[fieldName]);
          break;
        case ProtoType.SimpleMap:
          console.log("wrapping field", fieldName, value[fieldName])
          wrappedValue[fieldName] = wrapSimpleMap(value[fieldName]);
          console.log("wrapping field result", fieldName, wrappedValue[fieldName])
          break;
        case ProtoType.ObjectArray:
          console.log("wrapping field", fieldName, value[fieldName])
          wrappedValue[fieldName] = value[fieldName];
          // unwrappedValue[fieldName] = unwrapObjectArray(value[fieldName]);
          break;
        // case ProtoType.ObjectMap:
        //   unwrappedValue[fieldName] = unwrapObjectArray(value[fieldName]);
        //   break;
        default:
          wrappedValue[fieldName] = wrapSimpleArray(value[fieldName])
          break;
      }
    }
  }
  return wrappedValue as T;
}

const renderSimpleArray = (fieldName: string) => ( entity: Record<string, any>) => {
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

const renderSimpleMap = (fieldName: string) => (entity: Record<string, any>) => {
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

function getProColumnNoSubElement(fieldName: string, fieldConfig: FieldConfig): ProColumns {
  const searchControlType = getControlType(fieldConfig.columnType, fieldConfig.searchControlType);
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
  if (!showInSearch(fieldConfig.visibility)) {
    result.hideInSearch = true;
  }
  if (fieldConfig.sortable) {
    result.sorter = true;
  }
  if (fieldConfig.filterable) {
    result.filters = true;
  }
  return result;
}

export function getDetailColumnsNoSubElement<T extends Record<string, any>>(recordClass: Class<T>): ProColumns[] {
  const metadata = MetadataFactory.get(recordClass);
  const fieldConfigs = metadata.fieldConfigs();
  const columns: ProColumns[] = [];
  // 生成字段对应的列
  fieldConfigs?.forEach((fieldConfig, fieldName) => {
    columns.push(getProColumnNoSubElement(fieldName, fieldConfig));
  });
  return columns;
}

const renderObjectArray = (fieldName: string, fieldConfig: FieldConfig) => (entity: Record<string, any>) => {
  // console.log("0_entity", entity);
  // console.log("1_renderObjectArray", fieldName);
  const fieldValue = entity[fieldName] as Array<any>;
  // console.log("2_fieldValue", fieldValue);
  if (fieldValue === undefined || fieldValue.length === 0) {
    return "";
  }
  const subObjects = [];
  if (fieldConfig.subElementClass) { // 如果当前列定义了子元素的 class，那么直接通过子元素的 class 元数据来渲染
    const subElementColumns = getDetailColumnsNoSubElement(fieldConfig.subElementClass) as ProDescriptionsItemProps[];
    // console.log("subElementColumns", subElementColumns);
    for (let i = 0; i < fieldValue.length; i++) {
      const item = fieldValue[i];
      subObjects.push(
        <ProDescriptions
          key={i}
          params={item}
          column={ 1 }
          columns={ subElementColumns }
          title={ '' }
          request={ async () => ({
            data: item || {},
          }) }
        />
      )
    }
    return (
      <Space direction="vertical" size={"small"} split={<Divider type="horizontal" style={{ margin: '0px 0'}} />}>
        {subObjects}
      </Space>
    );
  }
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
  return (
    <Space direction="vertical" size={"small"} split={<Divider type="horizontal" style={{ margin: '0px 0'}} />}>
      {subObjects}
    </Space>
  );
};

function getProColumn(fieldName: string, fieldConfig: FieldConfig, forDetail?: boolean): ProColumns {
  // console.log('getProColumn', fieldName);
  const result: ProColumns = getProColumnNoSubElement(fieldName, fieldConfig);
  if (fieldConfig.columnType === ProtoType.SimpleArray) {
    if (forDetail) {
      result.render = ( _: any, entity: Record<string, any>) => {
        return renderSimpleArray(fieldName)(entity);
      }
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
                            children: renderSimpleArray(fieldName)(entity)
                          }]}>
        </Collapse>)
      }}
  } else if (fieldConfig.columnType === ProtoType.SimpleMap) {
    if (forDetail) {
      result.render = ( _: any, entity: Record<string, any>) => {
        return renderSimpleMap(fieldName)(entity);
      }
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
                       children: renderSimpleMap(fieldName)(entity)
                   }]}>
        </Collapse>)
      }}
  } else if (fieldConfig.columnType === ProtoType.ObjectArray) {
    if (forDetail) {
      // console.log("0_ObjectArray", fieldConfig);
      result.render = ( _: any, entity: Record<string, any>) => {
        return renderObjectArray(fieldName, fieldConfig)(entity);
      };
    } else {
      result.width = 200;
      result.render = ( node: any, entity: Record<string, any>) => {
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
                            children: renderObjectArray(fieldName, fieldConfig)(entity)
                          }]}>
        </Collapse>)
      }}
  } else if (fieldConfig.columnType === ProtoType.ObjectMap) {
    result.render = () => {
      return "todo";
    }
  }
  return result;
}

export function getTableColumns<T extends Record<string, any>>(recordClass: Class<T>, onUpdateClick: (record: T) => void, onDeleteClick: (record: T) => void): ProColumns[] {
  // console.log('getTableColumns', recordClass);
  const metadata = MetadataFactory.get(recordClass);
  const tableConfig = metadata.tableConfig();
  const fieldConfigs = metadata.fieldConfigs();
  const columns: ProColumns[] = [];
  // 生成字段对应的列
  fieldConfigs?.forEach((fieldConfig, fieldName) => {
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
  // console.log('getDetailColumns', recordClass);
  const metadata = MetadataFactory.get(recordClass);
  const fieldConfigs = metadata.fieldConfigsForDetail();
  const columns: ProColumns[] = [];
  // 生成字段对应的列
  fieldConfigs?.forEach((fieldConfig, fieldName) => {
    columns.push(getProColumn(fieldName, fieldConfig, true));
  });
  // console.log("detail columns:", columns);
  return columns;
}
