export type VideoCollectionItem = {
  id: string;
  name: string;
  contentType: number;
  filterType: number;
  count: number;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type VideoCollectionPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type VideoCollectionData = {
  items: VideoCollectionItem[];
  current: number;
  total: number;
};

export type VideoCollectionParams = {
  id: string;
  name: string;
  contentType: number;
  filterType: number;
  count: number;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

export const ContentType: Map<number, string> = new Map([
  [0, '图文'],
  [1, '横版短视频'],
  [2, '竖版短视频'],
]);
export const FilterType: Map<number, string> = new Map([
  [0, '规则筛选'],
  [1, '人工'],
]);
export const Status: Map<boolean, string> = new Map([
  [false, '未上线'],
  [true, '已上线'],
]);

export const ColumnConfigs: RequestParamConfig[] = [
  new RequestParamConfig('id', ProtoType.StringValue, OperatorType.EQ, MultiType.NoMulti),
  new RequestParamConfig('name', ProtoType.StringValue, OperatorType.Like, MultiType.NoMulti, WildcardType.Contains),
  new RequestParamConfig('contentType', ProtoType.Int32Slice, OperatorType.EQ, MultiType.In),
  new RequestParamConfig('filterType', ProtoType.Int32Slice, OperatorType.EQ, MultiType.In),
  new RequestParamConfig('count', ProtoType.UInt32Slice, OperatorType.EQ, MultiType.Between),
  new RequestParamConfig('isOnline', ProtoType.BoolSlice, OperatorType.EQ, MultiType.In),
  new RequestParamConfig('createdAt', ProtoType.DateBetween, OperatorType.EQ, MultiType.Between),
  new RequestParamConfig('updatedAt', ProtoType.DateTimeBetween, OperatorType.EQ, MultiType.Between),
]
