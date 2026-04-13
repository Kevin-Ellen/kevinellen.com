// tests/src/app-state/test-support/factories/resolve/links/external-link.factory.ts

import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import type { AuthoredExternalLink } from "@shared-types/links/authored.links.types";
import type { AppStateExternalLink } from "@shared-types/links/app-state.links.types";

export const makeAuthoredExternalLink = (
  overrides: Omit<Partial<AuthoredExternalLink>, "kind" | "href" | "text"> & {
    href?: AuthoredExternalLink["href"];
    text?: AuthoredExternalLink["text"];
  } = {},
): AuthoredExternalLink => {
  return {
    kind: "external",
    href: overrides.href ?? "https://example.com",
    text: overrides.text ?? "Example",
    ...overrides,
  };
};

export const makeAppStateExternalLink = (
  overrides: Partial<AppStateExternalLink> = {},
): AppStateExternalLink => {
  return {
    kind: "external",
    href: "https://example.com",
    text: "Example",
    svgId: null,
    behaviour: {
      openInNewTab: true,
    },
    ...overrides,
  };
};
