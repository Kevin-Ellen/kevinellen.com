// tests/src/app-state/resolve/page-content/block/quote.resolve.app-state.test.ts

import { appStateResolveQuoteBlockContentModule } from "@app-state/resolve/page-content/block/quote.resolve.app-state";

import type { AuthoredQuoteBlockContentModule } from "@shared-types/page-content/block/quote/authored.quote.block.page-content.types";
import type { AppStateQuoteBlockContentModule } from "@shared-types/page-content/block/quote/app-state.quote.block.page-content.types";

describe("appStateResolveQuoteBlockContentModule", () => {
  it("defaults attribution to null and flow to content when omitted", () => {
    const module: AuthoredQuoteBlockContentModule = {
      kind: "quote",
      id: "quote-1",
      text: "The marsh was quiet except for the birds.",
    };

    const result = appStateResolveQuoteBlockContentModule(module);

    const expected: AppStateQuoteBlockContentModule = {
      kind: "quote",
      id: "quote-1",
      text: "The marsh was quiet except for the birds.",
      attribution: null,
      flow: "content",
    };

    expect(result).toEqual(expected);
  });

  it("preserves attribution when provided", () => {
    const module: AuthoredQuoteBlockContentModule = {
      kind: "quote",
      id: "quote-2",
      text: "Look long enough and nature always does something unexpected.",
      attribution: "Kevin Ellen",
    };

    const result = appStateResolveQuoteBlockContentModule(module);

    expect(result.attribution).toBe("Kevin Ellen");
    expect(result.flow).toBe("content");
  });

  it("preserves authored flow when provided", () => {
    const module: AuthoredQuoteBlockContentModule = {
      kind: "quote",
      id: "quote-3",
      text: "Field notes are memory made portable.",
      attribution: "Photography Duck",
      flow: "breakout",
    };

    const result = appStateResolveQuoteBlockContentModule(module);

    const expected: AppStateQuoteBlockContentModule = {
      kind: "quote",
      id: "quote-3",
      text: "Field notes are memory made portable.",
      attribution: "Photography Duck",
      flow: "breakout",
    };

    expect(result).toEqual(expected);
  });
});
