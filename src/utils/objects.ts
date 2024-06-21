export function mergeObjects(obj1: object, obj2: object): object {
  return { ...obj1, ...obj2 };
}

declare type Value = (string | number | boolean) | (string | number | boolean)[] | null;

function unboxArray(v1: Value): Value {
  if (!Array.isArray(v1)) {
    return v1;
  }
  if (v1.length === 0) {
    return null;
  }
  if (v1.length === 1) {
    return v1[0];
  }
  return v1;
}

function makeIntersection(v1: Value, v2: Value): Value {
  if (v1 === null) {
    return unboxArray(v2);
  }
  if (v2 === null) {
    return unboxArray(v1);
  }
  let v1Array : Array<string | number | boolean>;
  let v2Array : Array<string | number | boolean>;
  if (Array.isArray(v1)) {
    v1Array = v1;
  } else {
    v1Array = [v1];
  }
  if (Array.isArray(v2)) {
    v2Array = v2;
  } else {
    v2Array = [v2];
  }
  const intersection = v2Array.filter(value => v1Array.indexOf(value) !== -1);
  return unboxArray(intersection);
}

export function deepMerge(obj1: Record<string, Value>, obj2: Record<string, Value>): object {
  const output = Object.assign({}, obj1);

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (obj1[key]) {
        output[key] = makeIntersection(obj1[key], obj2[key]);
      } else {
        output[key] = obj2[key];
      }
    }
  }
  return output;
}
