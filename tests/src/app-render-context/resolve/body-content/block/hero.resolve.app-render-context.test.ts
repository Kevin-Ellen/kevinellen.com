// tests/src/app-render-context/resolve/body-content/block/hero.resolve.app-render-context.test.ts

import { resolveHeroBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/hero.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolveHeroBlockContentModuleAppRenderContext", () => {
  it("returns the hero module unchanged", () => {
    const appContext = {} as AppContext;

    const module = {
      kind: "hero",
      title: "Hero title",
    } as never;

    const result = resolveHeroBlockContentModuleAppRenderContext(
      appContext,
      module,
    );

    expect(result).toBe(module);
  });
});
