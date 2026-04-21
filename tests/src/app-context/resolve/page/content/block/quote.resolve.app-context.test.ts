// tests/src/app-context/resolve/page/content/block/quote.resolve.app-context.test.ts

import { appContextResolveQuoteBlockContentModule } from "@app-context/resolve/page/content/block/quote.resolve.app-context";

describe("appContextResolveQuoteBlockContentModule", () => {
  it("returns the quote module unchanged", () => {
    const module = {
      kind: "quote",
      id: "quote-1",
      text: "A quote",
      attribution: "Author",
    } as const;

    const result = appContextResolveQuoteBlockContentModule(
      module,
      {} as never,
    );

    expect(result).toBe(module);
  });
});
