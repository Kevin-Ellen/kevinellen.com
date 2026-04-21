// tests/src/app-context/resolve/page/content/inline/external-link.resolve.app-context.test.ts

import { appContextResolveExternalLinkInlineContent } from "@app-context/resolve/page/content/inline/external-link.resolve.app-context";

describe("appContextResolveExternalLinkInlineContent", () => {
  it("returns the external link inline content with the same link value", () => {
    const content = {
      kind: "externalLink",
      link: {
        kind: "external",
        href: "https://example.com",
        text: "Example",
        svgId: null,
        behaviour: {
          openInNewTab: true,
        },
      },
    } as const;

    const result = appContextResolveExternalLinkInlineContent(content);

    expect(result).toEqual(content);
    expect(result).not.toBe(content);
    expect(result.link).toBe(content.link);
  });
});
