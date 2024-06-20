import { getControlType, FieldConfig } from "@/utils/types";
import { ProSchema } from "@ant-design/pro-utils/lib";
import { contentTypeMap } from "@/pages/list/video-collection/constants";

export function getColumnProp(fieldName: string, fieldConfig: FieldConfig): ProSchema {
  const controlType = getControlType(fieldConfig.columnType, fieldConfig.controlTypeInSearchForm);
  return {
    title: fieldConfig.description,
    dataIndex: fieldName,
    valueType: 'select',
    valueEnum: contentTypeMap,
    fieldProps: { mode: 'multiple', placeholder: 'Select one or more', },
    render: ( _, entity) => contentTypeMap.get(entity.contentType),
  }
}
