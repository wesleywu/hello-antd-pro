import { MultiType, OperatorType, ProtoType, WildcardType } from "@/utils/types.d";
import { FieldConfig } from "@/utils/requestParams";

export type VideoCollectionItem = {
  key: string;
  id: string;
  name: string;
  contentType: string;
  filterType: string;
  count: number;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const VideoCollectionSearchFieldConfigs: FieldConfig[] = [
  new FieldConfig('id', ProtoType.StringValue, OperatorType.EQ, MultiType.NoMulti),
  new FieldConfig('name', ProtoType.StringValue, OperatorType.Like, MultiType.NoMulti, WildcardType.Contains),
  new FieldConfig('contentType', ProtoType.StringValue, OperatorType.EQ, MultiType.In),
  new FieldConfig('filterType', ProtoType.StringValue, OperatorType.EQ, MultiType.In),
  new FieldConfig('count', ProtoType.UInt32Value, OperatorType.EQ, MultiType.Between),
  new FieldConfig('isOnline', ProtoType.BoolValue, OperatorType.EQ, MultiType.In),
  new FieldConfig('createdAt', ProtoType.Date, OperatorType.EQ, MultiType.Between),
  new FieldConfig('updatedAt', ProtoType.Date, OperatorType.EQ, MultiType.Between),
]

export const VideoCollectionDeleteFieldConfigs: FieldConfig[] = [
  new FieldConfig('id', ProtoType.StringValue, OperatorType.EQ, MultiType.In),
]
