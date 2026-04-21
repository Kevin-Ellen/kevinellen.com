// tests/src/app-context/resolve/page/content/inline/text.resolve.app-context.test.ts

import { appContextResolveTextInlineContent } from "@app-context/resolve/page/content/inline/text.resolve.app-context";

describe("appContextResolveTextInlineContent", () => {
  it("returns the text content unchanged", () => {
    const content = {
      kind: "text",
      value: "Hello world",
    } as const;

    const result = appContextResolveTextInlineContent(content);

    expect(result).toBe(content);
  });
});
