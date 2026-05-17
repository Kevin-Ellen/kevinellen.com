// src/app-state/resolve/page-content/inline/line-break.resolve.app-state.test.ts

import { appStateResolveLineBreakInline } from "@app-state/resolve/page-content/inline/line-break.resolve.app-state";

import type { AuthoredLineBreakInline } from "@shared-types/page-content/inline/line-break/authored.line-break.inline-content.types";

describe("appStateResolveLineBreakInline", () => {
  it("returns authored line break inline content unchanged", () => {
    const content = {
      kind: "lineBreak",
    } satisfies AuthoredLineBreakInline;

    expect(appStateResolveLineBreakInline(content)).toBe(content);
  });
});
