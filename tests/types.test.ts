import { showInCreate, showInSearch, showInUpdate, visibleAll, visible } from "@/utils/types";

describe("testing visibility", () => {
  test("create", () => {
    const visibility = visible.create;
    expect(showInCreate(visibility)).toBe(true);
    expect(showInUpdate(visibility)).toBe(false);
    expect(showInSearch(visibility)).toBe(false);
  });
  test("update", () => {
    const visibility = visible.update;
    expect(showInCreate(visibility)).toBe(false);
    expect(showInUpdate(visibility)).toBe(true);
    expect(showInSearch(visibility)).toBe(false);
  });
  test("search", () => {
    const visibility = visible.search;
    expect(showInCreate(visibility)).toBe(false);
    expect(showInUpdate(visibility)).toBe(false);
    expect(showInSearch(visibility)).toBe(true);
  });
  test("create & update", () => {
    const visibility = visible.create | visible.update;
    expect(showInCreate(visibility)).toBe(true);
    expect(showInUpdate(visibility)).toBe(true);
    expect(showInSearch(visibility)).toBe(false);
  });
  test("update & search", () => {
    const visibility = visible.update | visible.search;
    expect(showInCreate(visibility)).toBe(false);
    expect(showInUpdate(visibility)).toBe(true);
    expect(showInSearch(visibility)).toBe(true);
  });
  test("all", () => {
    const visibility = visibleAll;
    expect(showInCreate(visibility)).toBe(true);
    expect(showInUpdate(visibility)).toBe(true);
    expect(showInSearch(visibility)).toBe(true);
  });
});
