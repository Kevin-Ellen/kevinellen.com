// tests/src/app-render-context/resolve/body-content/block/pre.resolve.app-render-context.test.ts

import { resolvePreBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/pre.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolvePreBlockContentModuleAppRenderContext", () => {
  it("returns the pre module unchanged", () => {
    const appContext = {} as AppContext;

    const module = {
      kind: "pre",
      code: "const duck = true;",
      language: "ts",
    } as never;

    const result = resolvePreBlockContentModuleAppRenderContext(
      appContext,
      module,
    );

    expect(result).toBe(module);
  });
});
