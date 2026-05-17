// src/app-state/resolve/page-content/block/pre/pre.resolve.app-state.test.ts

import { appStateResolvePreBlock } from "@app-state/resolve/page-content/block/pre/pre.resolve.app-state";

describe("appStateResolvePreBlock", () => {
  it("applies deterministic defaults", () => {
    expect(
      appStateResolvePreBlock({
        kind: "pre",
        value: "const foo = 'bar';",
      }),
    ).toEqual({
      kind: "pre",
      value: "const foo = 'bar';",
      flow: "content",
      language: null,
    });
  });

  it("preserves authored flow", () => {
    expect(
      appStateResolvePreBlock({
        kind: "pre",
        value: "const foo = 'bar';",
        flow: "breakout",
      }),
    ).toEqual({
      kind: "pre",
      value: "const foo = 'bar';",
      flow: "breakout",
      language: null,
    });
  });

  it("preserves authored language", () => {
    expect(
      appStateResolvePreBlock({
        kind: "pre",
        value: "const foo = 'bar';",
        language: "ts",
      }),
    ).toEqual({
      kind: "pre",
      value: "const foo = 'bar';",
      flow: "content",
      language: "ts",
    });
  });
});
