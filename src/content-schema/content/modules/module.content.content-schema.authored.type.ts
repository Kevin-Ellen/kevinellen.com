// src/content-schema/content/modules/module.content.content-schema.authored.type.ts

import type { ArticleSectionModuleContentAuthored } from "./article-section.module.content.content-schema.authored.type";
import type { HeroModuleContentSchemaAuthored } from "./hero.module.content.content-schema.authored.type";
import type { PageIntroModuleContentAuthored } from "./page-intro.module.content.content-schema.authored.type";
import type { FeaturedPhotoModuleContentAuthored } from "./featured-photo.module.content.content-schema.authored.type";
import type { MetadataBarModuleContentAuthored } from "./metadata-bar.module.content.content-schema.authored.type";
import type { RichContentModuleContentAuthored } from "./rich-content.module.content.content-schema.authored.type";
import type { PhotoPairModuleContentAuthored } from "./photo-pair.module.content.content-schema.authored.type";
import type { ArticleFooterModuleContentAuthored } from "./article-footer.module.content.content-schema.authored.type";
import type { FinalWordsModuleContentAuthored } from "./final-words.module.content.content-schema.authored.type";
import type { EditorialIntroModuleContentAuthored } from "./editorial-intro.module.content.content-schema.authored.type";
import type { EditorialSplitModuleContentAuthored } from "./editorial-split.module.content.content-schema.authored.type";
import type { EditorialFeatureModuleContentAuthored } from "./editorial-feature.module.content.content-schema.authored.type";
import type { BannerModuleContentAuthored } from "./banner.module.content.content-schema.authored.type";
import type { QuoteModuleContentAuthored } from "./quote.module.content.content-schema.authored.type";
import type { PhotoSequenceModuleContentAuthored } from "./photo-sequence.module.content.content-schema.authored.type";
import type { JournalListingModuleContentAuthored } from "./journal-listing.module.content.content-schema.type";
import type { TopicListingModuleContentAuthored } from "./topic-listing.module.content.content-schema.authored.type";
import type { TopicExplorerModuleContentAuthored } from "./topic-explorer.module.content.content-schema.authored.type";

export type ModuleContentAuthored =
  | ArticleSectionModuleContentAuthored
  | HeroModuleContentSchemaAuthored
  | PageIntroModuleContentAuthored
  | FeaturedPhotoModuleContentAuthored
  | MetadataBarModuleContentAuthored
  | RichContentModuleContentAuthored
  | PhotoPairModuleContentAuthored
  | ArticleFooterModuleContentAuthored
  | FinalWordsModuleContentAuthored
  | EditorialIntroModuleContentAuthored
  | EditorialSplitModuleContentAuthored
  | EditorialFeatureModuleContentAuthored
  | BannerModuleContentAuthored
  | QuoteModuleContentAuthored
  | PhotoSequenceModuleContentAuthored
  | JournalListingModuleContentAuthored
  | TopicListingModuleContentAuthored
  | TopicExplorerModuleContentAuthored;
