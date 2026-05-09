// src/app-state/resolve/page-content/block/pre.resolve.app-state.test.ts

import { appStateResolvePreBlock } from "@app-state/resolve/page-content/block/pre.resolve.app-state";

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
    });
  });
});
