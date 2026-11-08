// src/shared/resolvers/content/modules/editorial-split/editorial-split.module.content.resolver.shared.app-init.ts

import type { EditorialSplitModuleContentAuthored } from "../../../../../content-schema/content/modules/editorial-split.module.content.content-schema.authored.type";
import type { EditorialSplitModuleContentAppInit } from "../../../../types/content/modules/editorial-split.module.content.shared.app-init.type";

import type { SvgAssetsConfigAppInit } from "../../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../../types/config/person.config.shared.app-init.type";

import { resolveComponentContentAppInit } from "../../components/component.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: EditorialSplitModuleContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
}>;

export const resolveEditorialSplitModuleContentAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
}: Input): EditorialSplitModuleContentAppInit => ({
  ...authored,
  components: authored.components.map((component) =>
    resolveComponentContentAppInit({
      authored: component,
      svgAssets,
      socialProfiles,
    }),
  ),
  media: resolveComponentContentAppInit({
    authored: authored.media,
    svgAssets,
    socialProfiles,
  }) as EditorialSplitModuleContentAppInit["media"],
});
