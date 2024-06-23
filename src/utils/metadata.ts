import { Class, ProtoType, Visibility, visible } from "./types";
import { FIELD_CONFIGS, FieldConfig, SEARCH_CONFIGS, SearchConfig, TABLE_CONFIG, TableConfig } from "./decorators";

function getTableConfig(table: Class): TableConfig {
  const config = table.prototype[TABLE_CONFIG] as TableConfig;
  if (config && config?.description === undefined) {
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

export function showInList(visibility?: Visibility): boolean {
  if (visibility === undefined) {
    return true;
  }
  return (visibility & visible.list) === visible.list;
}

export function showInDetail(visibility?: Visibility): boolean {
  if (visibility === undefined) {
    return true;
  }
  return (visibility & visible.detail) === visible.detail;
}

export function showInSearch(visibility?: Visibility): boolean {
  if (visibility === undefined) {
    return true;
  }
  return (visibility & visible.search) === visible.search;
}

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

export abstract class Metadata {
  // 数据类元数据
  private readonly _tableConfig?: TableConfig;
  // 字段元数据列表
  private readonly _fieldConfigs: Map<string, FieldConfig>;
  // 仅出现在新增表单里的字段元数据列表
  private readonly _fieldConfigsForCreate: Map<string, FieldConfig>;
  // 仅出现在编辑表单里的字段元数据列表
  private readonly _fieldConfigsForUpdate: Map<string, FieldConfig>;
  // 仅出现在详情里的字段元数据列表
  private readonly _fieldConfigsForDetail: Map<string, FieldConfig>;
  // ProtoType 为 SimpleArray 的字段名，这些字段需要进行 wrap/unwrap 才能使用 ProFormList 控件渲染
  private readonly _fieldConfigsNeedWrapping: Map<string, FieldConfig>;
  // 查询配置列表
  private readonly _searchConfigs?: Map<string, SearchConfig>;

  constructor(recordClass: any) {
    this._tableConfig = getTableConfig(recordClass);
    this._fieldConfigs = getFieldConfigs(recordClass);
    this._searchConfigs = getSearchConfigs(recordClass);
    this._fieldConfigsForCreate = (() => {
      let subMap = new Map<string, FieldConfig>;
      this._fieldConfigs?.forEach((value, key) => {
        if (showInCreate(value.visibility)) {
          subMap.set(key, value);
        }
      });
      return subMap
    })();
    this._fieldConfigsForUpdate = (() => {
      let subMap = new Map<string, FieldConfig>;
      this._fieldConfigs?.forEach((value, key) => {
        if (showInUpdate(value.visibility)) {
          subMap.set(key, value);
        }
      });
      return subMap
    })();
    this._fieldConfigsForDetail = (() => {
      let subMap = new Map<string, FieldConfig>;
      this._fieldConfigs?.forEach((value, key) => {
        if (showInDetail(value.visibility)) {
          subMap.set(key, value);
        }
      });
      return subMap
    })();
    this._fieldConfigsNeedWrapping = (() => {
      let subMap = new Map<string, FieldConfig>;
      this._fieldConfigs?.forEach((value, key) => {
        if (value.columnType === ProtoType.SimpleArray || value.columnType === ProtoType.SimpleMap || value.columnType === ProtoType.ObjectMap) {
          subMap.set(key, value);
        }
      });
      return subMap;
    })();
    // console.log("tableConfig", this.tableConfig);
    // console.log("fieldConfigs", this.fieldConfigs);
    // console.log("searchConfigs", this.searchConfigs);
  }

  tableConfig = () => {
    if (this._tableConfig === undefined) {
      throw new Error("没有在数据类(Persistent Object class)上使用 @table 装饰器定义元数据");
    }
    return this._tableConfig;
  }
  fieldConfigs = () => this._fieldConfigs;
  fieldConfigsForCreate = () => this._fieldConfigsForCreate;
  fieldConfigsForUpdate = () => this._fieldConfigsForUpdate;
  fieldConfigsForDetail = () => this._fieldConfigsForDetail;
  searchConfigs = () => this._searchConfigs;
  fieldConfigsNeedWrapping = () => this._fieldConfigsNeedWrapping;
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
