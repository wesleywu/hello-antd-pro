import { ControlType } from "@/components/FormField";

export type Class<T = any> = new (...args: any[]) => T;

export enum ProtoType {
  DoubleValue,
  FloatValue,
  Int64Value,
  UInt64Value,
  Int32Value,
  UInt32Value,
  BoolValue,
  StringValue,
  Date,
  DateTime,
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

export type PageRequest = {
  number?: number;
  size?: number;
  sorts?: Sort[];
}

export type PageInfo = {
  number: number;
  size: number;
  numberOfElements: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  sorts: Sort[]
};

export type Sort = {
  property: string,
  direction: string,
}

export type ListRes<Item> = {
  items: Item[];
  pageInfo: PageInfo;
};

// 定义字段配置元数据的结构
export interface FieldProps {
  dbColumnName: string;
  description: string;
  columnType: ProtoType;
  required?: boolean;
  visibility?: Visibility;
  controlTypeInCreateForm?: ControlType;
  controlTypeInUpdateForm?: ControlType;
  controlTypeInSearchForm?: ControlType;
  displayValueMapping?: Map<any, any>;
}

export interface FieldConfig extends FieldProps {
  fieldName: string;
}


// 定义搜索配置元数据的结构
export interface SearchConfig {
  fieldName: string;
  operator: OperatorType;
  multi: MultiType;
  wildcard: WildcardType;
}

export type Visibility = number;
export enum visible {
  create = 1,
  update = 2,
  search = 4,
}

export const visibleAll: visible = visible.create | visible.update | visible.search

export function showInCreate(visibility?: Visibility): boolean {
  if (visibility === undefined) {
    return true;
  }
  return (visibility & visible.create) === visible.create;
}

export function showInUpdate(visibility?: Visibility): boolean {
  if (visibility === undefined) {
    return true;
  }
  return (visibility & visible.update) === visible.update;
}

export function showInSearch(visibility?: Visibility): boolean {
  if (visibility === undefined) {
    return true;
  }
  return (visibility & visible.search) === visible.search;
}
