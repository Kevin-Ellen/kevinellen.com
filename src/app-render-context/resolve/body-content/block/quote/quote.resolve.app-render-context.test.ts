// src/app-render-context/resolve/body-content/block/quote/quote.resolve.app-render-context.test.ts

import type { AppContextQuoteBlock } from "@shared-types/page-content/block/quote/app-context.quote.block.types";

import { appRenderContextResolveQuoteBlock } from "@app-render-context/resolve/body-content/block/quote/quote.resolve.app-render-context";

describe("appRenderContextResolveQuoteBlock", () => {
  it("returns the quote block unchanged", () => {
    const block: AppContextQuoteBlock = {
      kind: "quote",
      id: "quote",
      flow: "content",
      text: "The marsh was silent except for the soft movement of reeds.",
      attribution: "Kevin Ellen",
    };

    expect(appRenderContextResolveQuoteBlock(block)).toEqual(block);
  });
});
