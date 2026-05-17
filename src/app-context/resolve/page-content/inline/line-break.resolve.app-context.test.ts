// src/app-context/resolve/page-content/inline/line-break.resolve.app-context.test.ts

import type { AppStateLineBreakInline } from "@shared-types/page-content/inline/line-break/app-state.line-break.inline-content.types";

import { appContextResolveLineBreakInline } from "@app-context/resolve/page-content/inline/line-break.resolve.app-context";

describe("appContextResolveLineBreakInline", () => {
  it("returns line break inline content unchanged", () => {
    const content: AppStateLineBreakInline = {
      kind: "lineBreak",
    };

    const result = appContextResolveLineBreakInline(content);

    expect(result).toEqual(content);
    expect(result).toBe(content);
  });
});
