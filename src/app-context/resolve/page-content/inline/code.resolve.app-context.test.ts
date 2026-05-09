// src/app-context/resolve/page-content/inline/code.resolve.app-context.test.ts

import type { AppStateCodeInline } from "@shared-types/page-content/inline/code/app-state.code.inline-content.types";

import { appContextResolveCodeInline } from "@app-context/resolve/page-content/inline/code.resolve.app-context";

describe("appContextResolveCodeInlineContent", () => {
  it("returns code inline content unchanged", () => {
    const content: AppStateCodeInline = {
      kind: "code",
      value: "const answer = 42;",
    };

    const result = appContextResolveCodeInline(content);

    expect(result).toEqual(content);
    expect(result).toBe(content);
  });
});
