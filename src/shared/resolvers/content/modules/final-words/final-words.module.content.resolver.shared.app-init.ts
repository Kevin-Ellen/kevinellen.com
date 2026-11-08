// src/shared/resolvers/content/modules/final-words/final-words.module.content.resolver.shared.app-init.ts

import type { FinalWordsModuleContentAuthored } from "../../../../../content-schema/content/modules/final-words.module.content.content-schema.authored.type";
import type { FinalWordsModuleContentAppInit } from "../../../../types/content/modules/final-words.module.content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../../types/config/person.config.shared.app-init.type";

import { resolveComponentContentAppInit } from "../../components/component.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: FinalWordsModuleContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
}>;

export const resolveFinalWordsModuleContentAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
}: Input): FinalWordsModuleContentAppInit => ({
  ...authored,
  components: authored.components.map((component) =>
    resolveComponentContentAppInit({
      authored: component,
      svgAssets,
      socialProfiles,
    }),
  ),
});
