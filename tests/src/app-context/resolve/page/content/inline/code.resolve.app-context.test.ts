// tests/src/app-context/resolve/page/content/inline/code.resolve.app-context.test.ts

import { appContextResolveCodeInlineContent } from "@app-context/resolve/page/content/inline/code.resolve.app-context";

describe("appContextResolveCodeInlineContent", () => {
  it("returns the code content unchanged", () => {
    const content = {
      kind: "code",
      value: "const x = 1;",
    } as const;

    const result = appContextResolveCodeInlineContent(content);

    expect(result).toBe(content);
  });
});
