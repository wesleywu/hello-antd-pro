// 定义 Class 类型，所谓 Class ，其实就是一个 function，是对应 class 的构造函数
export type Class<T = any> = new (...args: any[]) => T;

// 定义 Optional 类型，用于将 type | interface 里必须赋值的属性设置为可以不赋值，但不需要在属性后面加 ?
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

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

export type TableConfig = {
  apiBaseUrl: string;
  description?: string;
}

export enum ControlType {
  Text,
  TextDigit,
  TextPassword,
  TextArea,
  Select,
  DateRangePicker,
  DateTimeRangePicker,
}

export type FieldInfo = {
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

// 定义字段配置元数据的结构
export type FieldConfig = {
  columnType: ProtoType;
  dbColumnName: string;
  description: string;
  required?: boolean;
  visibility?: Visibility;
  controlTypeInCreateForm?: ControlType;
  controlTypeInUpdateForm?: ControlType;
  controlTypeInSearchForm?: ControlType;
  displayValueMapping?: Map<any, any>;
}

// 允许如下字段在 FieldConfigOptional 中不指定
export type FieldConfigOptional = Optional<FieldConfig, keyof Pick<FieldConfig, 'dbColumnName' | 'description'>>

// 定义搜索配置元数据的结构
export type SearchConfig = {
  operator?: OperatorType;
  multi?: MultiType;
  wildcard?: WildcardType;
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
