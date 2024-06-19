import { FC } from "react";
import { ProFormFieldItemProps, ProFormFieldRemoteProps } from "@ant-design/pro-form/es/typing";
import {
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from "@ant-design/pro-form";
import { ProtoType } from "@/utils/types";
import { ProFormDateTimeRangePicker } from "@ant-design/pro-form";

export enum ControlType {
  Text,
  TextDigit,
  TextPassword,
  TextArea,
  Select,
  DateRangePicker,
  DateTimeRangePicker,
}

type FieldInfo = {
  fieldName: string,
  protoType: ProtoType,
  displayType?: ControlType,
  description: string,
  required?: boolean,
  displayValueMapping?: Map<any, any>;
}

export function defaultDisplayType(protoType: ProtoType, displayType?: ControlType): ControlType {
  if (displayType !== undefined) {
    return displayType;
  }
  switch (protoType) {
    case ProtoType.DoubleValue:
    case ProtoType.FloatValue:
    case ProtoType.Int32Value:
    case ProtoType.UInt32Value:
    case ProtoType.Int64Value:
    case ProtoType.UInt64Value:
      return ControlType.TextDigit;
    case ProtoType.StringValue:
      return ControlType.Text;
    case ProtoType.BoolValue:
      return ControlType.Select;
    case ProtoType.Date:
      return ControlType.DateRangePicker;
    case ProtoType.DateTime:
      return ControlType.DateTimeRangePicker;
  }
}

type FieldItemProps = FieldInfo & ProFormFieldItemProps & ProFormFieldRemoteProps

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
  const displayType = defaultDisplayType(newProps.protoType,  newProps.displayType);
  switch (displayType) {
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
  }
};
