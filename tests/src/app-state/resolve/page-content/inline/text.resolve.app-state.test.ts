// tests/src/app-state/resolve/page-content/inline/text.resolve.app-state.test.ts

import { appStateResolveTextInlineContent } from "@app-state/resolve/page-content/inline/text.resolve.app-state";

import type { AuthoredTextInlineContent } from "@shared-types/page-content/inline/text/authored.text.inline-content.page-content.types";
import type { AppStateTextInlineContent } from "@shared-types/page-content/inline/text/app-state.text.inline-content.page-content.types";

describe("appStateResolveTextInlineContent", () => {
  it("returns text inline content unchanged", () => {
    const content: AuthoredTextInlineContent = {
      kind: "text",
      value: "Hello world",
    };

    const result = appStateResolveTextInlineContent(content);

    const expected: AppStateTextInlineContent = {
      kind: "text",
      value: "Hello world",
    };

    expect(result).toEqual(expected);
  });

  it("returns the same object reference", () => {
    const content: AuthoredTextInlineContent = {
      kind: "text",
      value: "Some text",
    };

    const result = appStateResolveTextInlineContent(content);

    expect(result).toBe(content);
  });
});
