import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"
import type { SortOrder } from "antd/lib/table/interface";
import { PageRequest, Sort } from "@/pages/list/video-collection/data";

dayjs.extend(utc)
dayjs.extend(timezone)

export enum ProtoType {
  DoubleValue,
  FloatValue,
  Int64Value,
  UInt64Value,
  Int32Value,
  UInt32Value,
  BoolValue,
  StringValue,
  DoubleSlice,
  FloatSlice,
  Int64Slice,
  UInt64Slice,
  Int32Slice,
  UInt32Slice,
  BoolSlice,
  StringSlice,
  DateBetween,
  DateTimeBetween,
}

const protoTypeNameMap = new Map<ProtoType, string>([
  [ProtoType.DoubleValue, 'google.protobuf.DoubleValue'],
  [ProtoType.FloatValue, 'google.protobuf.FloatValue'],
  [ProtoType.Int64Value, 'google.protobuf.Int64Value'],
  [ProtoType.UInt64Value, 'google.protobuf.UInt64Value'],
  [ProtoType.Int32Value, 'google.protobuf.Int32Value'],
  [ProtoType.UInt32Value, 'google.protobuf.UInt32Value'],
  [ProtoType.BoolValue, 'google.protobuf.BoolValue'],
  [ProtoType.StringValue, 'google.protobuf.StringValue'],
  [ProtoType.DoubleSlice, 'goguru.types.DoubleSlice'],
  [ProtoType.FloatSlice, 'goguru.types.FloatSlice'],
  [ProtoType.Int64Slice, 'goguru.types.Int64Slice'],
  [ProtoType.UInt64Slice, 'goguru.types.UInt64Slice'],
  [ProtoType.Int32Slice, 'goguru.types.Int32Slice'],
  [ProtoType.UInt32Slice, 'goguru.types.UInt32Slice'],
  [ProtoType.BoolSlice, 'goguru.types.BoolSlice'],
  [ProtoType.StringSlice, 'goguru.types.StringSlice'],
  [ProtoType.DateBetween, 'goguru.types.TimestampSlice'],
  [ProtoType.DateTimeBetween, 'goguru.types.TimestampSlice'],
]);

export enum OperatorType {
  EQ = 'EQ',
  NE = 'NE',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  Like = 'Like',
  NotLike = 'NotLike',
  Null = 'Null',
  NotNull = 'NotNull',
}

export enum MultiType {
  NoMulti = 'NoMulti',
  Between = 'Between',
  NotBetween = 'NotBetween',
  In = 'In',
  NotIn = 'NotIn',
}

export enum WildcardType {
  NoWildcard = 'NoWildcard',
  Contains = 'Contains',
  StartsWith = 'StartsWith',
  EndsWith = 'EndsWith',
}

export class RequestParamConfig {
  name: string;
  protoType: ProtoType = ProtoType.StringValue;
  operatorType: OperatorType = OperatorType.EQ;
  multiType: MultiType = MultiType.NoMulti;
  wildcardType: WildcardType = WildcardType.NoWildcard;

  constructor(name: string, protoType: ProtoType, operatorType?: OperatorType, multi?: MultiType, wildcard?: WildcardType) {
    this.name = name;
    this.protoType = protoType;
    if (operatorType) {
      const operatorTypeEnum = operatorType as OperatorType;
      if (Object.values(OperatorType).indexOf(operatorTypeEnum) >= 0) {
        this.operatorType = operatorTypeEnum;
      } else {
        console.error('Unrecognized OperatorType: ' + operatorType);
      }
    }
    if (multi) {
      const multiTypeEnum = multi as MultiType;
      if (Object.values(MultiType).indexOf(multiTypeEnum) >= 0) {
        this.multiType = multiTypeEnum;
      } else {
        console.error('Unrecognized MultiType: ' + multi);
      }
    }
    if (wildcard) {
      const wildcardTypeEnum = wildcard as WildcardType;
      if (Object.values(WildcardType).indexOf(wildcardTypeEnum) >= 0) {
        this.wildcardType = wildcardTypeEnum;
      } else {
        console.error('Unrecognized WildcardType: ' + wildcard);
      }
    }
  }

  private conditionNumberValue(paramsObj: object, protoType: ProtoType): string {
    const paramValue = paramsObj[this.name];
    if (paramValue === undefined) {
      return '';
    }
    if (typeof paramValue !== 'number' ) {
      console.error('type of ' + this.name + ' property of params should be Number')
      return '';
    }
    return `"${this.name}": {
      "@type":"goguru.types.Condition",
      "operator": "${this.operatorType}", 
      "value":{
        "@type":"${protoTypeNameMap.get(protoType)}",
        "value":${paramValue}
      }
    }`
  }

  private conditionBoolValue(paramsObj: object): string {
    const paramValue = paramsObj[this.name];
    if (paramValue === undefined) {
      return '';
    }
    if (typeof paramValue !== 'boolean' ) {
      console.error('type of ' + this.name + ' property of params should be Boolean')
      return '';
    }
    return `"${this.name}": {
      "@type":"goguru.types.Condition",
      "operator": "${this.operatorType}", 
      "value":{
        "@type":"${protoTypeNameMap.get(ProtoType.BoolValue)}",
        "value":${paramValue}
      }
    }`
  }

  private conditionStringValue(paramsObj: object): string {
    const paramValue = paramsObj[this.name];
    if (paramValue === undefined) {
      return '';
    }
    if (typeof paramValue !== 'string' ) {
      console.error('type of ' + this.name + ' property of params should be String')
      return '';
    }
    if (String(paramValue).trim().length === 0) {
      return '';
    }
    return `"${this.name}": {
      "@type":"goguru.types.Condition",
      "operator": "${this.operatorType}", 
      "wildcard": "${this.wildcardType}",
      "value":{
        "@type":"${protoTypeNameMap.get(ProtoType.StringValue)}",
        "value":"${paramValue}"
      }
    }`
  }

  private conditionNumberSlice(paramsObj: object, protoType: ProtoType, singleValueProtoType: ProtoType): string {
    const paramValue = paramsObj[this.name];
    if (!paramValue) {
      return '';
    }
    if (!Array.isArray(paramValue)) {
      console.error('type of ' + this.name + ' property of params should be Array');
      return '';
    }
    if (paramValue.length === 0) {
      return '';
    }
    if (this.multiType === MultiType.NoMulti) {
      console.error(`type of ${this.name} property of params is Array, but MultiType is ${this.multiType}`);
      return '';
    }
    const paramValueArray: Array<number> = paramValue as Array<number>;
    if (this.multiType === MultiType.In || this.multiType === MultiType.NotIn) {
      return `"${this.name}": {
        "@type":"goguru.types.Condition",
        "multi": "${this.multiType}",
        "value":{
          "@type":"${protoTypeNameMap.get(protoType)}",
          "value":[${paramValueArray.filter(value => value !== undefined).join(',')}]
        }
      }`;
    }
    // now this.multiType should be MultiType.Between or MultiType.NotBetween
    if (paramValueArray.length !== 2) {
      console.error(`element count of ${this.name} property array should be exactly 2 for MultiType ${this.multiType}`);
      return '';
    }
    if (paramValueArray[0] === undefined && paramValueArray[1] === undefined) {
      return '';
    }
    if (paramValueArray[0] === undefined) {
      return `"${this.name}": {
        "@type":"goguru.types.Condition",
        "operator": "${this.multiType === MultiType.Between ? OperatorType.LTE : OperatorType.GT}",
        "value":{
          "@type":"${protoTypeNameMap.get(singleValueProtoType)}",
          "value": ${paramValueArray[1]}
        }
      }`;
    }
    if (paramValueArray[1] === undefined) {
      return `"${this.name}": {
        "@type":"goguru.types.Condition",
        "operator": "${this.multiType === MultiType.Between ? OperatorType.GTE : OperatorType.LT}",
        "value":{
          "@type":"${protoTypeNameMap.get(singleValueProtoType)}",
          "value": ${paramValueArray[0]}
        }
      }`;
    }
    return `"${this.name}": {
      "@type":"goguru.types.Condition",
      "multi": "${this.multiType}",
      "value":{
        "@type":"${protoTypeNameMap.get(protoType)}",
        "value":[${paramValueArray.join(',')}]
      }
    }`;
  }

  private conditionBoolSlice(paramsObj: object): string {
    const paramValue = paramsObj[this.name];
    if (paramValue === undefined) {
      return '';
    }
    if (!Array.isArray(paramValue)) {
      console.error('type of ' + this.name + ' property of params should be Array')
      return '';
    }
    if (this.multiType === MultiType.NoMulti) {
      console.error(`type of ${this.name} property of params is Array, but MultiType is ${this.multiType}`);
      return '';
    }
    const paramValueArray: Array<boolean> = (paramValue as Array<boolean>).filter(value => value !== undefined);
    if (paramValueArray.length === 0) {
      return '';
    }
    if ((this.multiType === MultiType.Between || this.multiType === MultiType.NotBetween) && paramValueArray.length !== 2) {
      console.error(`element count of ${this.name} property array should be exactly 2 for MultiType ${this.multiType}`);
      return '';
    }
    return `"${this.name}": {
      "@type":"goguru.types.Condition",
      "multi": "${this.multiType}",
      "value":{
        "@type":"${protoTypeNameMap.get(ProtoType.BoolSlice)}",
        "value":[${paramValueArray.join(',')}]
      }
    }`;
  }

  private conditionStringSlice(paramsObj: object): string {
    const paramValue = paramsObj[this.name];
    if (paramValue === undefined) {
      return '';
    }
    if (!Array.isArray(paramValue)) {
      console.error('type of ' + this.name + ' property of params should be Array');
      return '';
    }
    if (this.multiType === MultiType.NoMulti) {
      console.error(`type of ${this.name} property of params is Array, but MultiType is ${this.multiType}`);
      return '';
    }
    const paramValueArray: Array<string> = [];
    (paramValue as Array<never>).forEach(value => {
      if (typeof value === 'string') {
        paramValueArray.push('"' + value + '"');
      } else {
        console.error('element type of ' + this.name + ' property of params should be String');
      }
    })
    if (paramValueArray.length === 0) {
      return '';
    }
    if ((this.multiType === MultiType.Between || this.multiType === MultiType.NotBetween) && paramValueArray.length !== 2) {
      console.error(`element count of ${this.name} property array should be exactly 2 for MultiType ${this.multiType}`);
      return '';
    }
    return `"${this.name}": {
      "@type":"goguru.types.Condition",
      "multi": "${this.multiType}",
      "value":{
        "@type":"${protoTypeNameMap.get(ProtoType.StringSlice)}",
        "value":[${(paramValueArray).join(',')}]
      }
    }`;
  }

  private conditionDateBetween(paramsObj: object): string {
    const paramValue = paramsObj[this.name];
    if (paramValue === undefined) {
      return '';
    }
    if (!Array.isArray(paramValue)) {
      console.error('type of ' + this.name + ' property should be Array');
      return '';
    }
    const paramValueArray: Array<string> = [];
    (paramValue as Array<never>).forEach(value => {
      if (typeof value === 'string') {
        paramValueArray.push(value);
      } else {
        console.error('element type of ' + this.name + ' property array should be String');
      }
    })
    if (paramValueArray.length === 0) {
      return '';
    }
    if (this.multiType in [MultiType.Between, MultiType.NotBetween] && paramValueArray.length !== 2) {
      console.error(`element count of ${this.name} property array should be exactly 2 for MultiType ${this.multiType}`);
      return '';
    }
    const dateStart = dayjs(paramValueArray[0]).tz('Asia/Shanghai').toISOString();
    const dateEnd = dayjs(paramValueArray[1]).tz('Asia/Shanghai').add(1, 'day').subtract(1, 'ms').toISOString();
    return `"${this.name}": {
      "@type":"goguru.types.Condition",
      "multi": "${this.multiType}",
      "value":{
        "@type":"${protoTypeNameMap.get(ProtoType.DateBetween)}",
        "value":["${dateStart}","${dateEnd}"]
      }
    }`;
  }

  private conditionDateTimeBetween(paramsObj: object): string {
    const paramValue = paramsObj[this.name];
    if (paramValue === undefined) {
      return '';
    }
    if (!Array.isArray(paramValue)) {
      console.error('type of ' + this.name + ' property should be Array');
      return '';
    }
    const paramValueArray: Array<string> = [];
    (paramValue as Array<never>).forEach(value => {
      if (typeof value === 'string') {
        paramValueArray.push(value);
      } else {
        console.error('element type of ' + this.name + ' property array should be String');
      }
    })
    if (paramValueArray.length === 0) {
      return '';
    }
    if (this.multiType in [MultiType.Between, MultiType.NotBetween] && paramValueArray.length !== 2) {
      console.error(`element count of ${this.name} property array should be exactly 2 for MultiType ${this.multiType}`);
      return '';
    }
    const dateStart = dayjs(paramValueArray[0]).tz('Asia/Shanghai').toISOString();
    const dateEnd = dayjs(paramValueArray[1]).tz('Asia/Shanghai').toISOString();
    return `"${this.name}": {
      "@type":"goguru.types.Condition",
      "multi": "${this.multiType}",
      "value":{
        "@type":"${protoTypeNameMap.get(ProtoType.DateTimeBetween)}",
        "value":["${dateStart}","${dateEnd}"]
      }
    }`;
  }

  toCondition(paramsObj: object): string {
    switch (this.protoType) {
      case ProtoType.DoubleValue:
      case ProtoType.FloatValue:
      case ProtoType.Int64Value:
      case ProtoType.UInt64Value:
      case ProtoType.Int32Value:
      case ProtoType.UInt32Value:
        return this.conditionNumberValue(paramsObj, this.protoType);
      case ProtoType.BoolValue:
        return this.conditionBoolValue(paramsObj);
      case ProtoType.StringValue:
        return this.conditionStringValue(paramsObj);
      case ProtoType.DoubleSlice:
        return this.conditionNumberSlice(paramsObj, ProtoType.DoubleSlice, ProtoType.DoubleValue);
      case ProtoType.FloatSlice:
        return this.conditionNumberSlice(paramsObj, ProtoType.FloatSlice, ProtoType.FloatValue);
      case ProtoType.Int64Slice:
        return this.conditionNumberSlice(paramsObj, ProtoType.Int64Slice, ProtoType.Int64Value);
      case ProtoType.UInt64Slice:
        return this.conditionNumberSlice(paramsObj, ProtoType.UInt64Slice, ProtoType.UInt64Value);
      case ProtoType.Int32Slice:
        return this.conditionNumberSlice(paramsObj, ProtoType.Int32Slice, ProtoType.Int32Value);
      case ProtoType.UInt32Slice:
        return this.conditionNumberSlice(paramsObj, ProtoType.UInt32Slice, ProtoType.UInt32Value);
      case ProtoType.BoolSlice:
        return this.conditionBoolSlice(paramsObj);
      case ProtoType.StringSlice:
        return this.conditionStringSlice(paramsObj);
      case ProtoType.DateBetween:
        return this.conditionDateBetween(paramsObj);
      case ProtoType.DateTimeBetween:
        return this.conditionDateTimeBetween(paramsObj);
      default:
        return '';
    }
  }
}

export function toRequest(paramsConfig: RequestParamConfig[], paramObj: object, pageNum: number, pageSize: number,
                          sort: Record<string, SortOrder>): string {
  const conditions: string[] = []
  for (const paramConfig of paramsConfig) {
    const condition = paramConfig.toCondition(paramObj);
    if (condition !== undefined && condition.trim().length === 0) {
      continue;
    }
    conditions.push(condition);
  }
  const pageRequest: PageRequest = {
    number: pageNum,
    size: pageSize,
  }
  if (sort) {
    let sorts: Sort[] = []
    for (const field in sort) {
      if (!Object.hasOwn(sort, field)) {
        continue
      }
      const order = sort[field];
      let orderDirection = 'Asc'
      if (order === 'descend') {
        orderDirection = 'Desc';
      }
      sorts.push({
        property: field,
        direction: orderDirection,
      })
    }
    if (sorts.length > 0) {
      pageRequest.sorts = sorts
    }
  }
  conditions.push(`"pageRequest": ${JSON.stringify(pageRequest)}`);
  console.log('toRequest: ' + conditions.join(',\n'));
  return `{
    ${conditions.join(',\n')}
  }`
}
