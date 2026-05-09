// src/app-context/resolve/page-content/inline/text.resolve.app-context.test.ts

import type { AppStateTextInline } from "@shared-types/page-content/inline/text/app-state.text.inline-content.types";

import { appContextResolveTextInline } from "@app-context/resolve/page-content/inline/text.resolve.app-context";

describe("appContextResolveTextInline", () => {
  it("returns text inline content unchanged", () => {
    const content: AppStateTextInline = {
      kind: "text",
      value: "Hello world",
    };

    const result = appContextResolveTextInline(content);

    expect(result).toEqual(content);
    expect(result).toBe(content);
  });
});
