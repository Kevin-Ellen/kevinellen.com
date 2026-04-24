// tests/src/app-render-context/resolve/body-content/inline/text.resolve.app-render-context.test.ts

import { resolveTextInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/text.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolveTextInlineContentAppRenderContext", () => {
  it("returns the text inline module unchanged", () => {
    const appContext = {} as AppContext;
    const module = {
      kind: "text",
      value: "Hello ducks",
    } as never;

    const result = resolveTextInlineContentAppRenderContext(appContext, module);

    expect(result).toBe(module);
  });
});
