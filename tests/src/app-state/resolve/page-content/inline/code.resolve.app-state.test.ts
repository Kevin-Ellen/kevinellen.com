// tests/src/app-state/resolve/page-content/inline/code.resolve.app-state.test.ts

import { appStateResolveCodeInlineContent } from "@app-state/resolve/page-content/inline/code.resolve.app-state";

import type { AuthoredCodeInlineContent } from "@shared-types/page-content/inline/code/authored.code.inline-content.page-content.types";
import type { AppStateCodeInlineContent } from "@shared-types/page-content/inline/code/app-state.code.inline-content.page-content.types";

describe("appStateResolveCodeInlineContent", () => {
  it("returns code inline content unchanged", () => {
    const content: AuthoredCodeInlineContent = {
      kind: "code",
      value: "const answer = 42;",
    };

    const result = appStateResolveCodeInlineContent(content);

    const expected: AppStateCodeInlineContent = {
      kind: "code",
      value: "const answer = 42;",
    };

    expect(result).toEqual(expected);
  });

  it("returns the same object reference", () => {
    const content: AuthoredCodeInlineContent = {
      kind: "code",
      value: "console.log('hello');",
    };

    const result = appStateResolveCodeInlineContent(content);

    expect(result).toBe(content);
  });
});
