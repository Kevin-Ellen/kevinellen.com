// src/app-context/resolve/page-content/inline/external-link.resolve.app-context.test.ts

import type { AppStateExternalLinkInline } from "@shared-types/page-content/inline/external-link/app-state.external-link.inline-content.types";

import { appContextResolveExternalLinkInline } from "@app-context/resolve/page-content/inline/external-link.resolve.app-context";

describe("appContextResolveExternalLinkInline", () => {
  it("returns external link inline content unchanged", () => {
    const content: AppStateExternalLinkInline = {
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
    };

    const result = appContextResolveExternalLinkInline(content);

    expect(result).toEqual(content);
    expect(result).toBe(content);
  });
});
