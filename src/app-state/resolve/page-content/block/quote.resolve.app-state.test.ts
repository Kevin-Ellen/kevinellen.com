// src/app-state/resolve/page-content/block/quote.resolve.app-state.test.ts

import { appStateResolveQuoteBlock } from "@app-state/resolve/page-content/block/quote.resolve.app-state";

describe("appStateResolveQuoteBlock", () => {
  it("applies deterministic defaults", () => {
    expect(
      appStateResolveQuoteBlock({
        kind: "quote",
        id: "quote-1",
        text: "The woods are lovely, dark and deep.",
      }),
    ).toEqual({
      kind: "quote",
      id: "quote-1",
      text: "The woods are lovely, dark and deep.",
      flow: "content",
      attribution: null,
    });
  });

  it("preserves authored values", () => {
    expect(
      appStateResolveQuoteBlock({
        kind: "quote",
        id: "quote-2",
        text: "Not all those who wander are lost.",
        attribution: "J.R.R. Tolkien",
        flow: "breakout",
      }),
    ).toEqual({
      kind: "quote",
      id: "quote-2",
      text: "Not all those who wander are lost.",
      attribution: "J.R.R. Tolkien",
      flow: "breakout",
    });
  });
});
