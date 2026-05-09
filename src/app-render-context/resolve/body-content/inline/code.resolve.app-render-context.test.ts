// src/app-render-context/resolve/body-content/inline/code.resolve.app-render-context.test.ts

import type { AppContextCodeInline } from "@shared-types/page-content/inline/code/app-context.code.inline-content.types";

import { appRenderContextResolveCodeInline } from "@app-render-context/resolve/body-content/inline/code.resolve.app-render-context";

describe("appRenderContextResolveCodeInline", () => {
  it("returns the inline code content unchanged", () => {
    const inline: AppContextCodeInline = {
      kind: "code",
      value: "const answer = 42;",
    };

    expect(appRenderContextResolveCodeInline(inline)).toEqual(inline);
  });
});
