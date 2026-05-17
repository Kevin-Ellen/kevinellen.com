// src/app-render-context/resolve/body-content/inline/line-break.resolve.app-render-context.test.ts

import type { AppContextLineBreakInline } from "@shared-types/page-content/inline/line-break/app-context.line-break.inline-content.types";

import { appRenderContextResolveLineBreakInline } from "@app-render-context/resolve/body-content/inline/line-break.resolve.app-render-context";

describe("appRenderContextResolveLineBreakInline", () => {
  it("returns the line break inline unchanged", () => {
    const inline: AppContextLineBreakInline = {
      kind: "lineBreak",
    };

    expect(appRenderContextResolveLineBreakInline(inline)).toEqual(inline);
  });
});
