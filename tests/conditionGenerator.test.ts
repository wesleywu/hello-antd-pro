import {
  conditionDateBetween,
  conditionDateTimeBetween,
  conditionNumberBoolSlice,
  conditionNumberBoolValue,
  conditionStringSlice,
  conditionStringValue
} from '@/utils/conditionGenerator';
import { FieldConfig } from "@/utils/requestParams";
import { MultiType, OperatorType, ProtoType } from "@/utils/types.d"
import dayjs from "dayjs";

describe("testing conditionNumberValue with various number value", () => {
  test("single double value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DoubleValue);
    const value: number = 0.0;
    const result = conditionNumberBoolValue(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.DoubleValue",
        "value":0
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("single float value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.FloatValue);
    const value: number = 0.0;
    const result = conditionNumberBoolValue(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.FloatValue",
        "value":0
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("single int64 value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Int64Value);
    const value: number = 0.0;
    const result = conditionNumberBoolValue(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.Int64Value",
        "value":0
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("single uint64 value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.UInt64Value);
    const value: number = 0.0;
    const result = conditionNumberBoolValue(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.UInt64Value",
        "value":0
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("single int32 value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Int32Value);
    const value: number = 0.0;
    const result = conditionNumberBoolValue(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.Int32Value",
        "value":0
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("single uint32 value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.UInt32Value);
    const value: number = 0.0;
    const result = conditionNumberBoolValue(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.UInt32Value",
        "value":0
      }
    }`
    expect(result).toBe(expectedResult);
  });
})

describe("testing conditionNumberBoolValue with boolean value", () => {
  test("1 bool value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.BoolValue);
    const value: boolean = true;
    const result = conditionNumberBoolValue(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.BoolValue",
        "value":true
      }
    }`
    expect(result).toBe(expectedResult);
  });
})

describe("testing conditionStringValue", () => {
  test("single string value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.StringValue);
    const value: string = "test_string";
    const result = conditionStringValue(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.StringValue",
        "value":"test_string"
      }
    }`
    expect(result).toBe(expectedResult);
  });
})

describe("testing conditionNumberBoolSlice with uint32 values", () => {
  test("1 uint32 with type UInt32Value value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.UInt32Value);
    const value: Array<number> = [1];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.UInt32Value",
        "value":1
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("2 uint32 with type UInt32Value value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.UInt32Value);
    const value: Array<number> = [1, 2];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "In",
      "value":{
        "@type":"goguru.types.UInt32Slice",
        "value":[1,2]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("3 uint32 with type UInt32Value value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.UInt32Value);
    const value: Array<number> = [1, 2, 3];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "In",
      "value":{
        "@type":"goguru.types.UInt32Slice",
        "value":[1,2,3]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("3 uint32 with type UInt32Value value and multi NotIn", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.UInt32Value, OperatorType.EQ, MultiType.NotIn);
    const value: Array<number> = [1,2,3];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "NotIn",
      "value":{
        "@type":"goguru.types.UInt32Slice",
        "value":[1,2,3]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("1 uint32 with type UInt32Value value and multi Between", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.UInt32Value, OperatorType.EQ, MultiType.Between);
    const value: Array<number> = [1];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.UInt32Value",
        "value":1
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("2 uint32 with type UInt32Value value and multi Between", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.UInt32Value, OperatorType.EQ, MultiType.Between);
    const value: Array<number> = [1,2];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "Between",
      "value":{
        "@type":"goguru.types.UInt32Slice",
        "value":[1,2]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("3 uint32 with type UInt32Value value and multi Between", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.UInt32Value, OperatorType.EQ, MultiType.Between);
    const value: Array<number> = [1,2,3];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = ''
    // should log en error
    expect(result).toBe(expectedResult);
  });
})

describe("testing conditionNumberBoolSlice with boolean values", () => {
  test("1 boolean with type BoolValue value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.BoolValue);
    const value: Array<boolean> = [true];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.BoolValue",
        "value":true
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("2 boolean with type BoolValue value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.BoolValue);
    const value: Array<boolean> = [true, false];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "In",
      "value":{
        "@type":"goguru.types.BoolSlice",
        "value":[true,false]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("3 boolean with type BoolValue value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.BoolValue);
    const value: Array<boolean> = [true, false, true];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "In",
      "value":{
        "@type":"goguru.types.BoolSlice",
        "value":[true,false,true]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("3 boolean with type BoolValue value and multi NotIn", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.BoolValue, OperatorType.EQ, MultiType.NotIn);
    const value: Array<boolean> = [true, false, true];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "NotIn",
      "value":{
        "@type":"goguru.types.BoolSlice",
        "value":[true,false,true]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("1 boolean with type BoolValue value and multi Between", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.BoolValue, OperatorType.EQ, MultiType.Between);
    const value: Array<boolean> = [true];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.BoolValue",
        "value":true
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("2 boolean with type BoolValue value and multi Between", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.BoolValue, OperatorType.EQ, MultiType.Between);
    const value: Array<boolean> = [true, false];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "Between",
      "value":{
        "@type":"goguru.types.BoolSlice",
        "value":[true,false]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("3 boolean with type BoolValue value and multi Between", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.BoolValue, OperatorType.EQ, MultiType.Between);
    const value: Array<boolean> = [true, false, true];
    const result = conditionNumberBoolSlice(fieldConfig, value)
    const expectedResult = ''
    // should log en error
    expect(result).toBe(expectedResult);
  });
})

describe("testing conditionStringSlice", () => {
  test("1 boolean with type StringValue value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.StringValue);
    const value: Array<string> = ["key1"];
    const result = conditionStringSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.StringValue",
        "value":"key1"
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("2 boolean with type StringValue value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.StringValue);
    const value: Array<string> = ["key1","key2"];
    const result = conditionStringSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "In",
      "value":{
        "@type":"goguru.types.StringSlice",
        "value":["key1","key2"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("3 boolean with type StringValue value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.StringValue);
    const value: Array<string> = ["key1","key2","key3"];
    const result = conditionStringSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "In",
      "value":{
        "@type":"goguru.types.StringSlice",
        "value":["key1","key2","key3"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("3 boolean with type StringValue value and multi NotIn", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.StringValue, OperatorType.EQ, MultiType.NotIn);
    const value: Array<string> = ["key1","key2","key3"];
    const result = conditionStringSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "NotIn",
      "value":{
        "@type":"goguru.types.StringSlice",
        "value":["key1","key2","key3"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("1 boolean with type StringValue value and multi Between", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.StringValue, OperatorType.EQ, MultiType.Between);
    const value: Array<string> = ["key1"];
    const result = conditionStringSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "EQ",
      "value":{
        "@type":"google.protobuf.StringValue",
        "value":"key1"
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("2 boolean with type StringValue value and multi Between", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.StringValue, OperatorType.EQ, MultiType.Between);
    const value: Array<string> = ["key1","key2"];
    const result = conditionStringSlice(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "Between",
      "value":{
        "@type":"goguru.types.StringSlice",
        "value":["key1","key2"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("3 boolean with type StringValue value and multi Between", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.StringValue, OperatorType.EQ, MultiType.Between);
    const value: Array<string> = ["key1","key2","key3"];
    const result = conditionStringSlice(fieldConfig, value)
    const expectedResult = ''
    // should log en error
    expect(result).toBe(expectedResult);
  });
})

describe("testing conditionDateBetween", () => {
  test("1 undefined value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Date);
    const value: Array<dayjs.Dayjs | undefined> = [undefined];
    const result = conditionDateBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("2 undefined value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Date);
    const value: Array<dayjs.Dayjs | undefined> = [undefined, undefined];
    const result = conditionDateBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("3 undefined value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Date);
    const value: Array<dayjs.Dayjs | undefined> = [undefined, undefined, undefined];
    const result = conditionDateBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("1 invalid date value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Date);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('invalid-date')];
    const result = conditionDateBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("2 invalid date value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Date);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('invalid-date'), dayjs('undefined')];
    const result = conditionDateBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("1 undefined and 1 invalid date value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Date);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('invalid-date'), undefined];
    const result = conditionDateBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("1 invalid date and 1 valid date value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Date);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('invalid-date'), dayjs('2024-02-16 12:23:34')];
    const result = conditionDateBetween(fieldConfig, value)
    // 北京时间 2024-02-16 当日的最后一毫秒为 2024-02-16T15:59:59.999Z
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "LTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["2024-02-16T15:59:59.999Z"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("1 undefined and 1 valid date value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Date);
    const value: Array<dayjs.Dayjs | undefined> = [undefined, dayjs('2024-02-16 12:23:34')];
    const result = conditionDateBetween(fieldConfig, value)
    // 北京时间 2024-02-16 当日的最后一毫秒为 2024-02-16T15:59:59.999Z
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "LTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["2024-02-16T15:59:59.999Z"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("1 valid date and 1 invalid value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Date);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('2024-02-16 12:23:34'), dayjs('invalid-date')];
    const result = conditionDateBetween(fieldConfig, value)
    // 北京时间 2024-02-16 当日起始时间为 2024-02-15T16:00:00.000Z
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "GTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["2024-02-15T16:00:00.000Z"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("1 valid date and 1 undefined value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Date);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('2024-02-16 12:23:34'), undefined];
    const result = conditionDateBetween(fieldConfig, value)
    // 北京时间 2024-02-16 当日起始时间为 2024-02-15T16:00:00.000Z
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "GTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["2024-02-15T16:00:00.000Z"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("2 valid date", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.Date);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('2024-02-16 12:23:34'), dayjs('2024-02-16 12:23:34')];
    const result = conditionDateBetween(fieldConfig, value)
    // 北京时间 2024-02-16 当日起始时间为 2024-02-15T16:00:00.000Z
    // 北京时间 2024-02-16 当日的最后一毫秒为 2024-02-16T15:59:59.999Z
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "Between",
      "value":{
        "@type":"goguru.types.TimestampSlice",
        "value":["2024-02-15T16:00:00.000Z","2024-02-16T15:59:59.999Z"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
})

describe("testing conditionDateTimeBetween", () => {
  test("1 undefined value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DateTime);
    const value: Array<dayjs.Dayjs | undefined> = [undefined];
    const result = conditionDateTimeBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("2 undefined value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DateTime);
    const value: Array<dayjs.Dayjs | undefined> = [undefined, undefined];
    const result = conditionDateTimeBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("3 undefined value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DateTime);
    const value: Array<dayjs.Dayjs | undefined> = [undefined, undefined, undefined];
    const result = conditionDateTimeBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("1 invalid date value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DateTime);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('invalid-date')];
    const result = conditionDateTimeBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("2 invalid date value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DateTime);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('invalid-date'), dayjs('undefined')];
    const result = conditionDateTimeBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("1 undefined and 1 invalid date value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DateTime);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('invalid-date'), undefined];
    const result = conditionDateTimeBetween(fieldConfig, value)
    const expectedResult = ``
    expect(result).toBe(expectedResult);
  });
  test("1 invalid date and 1 valid date value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DateTime);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('invalid-date'), dayjs('2024-02-16 12:23:34')];
    const result = conditionDateTimeBetween(fieldConfig, value)
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "LTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["2024-02-16T04:23:34.000Z"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("1 undefined and 1 valid date value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DateTime);
    const value: Array<dayjs.Dayjs | undefined> = [undefined, dayjs('2024-02-16 12:23:34')];
    const result = conditionDateTimeBetween(fieldConfig, value)
    // 北京时间 2024-02-16 当日的最后一毫秒为 2024-02-16T15:59:59.999Z
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "LTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["2024-02-16T04:23:34.000Z"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("1 valid date and 1 invalid value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DateTime);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('2024-02-16 12:23:34'), dayjs('invalid-date')];
    const result = conditionDateTimeBetween(fieldConfig, value)
    // 北京时间 2024-02-16 当日起始时间为 2024-02-15T16:00:00.000Z
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "GTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["2024-02-16T04:23:34.000Z"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("1 valid date and 1 undefined value", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DateTime);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('2024-02-16 12:23:34'), undefined];
    const result = conditionDateTimeBetween(fieldConfig, value)
    // 北京时间 2024-02-16 当日起始时间为 2024-02-15T16:00:00.000Z
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "operator": "GTE",
      "value":{
        "@type":"google.protobuf.Timestamp",
        "value":["2024-02-16T04:23:34.000Z"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
  test("2 valid date", () => {
    const fieldConfig = new FieldConfig(
      'demoField', ProtoType.DateTime);
    const value: Array<dayjs.Dayjs | undefined> = [dayjs('2024-02-16 12:23:34'), dayjs('2024-02-16 13:23:34')];
    const result = conditionDateTimeBetween(fieldConfig, value)
    // 北京时间 2024-02-16 当日起始时间为 2024-02-15T16:00:00.000Z
    // 北京时间 2024-02-16 当日的最后一毫秒为 2024-02-16T15:59:59.999Z
    const expectedResult = `"demoField": {
      "@type":"goguru.orm.Condition",
      "multi": "Between",
      "value":{
        "@type":"goguru.types.TimestampSlice",
        "value":["2024-02-16T04:23:34.000Z","2024-02-16T05:23:34.000Z"]
      }
    }`
    expect(result).toBe(expectedResult);
  });
})
