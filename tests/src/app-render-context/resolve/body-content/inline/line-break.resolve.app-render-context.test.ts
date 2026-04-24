// tests/src/app-render-context/resolve/body-content/inline/line-break.resolve.app-render-context.test.ts

import { resolveLineBreakInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/line-break.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolveLineBreakInlineContentAppRenderContext", () => {
  it("returns the line break inline module unchanged", () => {
    const appContext = {} as AppContext;
    const module = {
      kind: "lineBreak",
    } as never;

    const result = resolveLineBreakInlineContentAppRenderContext(
      appContext,
      module,
    );

    expect(result).toBe(module);
  });
});
