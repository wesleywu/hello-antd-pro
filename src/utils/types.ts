// 定义 Class 类型，所谓 Class ，其实就是一个 function，是对应 class 的构造函数
export type Class<T = any> = new (...args: any[]) => T;

// 定义 Optional 类型，用于将 type | interface 里必须赋值的属性设置为可以不赋值，但不需要在属性后面加 ?
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

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
  SimpleArray,
  SimpleMap,
  ObjectArray,
  ObjectMap,
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

export enum ControlType {
  Text,
  TextDigit,
  TextPassword,
  TextArea,
  Select,
  DateRangePicker,
  DateTimeRangePicker,
  FormSet,
  FormList,
}

export type Visibility = number;

export enum visible {
  none = 1,
  list = 2,
  detail = 4,
  create = 8,
  update = 16,
  search = 32,
}

export const visibleAll: visible = visible.list | visible.detail | visible.create | visible.update | visible.search
