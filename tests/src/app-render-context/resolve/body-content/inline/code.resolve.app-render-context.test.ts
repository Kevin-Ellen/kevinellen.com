// tests/src/app-render-context/resolve/body-content/inline/code.resolve.app-render-context.test.ts

import { resolveCodeInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/code.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolveCodeInlineContentAppRenderContext", () => {
  it("returns the code inline module unchanged", () => {
    const appContext = {} as AppContext;
    const module = {
      kind: "code",
      value: "const duck = true;",
    } as never;

    const result = resolveCodeInlineContentAppRenderContext(appContext, module);

    expect(result).toBe(module);
  });
});
