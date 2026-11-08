// src/app/life-cycle/app-resolve/resolvers/content/modules/module.content.resolver.app-resolve.ts

import type { ModuleContentAppInit } from "../../../../../../shared/types/content/modules/module.content.shared.app-init.type";
import type { ModuleContentAppResolve } from "../../../../../types/document/page/content/modules/module.content.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../types/registries/content.registry.app-resolve.type";
import type { PhotoGetter } from "../../../getters/photo-kv/photo-kv.getter.app-resolve";
import type { PublishedRegistry } from "../../../../../../shared/types/content/kv-ledger.content.shared.type";
import type { TopicId } from "../../../../../../content-schema/topics/topic-id.topics.content-schema.type";

import { resolveArticleSectionModuleContentAppResolve } from "./article-section/article-section.module.content.resolver.app-resolve";
import { resolveHeroModuleContentAppResolve } from "./hero/hero.module.content.resolver.app-resolve";
import { resolvePageIntroModuleContentAppResolve } from "./page-intro/page-intro.module.content.resolver.app-resolve";
import { resolveFeaturedPhotoModuleContentAppResolve } from "./featured-photo/featured-photo.module.content.resolver.app-resolve";
import { resolveMetadataBarModuleContentAppResolve } from "./metadata-bar/metadata-bar.module.content.resolver.app-resolve";
import { resolveRichContentModuleContentAppResolve } from "./rich-content/rich-content.module.content.resolver.app-resolve";
import { resolvePhotoPairModuleContentAppResolve } from "./photo-pair/photo-pair.module.content.resolver.app-resolver";
import { resolveArticleFooterModuleContentAppResolve } from "./article-footer/article-footer.module.content.resolver.app-resolve";
import { resolveFinalWordsModuleContentAppResolve } from "./final-words/final-words.module.content.resolver.app-resolve";
import { resolveEditorialIntroModuleContentAppResolve } from "./editorial-intro/editorial-intro.module.content.resolver.app-resolve";
import { resolveEditorialSplitModuleContentAppResolve } from "./editorial-split/editorial-split.module.content.resolver.app-resolve";
import { resolveEditorialFeatureModuleContentAppResolve } from "./editorial-feature/editorial-feature.module.content.resolver.app-resolve";
import { resolveBannerModuleContentAppResolve } from "./banner/banner.module.content.resolver.app-resolve";
import { resolveQuoteModuleAppResolve } from "./quote/quote.module.content.resolver.app-resolve";
import { resolvePhotoSequenceModuleAppResolve } from "./photo-sequence/photo-sequence.module.content.resolver.app-resolve";
import { resolveJournalListingModuleAppResolve } from "./journal-listing/journal-listing.module.content.resolver.app-resolve";
import { resolveTopicListingModuleAppResolve } from "./topic-listing/topic-listing.module.content.resolver.app-resolve";
import { resolveTopicExplorerModuleAppResolve } from "./topic-explorer/topic-explorer.module.content.resolver.app-resolve";

type Publication = Readonly<{
  author: string;
  published: string;
  lastUpdated: string;
}>;

type Input = Readonly<{
  content: ModuleContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
  getPhoto: PhotoGetter;
  publication?: Publication;
  journalLedger: PublishedRegistry;
  requestedPage: number;
  topicId?: TopicId;
}>;

type ModuleKind = ModuleContentAppInit["kind"];

type ResolvedModule<T extends ModuleContentAppInit> = Extract<
  ModuleContentAppResolve,
  { kind: T["kind"] }
>;

type ResolverLibrary = {
  [K in Exclude<ModuleKind, "articleSection">]: (
    input: Omit<Input, "content"> & {
      content: Extract<ModuleContentAppInit, { kind: K }>;
    },
  ) =>
    | Extract<ModuleContentAppResolve, { kind: K }>
    | Promise<Extract<ModuleContentAppResolve, { kind: K }>>;
};

const resolverLibrary = {
  hero: resolveHeroModuleContentAppResolve,
  pageIntro: resolvePageIntroModuleContentAppResolve,
  featuredPhoto: resolveFeaturedPhotoModuleContentAppResolve,
  metadataBar: resolveMetadataBarModuleContentAppResolve,
  richContent: resolveRichContentModuleContentAppResolve,
  photoPair: resolvePhotoPairModuleContentAppResolve,

  articleFooter: ({ content, publication }) => {
    if (!publication) {
      throw new Error("Publication metadata is required for articleFooter");
    }

    return resolveArticleFooterModuleContentAppResolve({
      content,
      publication,
    });
  },

  finalWords: resolveFinalWordsModuleContentAppResolve,
  editorialIntro: resolveEditorialIntroModuleContentAppResolve,
  editorialSplit: resolveEditorialSplitModuleContentAppResolve,
  editorialFeature: resolveEditorialFeatureModuleContentAppResolve,
  banner: resolveBannerModuleContentAppResolve,
  quote: resolveQuoteModuleAppResolve,
  photoSequence: resolvePhotoSequenceModuleAppResolve,
  journalListing: resolveJournalListingModuleAppResolve,
  topicListing: resolveTopicListingModuleAppResolve,
  topicExplorer: resolveTopicExplorerModuleAppResolve,
} satisfies ResolverLibrary;

export const resolveContentModuleAppResolve = async <
  T extends ModuleContentAppInit,
>(
  input: Omit<Input, "content"> & { content: T },
): Promise<ResolvedModule<T>> => {
  if (input.content.kind === "articleSection") {
    const result = await resolveArticleSectionModuleContentAppResolve({
      content: input.content,
      resolveModule: <U extends ModuleContentAppInit>(
        content: U,
      ): Promise<ResolvedModule<U>> =>
        resolveContentModuleAppResolve({
          ...input,
          content,
        }),
    });

    return result as ResolvedModule<T>;
  }

  const resolver = resolverLibrary[input.content.kind] as (
    input: Input,
  ) => ModuleContentAppResolve | Promise<ModuleContentAppResolve>;

  const result = await resolver(input);

  return result as ResolvedModule<T>;
};
