// src/app/life-cycle/app-init/resolvers/footer/footer.resolver.app-init.ts

import type { FooterConfigAuthored } from "../../../../types/config/footer/footer.config.authored.type";
import type { FooterConfigAppInit } from "../../../../types/config/footer/footer.config.app-init.type";
import type { SvgAssetId } from "../../../../../shared/types/assets/svg-id.asset.shared.type";
import type { SvgAssetAppInit } from "../../../../../shared/types/assets/svg.asset.shared.app-init.type";
import type { PersonConfigAppInit } from "../../../../../shared/types/config/person.config.shared.app-init.type";

import { resolveLinkAppInit } from "../../../../../shared/resolvers/content/primitives/link/link.primitive.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: FooterConfigAuthored;
  svgAssets: Readonly<Record<SvgAssetId, SvgAssetAppInit>>;
  person: PersonConfigAppInit;
}>;

export const resolveFooterConfigAppInit = ({
  authored,
  svgAssets,
  person,
}: Input): FooterConfigAppInit => ({
  conservation: {
    ...authored.conservation,
    conservations: authored.conservation.conservations.map((item) => ({
      ...item,
      link: resolveLinkAppInit({
        authored: item.link,
        svgAssets,
        socialProfiles: {},
      }),
    })),
  },
  colophon: {
    ...authored.colophon,
    year: new Date().getFullYear(),
    name: person.name,
  },
});
