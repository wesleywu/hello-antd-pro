import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js"
import { FieldConfig, MultiType, OperatorType, ProtoType, SearchConfig } from "./types";

dayjs.extend(utc)
dayjs.extend(timezone)

// 单数据
const singleProtoTypeMapping = new Map<ProtoType, string>([
  [ProtoType.DoubleValue, 'google.protobuf.DoubleValue'],
  [ProtoType.FloatValue, 'google.protobuf.FloatValue'],
  [ProtoType.Int64Value, 'google.protobuf.Int64Value'],
  [ProtoType.UInt64Value, 'google.protobuf.UInt64Value'],
  [ProtoType.Int32Value, 'google.protobuf.Int32Value'],
  [ProtoType.UInt32Value, 'google.protobuf.UInt32Value'],
  [ProtoType.BoolValue, 'google.protobuf.BoolValue'],
  [ProtoType.StringValue, 'google.protobuf.StringValue'],
  [ProtoType.Date, 'google.protobuf.Timestamp'],
  [ProtoType.DateTime, 'google.protobuf.Timestamp'],
]);

const multiProtoTypeMapping = new Map<ProtoType, string>([
  [ProtoType.DoubleValue, 'goguru.types.DoubleSlice'],
  [ProtoType.FloatValue, 'goguru.types.FloatSlice'],
  [ProtoType.Int64Value, 'goguru.types.Int64Slice'],
  [ProtoType.UInt64Value, 'goguru.types.UInt64Slice'],
  [ProtoType.Int32Value, 'goguru.types.Int32Slice'],
  [ProtoType.UInt32Value, 'goguru.types.UInt32Slice'],
  [ProtoType.BoolValue, 'goguru.types.BoolSlice'],
  [ProtoType.StringValue, 'goguru.types.StringSlice'],
  [ProtoType.Date, 'goguru.types.TimestampSlice'],
  [ProtoType.DateTime, 'goguru.types.TimestampSlice'],
]);

export function conditionNumberBoolValue<T>(fieldConfig: FieldConfig, searchConfig: SearchConfig, fieldValue: T): string {
  return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "operator": "${searchConfig.operator}",
      "value":{
        "@type":"${singleProtoTypeMapping.get(fieldConfig.columnType)}",
        "value":${fieldValue}
      }
    }`
}

export function conditionStringValue(fieldConfig: FieldConfig, searchConfig: SearchConfig, fieldValue: string): string {
  return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "operator": "${searchConfig.operator}",
      "value":{
        "@type":"${singleProtoTypeMapping.get(fieldConfig.columnType)}",
        "value":"${fieldValue}"
      }
    }`
}

export function conditionNumberBoolSlice<T>(fieldConfig: FieldConfig, searchConfig: SearchConfig, fieldValue: Array<T>): string {
  if (fieldValue.length === 0) {
    return '';
  }
  if (fieldValue.length === 1) {
    return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "operator": "${OperatorType.EQ}",
      "value":{
        "@type":"${singleProtoTypeMapping.get(fieldConfig.columnType)}",
        "value":${fieldValue[0]}
      }
    }`;
  }
  let multiType = searchConfig.multi;
  if (multiType === MultiType.NoMulti) {
    multiType = MultiType.In;
  }
  if (multiType === MultiType.In || multiType === MultiType.NotIn) {
    return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "multi": "${multiType}",
      "value":{
        "@type":"${multiProtoTypeMapping.get(fieldConfig.columnType)}",
        "value":[${fieldValue.filter(value => value !== undefined).join(',')}]
      }
    }`;
  }
  // now this.multiType should be MultiType.Between or MultiType.NotBetween
  if (fieldValue.length !== 2) {
    console.error(`element count of ${fieldConfig.fieldName} property array should be exactly 2 for MultiType ${multiType}`);
    return '';
  }
  return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "multi": "${multiType}",
      "value":{
        "@type":"${multiProtoTypeMapping.get(fieldConfig.columnType)}",
        "value":[${fieldValue.join(',')}]
      }
    }`;
}

export function conditionStringSlice(fieldConfig: FieldConfig, searchConfig: SearchConfig, fieldValue: Array<string>): string {
  if (fieldValue.length === 0) {
    return '';
  }
  if (fieldValue.length === 1) {
    return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"${singleProtoTypeMapping.get(fieldConfig.columnType)}",
        "value":"${fieldValue[0]}"
      }
    }`;
  }
  let multiType = searchConfig.multi;
  if (multiType === MultiType.NoMulti) {
    multiType = MultiType.In;
  }
  if (multiType === MultiType.In || multiType === MultiType.NotIn) {
    return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "multi": "${multiType}",
      "value":{
        "@type":"${multiProtoTypeMapping.get(fieldConfig.columnType)}",
        "value":[${fieldValue.map((value) => {return"\""+value+"\""}).join(',')}]
      }
    }`;
  }
  // now this.multiType should be MultiType.Between or MultiType.NotBetween
  if (fieldValue.length !== 2) {
    console.error(`element count of ${fieldConfig.fieldName} property array should be exactly 2 for MultiType ${multiType}`);
    return '';
  }
  return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "multi": "${multiType}",
      "value":{
        "@type":"${multiProtoTypeMapping.get(fieldConfig.columnType)}",
        "value":[${fieldValue.map((value) => {return"\""+value+"\""}).join(',')}]
      }
    }`;
}

export function conditionDateBetween(fieldConfig: FieldConfig, searchConfig: SearchConfig, dateArray: Array<dayjs.Dayjs | undefined>): string {
  if (dateArray.length === 0) {
    return '';
  }
  if (dateArray.length !== 2) {
    console.error(`element count of ${fieldConfig.fieldName} field value array should be exactly 2 for date between condition`);
    return '';
  }
  const dateStart = dateArray[0] === undefined || !dateArray[0]?.isValid() ? undefined : dateArray[0].set('h', 0).set('m', 0).set('s', 0).set('ms', 0).tz('Asia/Shanghai').toISOString();
  const dateEnd = dateArray[1] === undefined || !dateArray[1]?.isValid() ? undefined : dateArray[1].set('h', 0).set('m', 0).set('s', 0).set('ms', 0).tz('Asia/Shanghai').add(1, 'day').subtract(1, 'ms').toISOString();
  if (dateStart === undefined && dateEnd === undefined) {
    return '';
  }
  if (dateEnd === undefined) {
    return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "operator": "GTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["${dateStart}"]
      }
    }`;
  }
  if (dateStart === undefined) {
    return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "operator": "LTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["${dateEnd}"]
      }
    }`;
  }
  return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "multi": "Between",
      "value":{
        "@type":"goguru.types.TimestampSlice",
        "value":["${dateStart}","${dateEnd}"]
      }
    }`;
}

export function conditionDateTimeBetween(fieldConfig: FieldConfig, searchConfig: SearchConfig, dateArray: Array<dayjs.Dayjs | undefined>): string {
  if (dateArray.length === 0) {
    return '';
  }
  if (dateArray.length !== 2) {
    console.error(`element count of ${fieldConfig.fieldName} field value array should be exactly 2 for datetime between condition`);
    return '';
  }
  const dateStart = dateArray[0] === undefined || !dateArray[0]?.isValid() ? undefined : dateArray[0].tz('Asia/Shanghai').toISOString();
  const dateEnd = dateArray[1] === undefined || !dateArray[1]?.isValid() ? undefined : dateArray[1].tz('Asia/Shanghai').toISOString();
  if (dateStart === undefined && dateEnd === undefined) {
    return '';
  }
  if (dateEnd === undefined) {
    return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "operator": "GTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["${dateStart}"]
      }
    }`;
  }
  if (dateStart === undefined) {
    return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "operator": "LTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["${dateEnd}"]
      }
    }`;
  }
  return `"${fieldConfig.fieldName}": {
      "@type":"goguru.orm.Condition",
      "multi": "Between",
      "value":{
        "@type":"goguru.types.TimestampSlice",
        "value":["${dateStart}","${dateEnd}"]
      }
    }`;
}

function isArrayAndElementType(fieldName: string, fieldValue: any, destElementType: string, allowUndefined: boolean = true, logErrors: boolean = true): boolean {
  if (!Array.isArray(fieldValue)) {
    if (logErrors) console.error(`type of ${fieldName} field should be array`)
    return false;
  }
  const isAllElementTypeMatch = fieldValue.every(function(item){
    if (allowUndefined) {
      return typeof item === destElementType || item === undefined;
    } else {
      return typeof item === destElementType;
    }
  })
  if (!isAllElementTypeMatch) {
    if (logErrors) console.error(`element of ${fieldName} field should be ${destElementType}`)
    return false;
  }
  return true
}

export function toCondition(fieldConfig: FieldConfig, searchConfig: SearchConfig, fieldValue: any): string {
  const fieldName = fieldConfig.fieldName
  if (fieldConfig.columnType === ProtoType.DoubleValue || fieldConfig.columnType === ProtoType.FloatValue || fieldConfig.columnType === ProtoType.Int64Value || fieldConfig.columnType === ProtoType.UInt64Value || fieldConfig.columnType === ProtoType.Int32Value || fieldConfig.columnType === ProtoType.UInt32Value) {
    if (typeof fieldValue === 'number') {
      return conditionNumberBoolValue(fieldConfig, searchConfig, fieldValue as number);
    } else if (isArrayAndElementType(fieldName, fieldValue , "number", false)) {
      return conditionNumberBoolSlice(fieldConfig, searchConfig, fieldValue as Array<number>);
    } else {
      console.error(`type of ${fieldName} field should be string or Array<number>`)
      return '';
    }
  } else if (fieldConfig.columnType === ProtoType.BoolValue) {
    if (typeof fieldValue === 'boolean') {
      return conditionNumberBoolValue(fieldConfig, searchConfig, fieldValue as boolean);
    } else if (isArrayAndElementType(fieldName, fieldValue , "boolean", false)) {
      return conditionNumberBoolSlice(fieldConfig, searchConfig, fieldValue as Array<boolean>);
    } else {
      console.error(`type of ${fieldName} field should be string or Array<boolean>`)
      return '';
    }
  } else if (fieldConfig.columnType === ProtoType.StringValue) {
    if (typeof fieldValue === 'string') {
      return conditionStringValue(fieldConfig, searchConfig, fieldValue as string);
    } else if (isArrayAndElementType(fieldName, fieldValue , "string", false)) {
      return conditionStringSlice(fieldConfig, searchConfig, fieldValue as Array<string>);
    } else {
      console.error(`type of ${fieldName} field should be string or Array<string>`)
      return '';
    }
  } else if (fieldConfig.columnType === ProtoType.Date) {
    if (isArrayAndElementType(fieldConfig.fieldName, fieldValue, "string")) {
      const dateArray = fieldValue.map((value: string | undefined) => {
        if (value === undefined) return undefined;
        return dayjs(value);
      });
      return conditionDateBetween(fieldConfig, searchConfig, dateArray as Array<dayjs.Dayjs | undefined>);
    } else {
      return '';
    }
  } else if (fieldConfig.columnType === ProtoType.DateTime) {
    if (isArrayAndElementType(fieldConfig.fieldName, fieldValue, "string")) {
      const dateArray = fieldValue.map((value: string | undefined) => {
        if (value === undefined) return undefined;
        return dayjs(value);
      });
      return conditionDateTimeBetween(fieldConfig, searchConfig, dateArray as Array<dayjs.Dayjs | undefined>);
    } else {
      return '';
    }
  } else {
    return '';
  }
}
