// src/shared/resolvers/content/modules/rich-content/rich-content.module.content.resolver.shared.app-init.ts

import type { RichContentModuleContentAuthored } from "../../../../../content-schema/content/modules/rich-content.module.content.content-schema.authored.type";
import type { RichContentModuleContentAppInit } from "../../../../types/content/modules/rich-content.module.content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../../types/config/person.config.shared.app-init.type";

import { resolveComponentContentAppInit } from "../../components/component.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: RichContentModuleContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
}>;

export const resolveRichContentModuleContentAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
}: Input): RichContentModuleContentAppInit => ({
  ...authored,
  components: authored.components.map((component) =>
    resolveComponentContentAppInit({
      authored: component,
      svgAssets,
      socialProfiles,
    }),
  ),
});
