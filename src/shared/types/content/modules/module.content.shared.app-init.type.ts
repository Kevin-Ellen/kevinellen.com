// src/shared/types/content/modules/module.content.shared.app-init.type.ts

import type { ArticleSectionModuleContentAppInit } from "./article-section.module.content.shared.app-init.type";
import type { HeroModuleContentSharedAppInit } from "./hero.module.content.shared.app-init.type";
import type { PageIntroModuleContentAppInit } from "./page-intro.module.content.shared.app-init.type";
import type { FeaturedPhotoModuleContentAppInit } from "./featured-photo.module.content.shared.app-int.type";
import type { MetadataBarModuleContentAppInit } from "./metadata-bar.module.content.shared.app-init.type";
import type { RichContentModuleContentAppInit } from "./rich-content.module.content.shared.app-init.type";
import type { PhotoPairModuleContentAppInit } from "./photo-pair.module.content.shared.app-init.type";
import type { ArticleFooterModuleContentAppInit } from "./article-footer.module.content.shared.app-init.type";
import type { FinalWordsModuleContentAppInit } from "./final-words.module.content.shared.app-init.type";
import type { EditorialIntroModuleContentAppInit } from "./editorial-intro.module.content.shared.app-init.type";
import type { EditorialSplitModuleContentAppInit } from "./editorial-split.module.content.shared.app-init.type";
import type { EditorialFeatureModuleContentAppInit } from "./editorial-feature.module.content.shared.app-init.type";
import type { BannerModuleContentAppInit } from "./banner.module.content.shared.app-init.type";
import type { QuoteModuleContentAppInit } from "./quote.module.content.shared.app-init.type";
import type { PhotoSequenceModuleContentAppInit } from "./photo-squence.module.content.shared.app-int.type";
import type { JournalListingModuleAppInit } from "./journal-listing.module.content.shared.app-init.type";
import type { TopicListingModuleContentAppInit } from "./topic-listing.module.content.shared.app-init.type";
import type { TopicExplorerModuleContentAppInit } from "./topic-explorer.module.content.shared.app-init.type";

export type ModuleContentAppInit =
  | ArticleSectionModuleContentAppInit
  | HeroModuleContentSharedAppInit
  | PageIntroModuleContentAppInit
  | FeaturedPhotoModuleContentAppInit
  | MetadataBarModuleContentAppInit
  | RichContentModuleContentAppInit
  | PhotoPairModuleContentAppInit
  | ArticleFooterModuleContentAppInit
  | FinalWordsModuleContentAppInit
  | EditorialIntroModuleContentAppInit
  | EditorialSplitModuleContentAppInit
  | EditorialFeatureModuleContentAppInit
  | BannerModuleContentAppInit
  | QuoteModuleContentAppInit
  | PhotoSequenceModuleContentAppInit
  | JournalListingModuleAppInit
  | TopicListingModuleContentAppInit
  | TopicExplorerModuleContentAppInit;
