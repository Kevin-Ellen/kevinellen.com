// src/app-render-context/resolve/body-content/inline/text.resolve.app-render-context.test.ts

import type { AppContextTextInline } from "@shared-types/page-content/inline/text/app-context.text.inline-content.types";

import { appRenderContextResolveTextInline } from "@app-render-context/resolve/body-content/inline/text.resolve.app-render-context";

describe("appRenderContextResolveTextInline", () => {
  it("returns the text inline unchanged", () => {
    const inline: AppContextTextInline = {
      kind: "text",
      value: "Coots are excellent nest builders.",
    };

    expect(appRenderContextResolveTextInline(inline)).toEqual(inline);
  });
});
