import { MultiType, OperatorType, ProtoType, WildcardType } from "@/utils/types";

// 用于存储 字段配置元数据的 Symbol
export const FIELD_CONFIGS = Symbol("field_configs");
// 用于存储 搜索配置元数据的 Symbol
export const SEARCH_CONFIGS = Symbol("search_configs")

// 定义字段配置元数据的结构
export interface FieldConfig {
  fieldName: string;
  dbColumnName: string;
  columnType: ProtoType;
}

// 用于字段的装饰器(注解)，给定字段配置元数据信息
export function field(dbColumnName: string, columnType: ProtoType) {
  function createDecoratorFunction(table: any, fieldName: any) {
    let fieldConfig: FieldConfig = { fieldName, dbColumnName, columnType };
    (table[FIELD_CONFIGS] || (table[FIELD_CONFIGS] = [])).push(fieldConfig);
    return fieldConfig as any;
  }
  return createDecoratorFunction;
}

// 定义搜索配置元数据的结构
export interface SearchConfig {
  fieldName: string;
  operator: OperatorType;
  multi: MultiType;
  wildcard: WildcardType;
}

// 快捷创建搜索配置（未给定字段使用缺省值）
export function newSearchConfig(fieldName: string, operator?: OperatorType, multi?: MultiType, wildcard?: WildcardType): SearchConfig {
  const _operator: OperatorType = operator ? operator : OperatorType.EQ;
  const _multi: MultiType = multi ? multi : MultiType.NoMulti;
  const _wildcard: WildcardType = wildcard ? wildcard : WildcardType.NoWildcard;
  return {
    fieldName,
    operator: _operator,
    multi: _multi,
    wildcard: _wildcard,
  };
}

// 用于字段的装饰器(注解)，给定搜索配置元数据信息
export function search(operator?: OperatorType, multi?: MultiType, wildcard?: WildcardType) {
  function createDecoratorFunction(table: any, fieldName: any) {
    const searchConfig = newSearchConfig(fieldName, operator, multi, wildcard);
    (table[SEARCH_CONFIGS] || (table[SEARCH_CONFIGS] = [])).push(searchConfig);
    return searchConfig as any;
  }
  return createDecoratorFunction;
}
