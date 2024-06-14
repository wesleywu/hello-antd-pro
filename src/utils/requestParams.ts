import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"
import type { SortOrder } from "antd/lib/table/interface";
import { PageRequest, Sort } from "@/pages/list/video-collection/data";
import { toCondition } from "@/utils/conditionGenerator";

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

export class FieldConfig {
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
}

export function toRequest(fieldConfigs: FieldConfig[], req: object, pageNum?: number, pageSize?: number,
                          sort?: Record<string, SortOrder>): string {
  const conditions: string[] = []
  for (const fieldConfig of fieldConfigs) {
    const fieldValue = req[fieldConfig.name];
    if (fieldValue === undefined) {
      continue;
    }
    const condition = toCondition(fieldConfig, fieldValue);
    if (condition !== undefined && condition.trim().length === 0) {
      continue;
    }
    conditions.push(condition);
  }
  if (pageNum !== null && pageSize !== null) {
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
  }
  console.log('toRequest: ' + conditions.join(',\n'));
  return `{
    ${conditions.join(',\n')}
  }`
}
