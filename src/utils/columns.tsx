import { getControlType, FieldConfig, getControlTypeString, ControlType, showInSearch } from "@/utils/types";
import { ProColumns } from "@ant-design/pro-components";
import { DatePicker } from "antd";

export function getColumnProps(fieldName: string, fieldConfig: FieldConfig): ProColumns {
  const searchControlType = getControlType(fieldConfig.columnType, fieldConfig.controlTypeInSearchForm);
  const result: ProColumns = {
    title: fieldConfig.description,
    dataIndex: fieldName,
    valueType: getControlTypeString(searchControlType),
    valueEnum: fieldConfig.displayValueMapping,
  }
  if (fieldConfig.displayValueMapping !== undefined) {
    result.fieldProps = { mode: 'multiple', placeholder: '请选择', };
    // result.render = ( _: any, entity: Record<string, any>) => (fieldConfig.displayValueMapping?.get(entity[fieldName]))
  }
  // valueType 字段会同时应用于 list 和 searchForm，如果 search 的控件是日期范围类型，必须另外指定 renderFormItem
  if (searchControlType === ControlType.DateRangePicker) {
    result.renderFormItem = () => {
      return (<DatePicker.RangePicker />);
    };
  } else if (searchControlType === ControlType.DateTimeRangePicker) {
    result.renderFormItem = () => {
      return (<DatePicker.RangePicker showTime />);
    };
  }
  if (!showInSearch(fieldConfig.visibility)) {
    result.hideInForm = true;
  }
  return result;
}
