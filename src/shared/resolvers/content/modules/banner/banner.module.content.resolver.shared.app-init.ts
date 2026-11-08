// src/shared/resolvers/content/modules/banner/banner.module.content.resolver.shared.app-init.ts

import type { BannerModuleContentAuthored } from "../../../../../content-schema/content/modules/banner.module.content.content-schema.authored.type";
import type { BannerModuleContentAppInit } from "../../../../types/content/modules/banner.module.content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../../types/config/person.config.shared.app-init.type";

import { resolveComponentContentAppInit } from "../../components/component.content.resolver.shared.app-init";
import { resolveEditorialPhotoComponentContentAppInit } from "../../components/editorial-photo/editorial-photo.component.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: BannerModuleContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
}>;

export const resolveBannerModuleContentAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
}: Input): BannerModuleContentAppInit => ({
  ...authored,
  media: resolveEditorialPhotoComponentContentAppInit({
    authored: authored.media,
  }),
  components: authored.components.map((component) =>
    resolveComponentContentAppInit({
      authored: component,
      svgAssets,
      socialProfiles,
    }),
  ),
});
