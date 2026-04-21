// tests/src/app-context/resolve/page/content/inline/line-break.resolve.app-context.test.ts

import { appContextResolveLineBreakInlineContent } from "@app-context/resolve/page/content/inline/line-break.resolve.app-context";

describe("appContextResolveLineBreakInlineContent", () => {
  it("returns the line break content unchanged", () => {
    const content = {
      kind: "lineBreak",
    } as const;

    const result = appContextResolveLineBreakInlineContent(content);

    expect(result).toBe(content);
  });
});
