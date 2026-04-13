// tests/src/utils/deepFreeze.util.test.ts

import { deepFreeze } from "@utils/deepFreeze.util";

describe("deepFreeze", () => {
  it("returns primitive values unchanged", () => {
    expect(deepFreeze("hello")).toBe("hello");
    expect(deepFreeze(42)).toBe(42);
    expect(deepFreeze(true)).toBe(true);
    expect(deepFreeze(undefined)).toBeUndefined();
  });

  it("returns null unchanged", () => {
    expect(deepFreeze(null)).toBeNull();
  });

  it("freezes a shallow object", () => {
    const input = {
      name: "Kevin",
      role: "photographer",
    };

    const result = deepFreeze(input);

    expect(result).toBe(input);
    expect(Object.isFrozen(result)).toBe(true);
  });

  it("recursively freezes nested objects", () => {
    const input = {
      site: {
        name: "Kevin Ellen",
        social: {
          instagram: "photography.mallard",
        },
      },
    };

    const result = deepFreeze(input);

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.site)).toBe(true);
    expect(Object.isFrozen(result.site.social)).toBe(true);
  });

  it("recursively freezes arrays and nested array items", () => {
    const input = {
      pages: [
        { id: "home", kind: "home" },
        { id: "about", kind: "static" },
      ],
    };

    const result = deepFreeze(input);

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.pages)).toBe(true);
    expect(Object.isFrozen(result.pages[0])).toBe(true);
    expect(Object.isFrozen(result.pages[1])).toBe(true);
  });

  it("freezes nested function values when they appear on an object", () => {
    const handler = () => "ok";

    const input = {
      actions: {
        handler,
      },
    };

    const result = deepFreeze(input);

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.actions)).toBe(true);
    expect(Object.isFrozen(result.actions.handler)).toBe(true);
  });

  it("does not attempt to re-freeze values that are already frozen", () => {
    const frozenChild = Object.freeze({
      title: "Already frozen",
    });

    const input = {
      child: frozenChild,
    };

    const result = deepFreeze(input);

    expect(result.child).toBe(frozenChild);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.child)).toBe(true);
  });

  it("freezes mixed nested structures", () => {
    const input = {
      config: {
        theme: "dark",
        navigation: [{ id: "home" }, { id: "about" }],
      },
      flags: {
        indexed: true,
      },
    };

    const result = deepFreeze(input);

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.config)).toBe(true);
    expect(Object.isFrozen(result.config.navigation)).toBe(true);
    expect(Object.isFrozen(result.config.navigation[0])).toBe(true);
    expect(Object.isFrozen(result.config.navigation[1])).toBe(true);
    expect(Object.isFrozen(result.flags)).toBe(true);
  });
});
