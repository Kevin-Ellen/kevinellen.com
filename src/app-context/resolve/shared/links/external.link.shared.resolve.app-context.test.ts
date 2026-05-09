// src/app-context/resolve/shared/links/external.link.shared.resolve.app-context.test.ts

import type { AppStateExternalLink } from "@shared-types/links/app-state.links.types";

import { appContextResolveExternalLink } from "./external.link.shared.resolve.app-context";

describe("appContextResolveExternalLink", () => {
  it("returns the external link unchanged", () => {
    const link: AppStateExternalLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    };

    const result = appContextResolveExternalLink(link);

    expect(result).toEqual(link);
  });
});
