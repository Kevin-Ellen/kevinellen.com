// src/app/life-cycle/app-init/resolvers/navigation/navigation.resolver.app-init.ts

import type { NavigationConfigAuthored } from "../../../../types/config/navigation/navigation.config.authored.type";
import type { NavigationConfigAppInit } from "../../../../types/config/navigation/navigation.config.app-init.type";

import type { SvgAssetId } from "../../../../../shared/types/assets/svg-id.asset.shared.type";
import type { SvgAssetAppInit } from "../../../../../shared/types/assets/svg.asset.shared.app-init.type";
import type { PersonConfigAppInit } from "../../../../../shared/types/config/person.config.shared.app-init.type";

import { resolveLinkAppInit } from "../../../../../shared/resolvers/content/primitives/link/link.primitive.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: NavigationConfigAuthored;
  svgAssets: Readonly<Record<SvgAssetId, SvgAssetAppInit>>;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
}>;

export const resolveNavigationConfigAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
}: Input): NavigationConfigAppInit => {
  const dependencies = {
    svgAssets,
    socialProfiles,
  };

  return {
    branding: resolveLinkAppInit({
      authored: authored.branding,
      ...dependencies,
    }),

    primary: authored.primary.map((link) =>
      resolveLinkAppInit({
        authored: link,
        ...dependencies,
      }),
    ),

    social: authored.social.map((link) =>
      resolveLinkAppInit({
        authored: link,
        ...dependencies,
      }),
    ),

    footer: {
      primary: authored.footer.primary.map((section) => ({
        ...section,
        links: section.links.map((link) =>
          resolveLinkAppInit({
            authored: link,
            ...dependencies,
          }),
        ),
      })),

      legal: {
        ...authored.footer.legal,
        links: authored.footer.legal.links.map((link) =>
          resolveLinkAppInit({
            authored: link,
            ...dependencies,
          }),
        ),
      },
    },
  };
};
