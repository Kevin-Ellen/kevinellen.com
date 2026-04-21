// tests/src/app-state/resolve/links/external-link.resolve.app-state.test.ts

import { appStateResolveExternalLink } from "@app-state/resolve/links/external.link.resolve.app-state";

import type { AuthoredExternalLink } from "@shared-types/links/authored.links.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";

const SVG_ID: SvgAssetId = "icon-home";

describe("appStateResolveExternalLink", () => {
  it("defaults svgId to null when omitted", () => {
    const authoredLink: AuthoredExternalLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
    };

    const result = appStateResolveExternalLink(authoredLink);

    expect(result.svgId).toBeNull();
  });

  it("preserves svgId when provided", () => {
    const authoredLink: AuthoredExternalLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: SVG_ID,
    };

    const result = appStateResolveExternalLink(authoredLink);

    expect(result.svgId).toBe(SVG_ID);
  });

  it("always sets behaviour.openInNewTab to true", () => {
    const authoredLink: AuthoredExternalLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
    };

    const result = appStateResolveExternalLink(authoredLink);

    expect(result.behaviour).toEqual({
      openInNewTab: true,
    });
  });

  it("returns the expected AppState external link shape", () => {
    const authoredLink: AuthoredExternalLink = {
      kind: "external",
      href: "https://example.com",
      text: "Visit Example",
      svgId: SVG_ID,
    };

    const result = appStateResolveExternalLink(authoredLink);

    expect(result).toEqual({
      kind: "external",
      href: "https://example.com",
      text: "Visit Example",
      svgId: SVG_ID,
      behaviour: {
        openInNewTab: true,
      },
    });
  });
});
