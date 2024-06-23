import { FC } from "react";
import { ProFormFieldItemProps, ProFormFieldRemoteProps } from "@ant-design/pro-form/es/typing";
import {
  ProFormDateRangePicker,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from "@ant-design/pro-form";
import { ControlType } from "@/utils/types";
import { FieldConfigOptional } from "@/utils/decorators";
import { getControlType } from "@/utils/controltype";

type FieldItemProps = FieldConfigOptional & ProFormFieldItemProps & ProFormFieldRemoteProps & {
  fieldName: string,
}

export const FormField: FC<FieldItemProps> = (props: FieldItemProps) => {
  const newProps = {...props}
  newProps.name = newProps.fieldName;
  if (newProps.required) {
    newProps.rules = [{
      required: true,
      message: newProps.description + "必须输入",
    }];
  }
  if (newProps.description) {
    newProps.label = newProps.description;
  } else {
    newProps.label = newProps.fieldName;
  }
  newProps.width = "lg";
  if (newProps.displayValueMapping) {
    newProps.valueEnum = newProps.displayValueMapping;
  }
  const controlType: ControlType = getControlType(newProps.columnType,  newProps.editControlType);
  switch (controlType) {
    case ControlType.Text:
      return (<ProFormText {...newProps}
      />);
    case ControlType.TextArea:
      return (<ProFormTextArea {...newProps}
      />);
    case ControlType.TextDigit:
      return (<ProFormDigit {...newProps}
      />);
    case ControlType.TextPassword:
      return (<ProFormText.Password {...newProps}
      />);
    case ControlType.Select:
      return (<ProFormSelect {...newProps}
      />);
    case ControlType.DateRangePicker:
      return (<ProFormDateRangePicker {...newProps}
      />);
    case ControlType.DateTimeRangePicker:
      return (<ProFormDateTimeRangePicker {...newProps}
      />);
    default:
      return (<span>不支持的控件类型: {controlType}</span>);
  }
};
