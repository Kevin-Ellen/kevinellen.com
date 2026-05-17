// src/utils/deepFreeze.util.test.ts

import { deepFreeze } from "./deepFreeze.util";

describe("deepFreeze", () => {
  it("returns primitive values unchanged", () => {
    expect(deepFreeze("hello")).toBe("hello");
    expect(deepFreeze(123)).toBe(123);
    expect(deepFreeze(true)).toBe(true);
  });

  it("returns null unchanged", () => {
    expect(deepFreeze(null)).toBeNull();
  });

  it("freezes shallow objects", () => {
    const obj = {
      name: "Kevin",
    };

    const result = deepFreeze(obj);

    expect(Object.isFrozen(result)).toBe(true);
  });

  it("deep freezes nested objects", () => {
    const obj = {
      user: {
        profile: {
          name: "Kevin",
        },
      },
    };

    const result = deepFreeze(obj);

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.user)).toBe(true);
    expect(Object.isFrozen(result.user.profile)).toBe(true);
  });

  it("deep freezes arrays", () => {
    const arr = [
      {
        id: 1,
      },
    ];

    const result = deepFreeze(arr);

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result[0])).toBe(true);
  });

  it("deep freezes functions with properties", () => {
    const fn = Object.assign(() => "hello", {
      meta: {
        version: 1,
      },
    });

    const result = deepFreeze(fn);

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.meta)).toBe(true);
  });

  it("does not reprocess already frozen nested values", () => {
    const nested = Object.freeze({
      value: 123,
    });

    const obj = {
      nested,
    };

    const result = deepFreeze(obj);

    expect(Object.isFrozen(result)).toBe(true);
    expect(result.nested).toBe(nested);
  });
});
