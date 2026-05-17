// src/app-state/resolve/links/external.link.resolve.app-state.test.ts

import { appStateResolveExternalLink } from "@app-state/resolve/links/external.link.resolve.app-state";

describe("appStateResolveExternalLink", () => {
  it("resolves external links with deterministic behaviour and svg default", () => {
    expect(
      appStateResolveExternalLink({
        kind: "external",
        href: "https://example.com",
        text: "Example",
      }),
    ).toEqual({
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    });
  });

  it("preserves authored svg id", () => {
    expect(
      appStateResolveExternalLink({
        kind: "external",
        href: "https://example.com",
        text: "Example",
        svgId: "external",
      } as never),
    ).toEqual({
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: "external",
      behaviour: {
        openInNewTab: true,
      },
    });
  });
});
