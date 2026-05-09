// src/app-context/resolve/page-content/block/quote.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateQuoteBlock } from "@shared-types/page-content/block/quote/app-state.quote.block.types";

import { appContextResolveQuoteBlock } from "@app-context/resolve/page-content/block/quote.resolve.app-context";

describe("appContextResolveQuoteBlock", () => {
  it("returns the quote block unchanged", () => {
    const context = {} as AppContextPageContentResolverContext;

    const block: AppStateQuoteBlock = {
      kind: "quote",
      id: "some-quote",
      flow: "content",
      text: "Look deep into nature, and then you will understand everything better.",
      attribution: "Albert Einstein",
    };

    const result = appContextResolveQuoteBlock(block, context);

    expect(result).toEqual(block);
    expect(result).toBe(block);
  });
});
