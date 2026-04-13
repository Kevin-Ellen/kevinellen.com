// tests/src/app-state/resolve/page-content/inline/line-break.resolve.app-state.test.ts

import { appStateResolveLineBreakInlineContent } from "@app-state/resolve/page-content/inline/line-break.resolve.app-state";

import type { AuthoredLineBreakInlineContent } from "@shared-types/page-content/inline/line-break/authored.line-break.inline-content.page-content.types";
import type { AppStateLineBreakInlineContent } from "@shared-types/page-content/inline/line-break/app-state.line-break.inline-content.page-content.types";

describe("appStateResolveLineBreakInlineContent", () => {
  it("returns line-break inline content unchanged", () => {
    const content: AuthoredLineBreakInlineContent = {
      kind: "lineBreak",
    };

    const result = appStateResolveLineBreakInlineContent(content);

    const expected: AppStateLineBreakInlineContent = {
      kind: "lineBreak",
    };

    expect(result).toEqual(expected);
  });

  it("returns the same object reference", () => {
    const content: AuthoredLineBreakInlineContent = {
      kind: "lineBreak",
    };

    const result = appStateResolveLineBreakInlineContent(content);

    expect(result).toBe(content);
  });
});
