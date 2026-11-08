// src/shared/resolvers/content/modules/module.content.resolver.shared.app-init.ts

import type { ModuleContentAuthored } from "../../../../content-schema/content/modules/module.content.content-schema.authored.type";
import type { ModuleContentAppInit } from "../../../types/content/modules/module.content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../types/config/person.config.shared.app-init.type";
import type { ContentDatesAppInit } from "../../../types/content/content.shared.app-init.type";
import type { TopicsConfigAppInit } from "../../../../app/types/config/topics/topics.config.app-init.type";

import { resolveArticleSectionModuleContentAppInit } from "./article-section/article-section.module.content.resolver.shared.app-init";
import { resolveHeroModuleContentSharedAppInit } from "./hero/hero.module.content.resolver.shared.app-init";
import { resolvePageIntroModuleContentAppInit } from "./page-intro/page-intro.module.content.resolver.shared.app-init";
import { resolveFeaturedPhotoModuleContentAppInit } from "./featured-photo/featured-photo.module.content.resolver.shared.app-init";
import { resolveMetadataBarModuleContentAppInit } from "./metadata-bar/metadata-bar.module.content.resolver.shared.app-init";
import { resolveRichContentModuleContentAppInit } from "./rich-content/rich-content.module.content.resolver.shared.app-init";
import { resolvePhotoPairModuleContentAppInit } from "./photo-pair/photo-pair.module.content.resolver.shared.app-init";
import { resolveArticleFooterModuleContentAppInit } from "./article-footer/article-footer.module.content.resolver.shared.app-init";
import { resolveFinalWordsModuleContentAppInit } from "./final-words/final-words.module.content.resolver.shared.app-init";
import { resolveEditorialIntroModuleContentAppInit } from "./editorial-intro/editorial-intro.module.content.resolver.shared.app-init";
import { resolveEditorialSplitModuleContentAppInit } from "./editorial-split/editorial-split.module.content.resolver.shared.app-init";
import { resolveEditorialFeatureModuleContentAppInit } from "./editorial-feature/editorial-feature.module.content.resolver.shared.app-init";
import { resolveBannerModuleContentAppInit } from "./banner/banner.module.content.resolver.shared.app-init";
import { resolveQuoteModuleAppInit } from "./quote/quote.module.content.resolver.shared.app-init";
import { resolvePhotoSequenceModuleAppInit } from "./photo-sequence/photo-sequence.module.content.resolver.shared.app-init";
import { resolveTopicListingModuleAppInit } from "./topic-listing/topic-listing.module.content.resolver.shared.app-init";
import { resolveTopicExplorerModuleAppInit } from "./topic-explorer/topic-explorer.module.content.resolver.shared.app-init";
import { resolveJournalListingModuleAppInit } from "./journal-listing/journal-listing.module.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: ModuleContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
  dates: ContentDatesAppInit;
  topics: TopicsConfigAppInit;
}>;

const resolvers = {
  hero: resolveHeroModuleContentSharedAppInit,
  pageIntro: resolvePageIntroModuleContentAppInit,
  featuredPhoto: resolveFeaturedPhotoModuleContentAppInit,
  metadataBar: resolveMetadataBarModuleContentAppInit,
  richContent: resolveRichContentModuleContentAppInit,
  photoPair: resolvePhotoPairModuleContentAppInit,
  articleFooter: resolveArticleFooterModuleContentAppInit,
  finalWords: resolveFinalWordsModuleContentAppInit,
  editorialIntro: resolveEditorialIntroModuleContentAppInit,
  editorialSplit: resolveEditorialSplitModuleContentAppInit,
  editorialFeature: resolveEditorialFeatureModuleContentAppInit,
  banner: resolveBannerModuleContentAppInit,
  quote: resolveQuoteModuleAppInit,
  photoSequence: resolvePhotoSequenceModuleAppInit,
  journalListing: resolveJournalListingModuleAppInit,
  topicListing: resolveTopicListingModuleAppInit,
  topicExplorer: resolveTopicExplorerModuleAppInit,
} satisfies Record<
  Exclude<ModuleContentAuthored["kind"], "articleSection">,
  unknown
>;

export const resolveModuleContentAppInit = <T extends ModuleContentAuthored>(
  input: Omit<Input, "authored"> & Readonly<{ authored: T }>,
): Extract<ModuleContentAppInit, { kind: T["kind"] }> => {
  if (input.authored.kind === "articleSection") {
    return resolveArticleSectionModuleContentAppInit({
      ...input,
      authored: input.authored,
      resolveModule: <U extends ModuleContentAuthored>(
        authored: U,
      ): Extract<ModuleContentAppInit, { kind: U["kind"] }> =>
        resolveModuleContentAppInit({
          ...input,
          authored,
        }),
    }) as Extract<ModuleContentAppInit, { kind: T["kind"] }>;
  }

  const resolver = resolvers[input.authored.kind] as (
    input: Input,
  ) => ModuleContentAppInit;

  return resolver(input) as Extract<ModuleContentAppInit, { kind: T["kind"] }>;
};
