import { ProFieldValueType } from "@ant-design/pro-utils/lib/typing";
import { ControlType, ProtoType } from "./types";

export function getControlType(protoType: ProtoType, controlType?: ControlType): ControlType {
  if (controlType !== undefined) {
    return controlType;
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
    case ProtoType.SimpleArray:
      return ControlType.SimpleArray;
    case ProtoType.SimpleMap:
      return ControlType.SimpleMap;
    case ProtoType.ObjectArray:
      return ControlType.ObjectArray;
    case ProtoType.ObjectMap:
      return ControlType.ObjectMap;
  }
}

export function getProFieldValueType(controlType: ControlType): ProFieldValueType {
  switch (controlType) {
    case ControlType.Text:
      return "text";
    case ControlType.TextDigit:
      return "digit";
    case ControlType.TextPassword:
      return "password";
    case ControlType.Select:
      return "select";
    case ControlType.TextArea:
      return "textarea";
    case ControlType.DateRangePicker:
      return "dateTime";
    case ControlType.DateTimeRangePicker:
      return "dateTime";
    case ControlType.SimpleArray:
      return "formList";
    case ControlType.SimpleMap:
      return "formList";
    case ControlType.ObjectArray:
      return "formList";
    case ControlType.ObjectMap:
      return "formList";
  }
}
