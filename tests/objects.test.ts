import { deepMerge, mergeObjects } from "@/utils/objects";


describe("testing objects merge", () => {
  test("simple merge", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const expected = { a: 1, b: 3, c: 4 };

    expect(mergeObjects(obj1, obj2)).toStrictEqual(expected);
  });
  test("merge single value", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const expected = { a: 1, b: null, c: 4 };
    expect(deepMerge(obj1, obj2)).toStrictEqual(expected);
  });
  test("merge single & array value1", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: [3], c: [4, 5] };
    const expected = { a: 1, b: null, c: [4, 5] };
    expect(deepMerge(obj1, obj2)).toStrictEqual(expected);
  });
  test("merge single & array value2", () => {
    const obj1 = { a: 1, b: [2, 3], c: [6] };
    const obj2 = { b: [3], c: [4, 5] };
    const expected = { a: 1, b: 3, c: null };
    expect(deepMerge(obj1, obj2)).toStrictEqual(expected);
  });
  test("merge single & array value3", () => {
    const obj1 = { a: 1, b: [2, 3], c: 4 };
    const obj2 = { b: [2, 3, 4], c: [4, 5] };
    const expected = { a: 1, b: [2, 3], c: 4 };
    expect(deepMerge(obj1, obj2)).toStrictEqual(expected);
  });
  test("merge single & array value null1", () => {
    const obj1 = { a: null, b: [2, 3], c: 4 };
    const obj2 = { b: [2, 3, 4], c: [4, 5] };
    const expected = { a: null, b: [2, 3], c: 4 };
    expect(deepMerge(obj1, obj2)).toStrictEqual(expected);
  });
  test("merge single & array value null2", () => {
    const obj1 = { a: null, b: null, c: 4 };
    const obj2 = { b: [2, 3, 4], c: [4, 5] };
    const expected = { a: null, b: [2, 3, 4], c: 4 };
    expect(deepMerge(obj1, obj2)).toStrictEqual(expected);
  });
  test("merge single & array value null3", () => {
    const obj1 = { a: null, b: null, c: 4 };
    const obj2 = { b: [2, 3, 4], c: null };
    const expected = { a: null, b: [2, 3, 4], c: 4 };
    expect(deepMerge(obj1, obj2)).toStrictEqual(expected);
  });
  test("merge single & array value null4", () => {
    const obj1 = { a: null, b: null, c: [true] };
    const obj2 = { b: [2, 3, 4], c: null };
    const expected = { a: null, b: [2, 3, 4], c: true };
    expect(deepMerge(obj1, obj2)).toStrictEqual(expected);
  });
});
