// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/module.content.resolver.app-render-context.ts

import type { ModuleContentAppResolve } from "../../../../../../../types/document/page/content/modules/module.content.page.document.app-resolve.type";
import type { ModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/module.content.page.document.app-render-context.type";

import { resolveArticleSectionModuleContentAppRenderContext } from "./article-section/article-section.module.body.page.document.content.resolver.app-render-context";
import { resolveHeroModuleContentAppRenderContext } from "./hero/hero.module.content.resolver.app-render-context";
import { resolvePageIntroModuleContentAppRenderContext } from "./page-intro/page-intro.module.body.page.document.content.resolver.app-render-context";
import { resolveFeaturedPhotoModuleContentAppRenderContext } from "./featured-photo/featured-photo.module.body.page.document.content.resolver.app-render-context";
import { resolveMetadataBarModuleContentAppRenderContext } from "./metadata-bar/metadata-bar.module.content.resolver.app-render-context";
import { resolveRichContentModuleContentAppRenderContext } from "./rich-content/rich-content.module.body.page.document.content.resolver.app-render-context";
import { resolvePhotoPairModuleContentAppRenderContext } from "./photo-pair/photo-pair.module.body.page.document.content.resolver.app-render-context";
import { resolveArticleFooterModuleContentAppRenderContext } from "./article-footer/article-footer.module.body.page.document.content.resolver.app-render-context";
import { resolveFinalWordsModuleContentAppRenderContext } from "./final-words/final-words.module.body.page.document.content.resolver.app-render-context";
import { resolveEditorialIntroModuleContentAppRenderContext } from "./editorial-intro/editorial-intro.module.body.page.document.content.resolver.app-render-context";
import { resolveEditorialSplitModuleContentAppRenderContext } from "./editorial-split/editorial-split.module.body.page.document.content.resolver.app-render-context";
import { resolveEditorialFeatureModuleContentAppRenderContext } from "./editorial-feature/editorial-feature.module.body.page.document.content.resolver.app-render-context";
import { resolveBannerModuleContentAppRenderContext } from "./banner/banner.module.body.page.document.content.resolver.app-render-context";
import { resolveQuoteModuleAppRenderContext } from "./quote/quote.module.body.page.document.content.resolver.app-render-context";
import { resolvePhotoSequenceModuleAppRenderContext } from "./photo-sequence/photo-sequence.module.body.page.document.content.resolver.app-render-context";
import { resolveTopicListingModuleAppRenderContext } from "./topic-list/topic-list.module.body.page.document.content.resolver.app-render-context";
import { resolveTopicExplorerModuleAppRenderContext } from "./topic-explorer/topic-explorer.module.body.page.content.resolver.app-render-context";
import { resolveJournalListingModuleAppRenderContext } from "./journal-listing/journal-listing.module.body.page.document.content.resolver.app-render-context";

type ModuleKind = ModuleContentAppResolve["kind"];

type RenderContextModule<T extends ModuleContentAppResolve> = Extract<
  ModuleContentAppRenderContext,
  { kind: T["kind"] }
>;

type ResolverLibrary = {
  [K in Exclude<ModuleKind, "articleSection">]: (
    input: Readonly<{
      content: Extract<ModuleContentAppResolve, { kind: K }>;
    }>,
  ) => Extract<ModuleContentAppRenderContext, { kind: K }>;
};

const resolverLibrary = {
  hero: resolveHeroModuleContentAppRenderContext,
  pageIntro: resolvePageIntroModuleContentAppRenderContext,
  featuredPhoto: resolveFeaturedPhotoModuleContentAppRenderContext,
  metadataBar: resolveMetadataBarModuleContentAppRenderContext,
  richContent: resolveRichContentModuleContentAppRenderContext,
  photoPair: resolvePhotoPairModuleContentAppRenderContext,
  articleFooter: resolveArticleFooterModuleContentAppRenderContext,
  finalWords: resolveFinalWordsModuleContentAppRenderContext,
  editorialIntro: resolveEditorialIntroModuleContentAppRenderContext,
  editorialSplit: resolveEditorialSplitModuleContentAppRenderContext,
  editorialFeature: resolveEditorialFeatureModuleContentAppRenderContext,
  banner: resolveBannerModuleContentAppRenderContext,
  quote: resolveQuoteModuleAppRenderContext,
  photoSequence: resolvePhotoSequenceModuleAppRenderContext,
  journalListing: resolveJournalListingModuleAppRenderContext,
  topicListing: resolveTopicListingModuleAppRenderContext,
  topicExplorer: resolveTopicExplorerModuleAppRenderContext,
} satisfies ResolverLibrary;

export const resolveContentModuleAppRenderContext = <
  T extends ModuleContentAppResolve,
>({
  content,
}: Readonly<{ content: T }>): RenderContextModule<T> => {
  if (content.kind === "articleSection") {
    return resolveArticleSectionModuleContentAppRenderContext({
      content,
      resolveModule: <U extends ModuleContentAppResolve>(
        nestedContent: U,
      ): RenderContextModule<U> =>
        resolveContentModuleAppRenderContext({
          content: nestedContent,
        }),
    }) as RenderContextModule<T>;
  }

  const resolver = resolverLibrary[content.kind] as (
    input: Readonly<{ content: ModuleContentAppResolve }>,
  ) => ModuleContentAppRenderContext;

  return resolver({ content }) as RenderContextModule<T>;
};
