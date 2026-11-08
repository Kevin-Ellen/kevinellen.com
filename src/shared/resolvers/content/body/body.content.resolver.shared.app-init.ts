// src/shared/resolvers/content/body/body.content.resolver.shared.app-init.ts

import type { ContentBodyAuthored } from "../../../../content-schema/content/body/body.content.content-schema.authored.type";
import type { ContentBodyAppInit } from "../../../types/content/body/body.content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../types/config/person.config.shared.app-init.type";
import type { ContentDatesAppInit } from "../../../types/content/content.shared.app-init.type";
import type { TopicsConfigAppInit } from "../../../../app/types/config/topics/topics.config.app-init.type";

import { resolveContentBodyFooterAppInit } from "./footer/footer.body.content.resolver.shared.app-init";
import { resolveModuleContentAppInit } from "../modules/module.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: ContentBodyAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
  dates: ContentDatesAppInit;
  topics: TopicsConfigAppInit;
}>;

export const resolveContentBodyAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
  dates,
  topics,
}: Input): ContentBodyAppInit => ({
  modules: authored.modules.map((module) =>
    resolveModuleContentAppInit({
      authored: module,
      svgAssets,
      socialProfiles,
      dates,
      topics,
    }),
  ),

  footer: resolveContentBodyFooterAppInit({
    authored: authored.footer,
    svgAssets,
    socialProfiles,
    dates,
    topics,
  }),
});
