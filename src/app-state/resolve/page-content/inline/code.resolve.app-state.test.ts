// src/app-state/resolve/page-content/inline/code.resolve.app-state.test.ts

import { appStateResolveCodeInline } from "@app-state/resolve/page-content/inline/code.resolve.app-state";

import type { AuthoredCodeInline } from "@shared-types/page-content/inline/code/authored.code.inline-content.types";

describe("appStateResolveCodeInline", () => {
  it("applies deterministic defaults", () => {
    const content = {
      kind: "code",
      value: "const answer = 42;",
    } satisfies AuthoredCodeInline;

    expect(appStateResolveCodeInline(content)).toEqual({
      kind: "code",
      value: "const answer = 42;",
      language: null,
    });
  });

  it("preserves authored language", () => {
    const content = {
      kind: "code",
      value: "const answer = 42;",
      language: "ts",
    } satisfies AuthoredCodeInline;

    expect(appStateResolveCodeInline(content)).toEqual({
      kind: "code",
      value: "const answer = 42;",
      language: "ts",
    });
  });
});
