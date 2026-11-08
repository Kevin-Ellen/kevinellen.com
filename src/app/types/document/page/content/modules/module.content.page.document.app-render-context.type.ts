// src/app/types/document/page/content/modules/module.content.page.document.app-render-context.type.ts

import type { ArticleSectionModuleContentAppRenderContext } from "./article-section/article-section.module.content.page.document.app-render-context.type";
import type { HeroModuleContentAppRenderContext } from "./hero/hero.module.content.page.document.app-render-context.type";
import type { PageIntroModuleContentAppRenderContext } from "./page-intro/page-intro.module.content.page.document.app-render-context.type";
import type { FeaturedPhotoModuleContentAppRenderContext } from "./featured-photo/featured-photo.module.content.page.document.app-render-context.type";
import type { MetadataBarModuleContentAppRenderContext } from "./metadata-bar/metadata-bar.content.page.document.app-render-context.type";
import type { RichContentModuleContentAppRenderContext } from "./rich-content/rich-content.module.content.page.document.app-render-context.type";
import type { PhotoPairModuleContentAppRenderContext } from "./photo-pair/photo-pair.module.content.page.document.app-render-context.type";
import type { ArticleFooterModuleContentAppRenderContext } from "./article-footer/article-footer.module.content.page.document.app-render-context.type";
import type { FinalWordsModuleContentAppRenderContext } from "./final-words/final-words.module.content.page.document.app-render-context.type";
import type { EditorialIntroModuleContentAppRenderContext } from "./editorial-editorial/editorial-intro.module.content.page.document.app-render-context.type";
import type { EditorialSplitModuleContentAppRenderContext } from "./editorial-split/editorial-split.module.content.page.document.app-render-context.type";
import type { EditorialFeatureModuleContentAppRenderContext } from "./editorial-feature/editorial-feature.module.content.page.document.app-render-context.type";
import type { BannerModuleContentAppRenderContext } from "./banner/banner.module.content.page.document.app-render-context.type";
import type { QuoteModuleContentAppRenderContext } from "./quote/quote.module.content.page.document.app-render-context.type";
import type { PhotoSequenceModuleContentAppRenderContext } from "./photo-sequence/photo-sequence.module.content.page.document.app-render-context.type";
import type { JournalListingModuleAppRenderContext } from "./journal-listing/journal-listing.module.content.page.document.app-render-context.type";
import type { TopicListingModuleContentAppRenderContext } from "./topic-listing/topic-listing.module.page.document.content.app-render-context.type";
import type { TopicExplorerModuleContentAppRenderContext } from "./topic-explorer/topic-explorer.module.content.page.document.app-render-context.type";

export type ModuleContentAppRenderContext =
  | ArticleSectionModuleContentAppRenderContext
  | HeroModuleContentAppRenderContext
  | PageIntroModuleContentAppRenderContext
  | FeaturedPhotoModuleContentAppRenderContext
  | MetadataBarModuleContentAppRenderContext
  | RichContentModuleContentAppRenderContext
  | PhotoPairModuleContentAppRenderContext
  | ArticleFooterModuleContentAppRenderContext
  | FinalWordsModuleContentAppRenderContext
  | EditorialIntroModuleContentAppRenderContext
  | EditorialSplitModuleContentAppRenderContext
  | EditorialFeatureModuleContentAppRenderContext
  | BannerModuleContentAppRenderContext
  | QuoteModuleContentAppRenderContext
  | PhotoSequenceModuleContentAppRenderContext
  | JournalListingModuleAppRenderContext
  | TopicListingModuleContentAppRenderContext
  | TopicExplorerModuleContentAppRenderContext;
