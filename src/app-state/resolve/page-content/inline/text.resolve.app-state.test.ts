// src/app-state/resolve/page-content/inline/text.resolve.app-state.test.ts

import { appStateResolveTextInline } from "@app-state/resolve/page-content/inline/text.resolve.app-state";

import type { AuthoredTextInline } from "@shared-types/page-content/inline/text/authored.text.inline-content.types";

describe("appStateResolveTextInline", () => {
  it("returns authored text inline content unchanged", () => {
    const content = {
      kind: "text",
      value: "The road goes ever on and on.",
    } satisfies AuthoredTextInline;

    expect(appStateResolveTextInline(content)).toBe(content);
  });
});
