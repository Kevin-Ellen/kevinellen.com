// tests/src/app-render-context/resolve/body-content/block/quote.resolve.app-render-context.test.ts

import { resolveQuoteBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/quote.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolveQuoteBlockContentModuleAppRenderContext", () => {
  it("returns the quote module unchanged", () => {
    const appContext = {} as AppContext;

    const module = {
      kind: "quote",
      quote: "Architecture is mostly deciding where things do not belong.",
      attribution: "Kevin Ellen",
    } as never;

    const result = resolveQuoteBlockContentModuleAppRenderContext(
      appContext,
      module,
    );

    expect(result).toBe(module);
  });
});
