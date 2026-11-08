// src/shared/resolvers/content/components/paragraph/paragraph.component.content.resolver.shared.app-init.ts

import type { ParagraphComponentContentAuthored } from "../../../../../content-schema/content/components/paragraph.component.content.content-schema.authored.type";
import type { ParagraphComponentContentAppInit } from "../../../../types/content/components/paragraph.component.content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../../types/config/person.config.shared.app-init.type";

import { resolveInlineContentAppInit } from "../../inline/inline.content.resolver.shared.app-init";

export const resolveParagraphComponentContentAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
}: Readonly<{
  authored: ParagraphComponentContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
}>): ParagraphComponentContentAppInit => ({
  ...authored,
  content: authored.content.map((inline) =>
    resolveInlineContentAppInit({
      authored: inline,
      svgAssets,
      socialProfiles,
    }),
  ),
});
