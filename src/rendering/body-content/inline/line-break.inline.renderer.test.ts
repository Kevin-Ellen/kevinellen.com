// src/rendering/body-content/inline/line-break.inline.renderer.test.ts

import type { AppRenderContextLineBreakInline } from "@shared-types/page-content/inline/line-break/app-render-context.line-break.inline-content.types";

import { renderLineBreakInline } from "@rendering/body-content/inline/line-break.inline.renderer";

describe("renderLineBreakInline", () => {
  it("renders a line break element", () => {
    const item = {
      kind: "lineBreak",
    } as AppRenderContextLineBreakInline;

    expect(renderLineBreakInline(item)).toBe("<br>");
  });
});
