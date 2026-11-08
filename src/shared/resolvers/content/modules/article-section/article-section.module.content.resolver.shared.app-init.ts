// src/shared/resolvers/content/modules/article-section/article-section.module.content.resolver.shared.app-init.ts

import type { ArticleSectionModuleContentAuthored } from "../../../../../content-schema/content/modules/article-section.module.content.content-schema.authored.type";
import type { ArticleSectionModuleContentAppInit } from "../../../../types/content/modules/article-section.module.content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../../types/config/person.config.shared.app-init.type";
import type { ContentDatesAppInit } from "../../../../types/content/content.shared.app-init.type";
import type { TopicsConfigAppInit } from "../../../../../app/types/config/topics/topics.config.app-init.type";
import type { ModuleContentAuthored } from "../../../../../content-schema/content/modules/module.content.content-schema.authored.type";
import type { ModuleContentAppInit } from "../../../../types/content/modules/module.content.shared.app-init.type";

type Input = Readonly<{
  authored: ArticleSectionModuleContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
  dates: ContentDatesAppInit;
  topics: TopicsConfigAppInit;
  resolveModule: <T extends ModuleContentAuthored>(
    authored: T,
  ) => Extract<ModuleContentAppInit, { kind: T["kind"] }>;
}>;

export const resolveArticleSectionModuleContentAppInit = ({
  authored,
  resolveModule,
}: Input): ArticleSectionModuleContentAppInit => ({
  ...authored,
  entries: authored.entries.map((entry) => ({
    ...entry,
    module: resolveModule(entry.module),
  })),
});
