// src/shared/resolvers/content/modules/editorial-feature/editorial-feature.module.content.resolver.shared.app-init.ts

import type { EditorialFeatureModuleContentAuthored } from "../../../../../content-schema/content/modules/editorial-feature.module.content.content-schema.authored.type";
import type { EditorialFeatureModuleContentAppInit } from "../../../../types/content/modules/editorial-feature.module.content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../../types/config/person.config.shared.app-init.type";

import { resolveComponentContentAppInit } from "../../components/component.content.resolver.shared.app-init";
import { resolveEditorialPhotoComponentContentAppInit } from "../../components/editorial-photo/editorial-photo.component.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: EditorialFeatureModuleContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
}>;

export const resolveEditorialFeatureModuleContentAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
}: Input): EditorialFeatureModuleContentAppInit => ({
  ...authored,
  components: authored.components.map((component) =>
    resolveComponentContentAppInit({
      authored: component,
      svgAssets,
      socialProfiles,
    }),
  ),
  media: resolveEditorialPhotoComponentContentAppInit({
    authored: authored.media,
  }),
});
