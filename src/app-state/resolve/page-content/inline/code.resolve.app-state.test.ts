// src/app-state/resolve/page-content/inline/code.resolve.app-state.test.ts

import { appStateResolveCodeInline } from "@app-state/resolve/page-content/inline/code.resolve.app-state";

import type { AuthoredCodeInline } from "@shared-types/page-content/inline/code/authored.code.inline-content.types";

describe("appStateResolveCodeInline", () => {
  it("returns authored code inline content unchanged", () => {
    const content = {
      kind: "code",
      value: "const answer = 42;",
    } satisfies AuthoredCodeInline;

    expect(appStateResolveCodeInline(content)).toBe(content);
  });
});
