export function transform(items: any[], idField: string) {
  return items.map((item) => ({
    key: item[idField],
    ...item,
  }));
}
