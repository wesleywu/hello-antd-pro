import { FieldConfig, FieldProps, MultiType, OperatorType, ProtoType, SearchConfig, WildcardType } from "@/utils/types";

// 用于存储 字段配置元数据的 Symbol
export const FIELD_CONFIGS = Symbol("field_configs");
// 用于存储 搜索配置元数据的 Symbol
export const SEARCH_CONFIGS = Symbol("search_configs")

// 用于字段的装饰器(注解)，给定字段配置元数据信息
export function field(props: FieldProps) {
  function createDecoratorFunction(table: any, fieldName: any) {
    const fieldConfig: FieldConfig = ({
      fieldName,
      ...props
    });
    (table[FIELD_CONFIGS] || (table[FIELD_CONFIGS] = new Map<string, FieldConfig>)).set(fieldName, fieldConfig);
    return props as any;
  }
  return createDecoratorFunction;
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
