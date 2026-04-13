// tests/src/app-state/test-support/factories/resolve/links/internal-link.factory.ts

import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import type { AuthoredInternalLink } from "@shared-types/links/authored.links.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";

const DEFAULT_SVG_ID: SvgAssetId = "icon-home";

export const makeAuthoredInternalLink = (
  overrides: Omit<Partial<AuthoredInternalLink>, "kind" | "id"> & {
    id?: AuthoredInternalLink["id"];
  } = {},
): AuthoredInternalLink => {
  return {
    kind: "internal",
    id: overrides.id ?? "home",
    ...overrides,
  };
};

export const makeAppStateInternalLink = (
  overrides: Partial<AppStateInternalLink> = {},
): AppStateInternalLink => {
  return {
    kind: "internal",
    id: "home",
    svgId: null,
    behaviour: {
      openInNewTab: false,
    },
    ...overrides,
  };
};

export const makeAuthoredInternalLinkWithSvg = (
  svgId: SvgAssetId = DEFAULT_SVG_ID,
): AuthoredInternalLink => {
  return makeAuthoredInternalLink({ svgId });
};
