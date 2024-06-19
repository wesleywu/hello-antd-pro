import { FieldConfig, FieldConfigOptional, MultiType, OperatorType, SearchConfig, WildcardType } from "@/utils/types";
import { camelToSnakeCase } from "@/utils/strings";

// 用于存储 字段配置元数据的 Symbol
export const FIELD_CONFIGS = Symbol("field_configs");
// 用于存储 搜索配置元数据的 Symbol
export const SEARCH_CONFIGS = Symbol("search_configs")

// 用于字段的装饰器(注解)，给定字段配置元数据信息
export function field(config: FieldConfigOptional) {
  function createDecoratorFunction(table: any, fieldName: string) {
    if (config.dbColumnName === undefined) {
      if (fieldName.toLowerCase() === "id") {
        config.dbColumnName = "_id"; // mongodb collection _id field
      } else {
        config.dbColumnName = camelToSnakeCase(fieldName);
      }
    }
    if (config.description === undefined) {
      config.description = fieldName;
    }
    (table[FIELD_CONFIGS] || (table[FIELD_CONFIGS] = new Map<string, FieldConfig>)).set(fieldName, config);
    return config as any;
  }
  return createDecoratorFunction;
}

// 快捷创建搜索配置（未给定字段使用缺省值）
export function newSearchConfig(operator?: OperatorType, multi?: MultiType, wildcard?: WildcardType): SearchConfig {
  const _operator: OperatorType = operator ? operator : OperatorType.EQ;
  const _multi: MultiType = multi ? multi : MultiType.NoMulti;
  const _wildcard: WildcardType = wildcard ? wildcard : WildcardType.NoWildcard;
  return {
    operator: _operator,
    multi: _multi,
    wildcard: _wildcard,
  };
}

// 用于字段的装饰器(注解)，给定搜索配置元数据信息
export function search(config: SearchConfig) {
  function createDecoratorFunction(table: any, fieldName: any) {
    const searchConfig = newSearchConfig(config.operator, config.multi, config.wildcard);
    (table[SEARCH_CONFIGS] || (table[SEARCH_CONFIGS] = new Map<string, SearchConfig>)).set(fieldName, searchConfig);
    return searchConfig as any;
  }
  return createDecoratorFunction;
}
