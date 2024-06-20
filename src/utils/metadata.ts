import { Class, FieldConfig, SearchConfig, TableConfig, Visibility, visible } from "@/utils/types";
import { FIELD_CONFIGS, SEARCH_CONFIGS, TABLE_CONFIG } from "@/utils/decorators";

function getTableConfig(table: Class): TableConfig {
  const config = table.prototype[TABLE_CONFIG] as TableConfig;
  if (config === undefined) {
    throw new Error("必须在持久化对象类(Persistent Object class)上使用 @table 装饰器定义元数据");
  }
  if (config.description === undefined) {
    config.description = table.name;
  }
  return config;
}

function getFieldConfigs(table: Class): Map<string, FieldConfig> {
  const configMap = table.prototype[FIELD_CONFIGS] as Map<string, FieldConfig>;
  if (configMap === undefined) {
    throw new Error(`没有数据类 ${ table.name } 的属性上使用 @field 装饰器定义元数据`);
  }
  return configMap;
}

function getSearchConfigs(table: Class): Map<string, SearchConfig> {
  let configMap = table.prototype[SEARCH_CONFIGS] as Map<string, SearchConfig>;
  if (configMap === undefined) {
    configMap = new Map<string, SearchConfig>();
  }
  return configMap;
}

function showInCreate(visibility?: Visibility): boolean {
  if (visibility === undefined) {
    return true;
  }
  return (visibility & visible.create) === visible.create;
}

function showInUpdate(visibility?: Visibility): boolean {
  if (visibility === undefined) {
    return true;
  }
  return (visibility & visible.update) === visible.update;
}

export abstract class Metadata {
  // 数据类元数据
  private readonly _tableConfig: TableConfig;
  // 字段元数据列表
  private readonly _fieldConfigs: Map<string, FieldConfig>;
  // 仅出现在新增表单里的字段元数据列表
  private readonly _fieldConfigsForCreate: Map<string, FieldConfig>;
  // 仅出现在编辑表单里的字段元数据列表
  private readonly _fieldConfigsForUpdate: Map<string, FieldConfig>;
  // 查询配置列表
  private readonly _searchConfigs: Map<string, SearchConfig>;

  constructor(recordClass: any) {
    this._tableConfig = getTableConfig(recordClass);
    this._fieldConfigs = getFieldConfigs(recordClass);
    this._searchConfigs = getSearchConfigs(recordClass);
    this._fieldConfigsForCreate = (() => {
      let subMap = new Map<string, FieldConfig>;
      this._fieldConfigs.forEach((value, key) => {
        if (showInCreate(value.visibility)) {
          subMap.set(key, value);
        }
      });
      return subMap
    })();
    this._fieldConfigsForUpdate = (() => {
      let subMap = new Map<string, FieldConfig>;
      this._fieldConfigs.forEach((value, key) => {
        if (showInUpdate(value.visibility)) {
          subMap.set(key, value);
        }
      });
      return subMap
    })();
    // console.log("tableConfig", this.tableConfig);
    // console.log("fieldConfigs", this.fieldConfigs);
    // console.log("searchConfigs", this.searchConfigs);
  }

  tableConfig = () => this._tableConfig;
  fieldConfigs = () => this._fieldConfigs;
  fieldConfigsForCreate = () => this._fieldConfigsForCreate;
  fieldConfigsForUpdate = () => this._fieldConfigsForUpdate;
  searchConfigs = () => this._searchConfigs;
}

// 可以用 new 创建实例的 Metadata 类，仅仅是继承了 abstract 的 Metadata
class MetadataImpl extends Metadata {}

// 用于获得 Metadata 类实例的工厂，只提供一个静态方法: get
export class MetadataFactory {
  private static instanceMap: Map<Class, Metadata> = new Map<Class, Metadata>();
  // 根据 class （类），返回其对应的 Crud API 实现，以同样的 class 参数多次调用不会重复创建实例
  public static get = <T>(clazz: Class<T>): Metadata => {
    let metadata = MetadataFactory.instanceMap.get(clazz)
    if (metadata === undefined) {
      metadata = new MetadataImpl(clazz);
      MetadataFactory.instanceMap.set(clazz, metadata);
    }
    return metadata;
  }
}
