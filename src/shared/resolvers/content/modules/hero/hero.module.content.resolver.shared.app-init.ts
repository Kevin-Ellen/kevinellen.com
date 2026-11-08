// src/shared/resolvers/content/modules/hero/hero.module.content.resolver.shared.app-init.ts

import type { HeroModuleContentSchemaAuthored } from "../../../../../content-schema/content/modules/hero.module.content.content-schema.authored.type";
import type { HeroModuleContentSharedAppInit } from "../../../../types/content/modules/hero.module.content.shared.app-init.type";
import type { SvgRegistryAppInit } from "../../../../types/registries/svg.registry.app-resolve.type";

import { resolveSvgReferenceAppInit } from "../../primitives/svg/svg.primitive.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: HeroModuleContentSchemaAuthored;
  svgAssets: SvgRegistryAppInit;
}>;

export const resolveHeroModuleContentSharedAppInit = ({
  authored,
  svgAssets,
}: Input): HeroModuleContentSharedAppInit => ({
  ...authored,
  location: authored.location
    ? {
        ...authored.location,
        icon: resolveSvgReferenceAppInit({
          authored: authored.location.icon,
          registry: svgAssets,
        }),
      }
    : null,
});
