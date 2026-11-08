// src/app/life-cycle/app-render/document/page/body/modules/module.body.page.document.app-render.tsx

import type { ComponentType } from "react";

import type { ModuleContentAppRenderContext } from "../../../../../../types/document/page/content/modules/module.content.page.document.app-render-context.type";

import { HeroModule } from "./hero/hero.module.body.page.document.app-render";
import { ArticleSectionModule } from "./article-section/article-section.module.body.page.document.app-render";
import { PageIntroModule } from "./page-intro/page-intro.module.body.page.document.app-render";
import { FeaturedPhotoModule } from "./featured-photo/featured-photo.module.body.page.document.app-render";
import { MetadataBarModule } from "./metadata-bar/metadata-bar.module.body.page.document.app-render";
import { RichContentModule } from "./rich-content/rich-content.module.body.page.document.app-render";
import { PhotoPairModule } from "./photo-pair/photo-pair.module.body.page.document.app-render";
import { ArticleFooterModule } from "./article-footer/article-footer.module.body.page.document.app-render";
import { FinalWordsModule } from "./final-words/final-words.module.body.page.document.app-render";
import { EditorialIntroModule } from "./editorial-intro/editorial-intro.module.body.page.document.app-render";
import { EditorialSplitModule } from "./editorial-split/editorial-split.module.body.page.document.app-render";
import { EditorialFeatureModule } from "./editorial-feature/editorial-feature.module.body.page.document.app-render";
import { BannerModule } from "./banner/banner.module.body.page.document.app-render";
import { QuoteModule } from "./quote/quote.module.body.page.document.app-render";
import { PhotoSequenceModule } from "./photo-sequence/photo-sequence.module.body.page.document.app-render";
import { TopicsListingModule } from "./topic-listing/topics-listing.module.body.page.document.app-render";
import { TopicExplorerModule } from "./topic-explorer/topic-explorer.module.body.page.document.app-render";
import { JournalListingModule } from "./journal-listing/journal-listing.module.body.page.document.app-render";

type Props = Readonly<{
  module: ModuleContentAppRenderContext;
  contained?: boolean;
}>;

type ModuleKind = ModuleContentAppRenderContext["kind"];

type ModuleRenderer<K extends ModuleKind> = ComponentType<
  Readonly<{
    module: Extract<ModuleContentAppRenderContext, { kind: K }>;
    contained?: boolean;
  }>
>;

const moduleLibrary = {
  hero: HeroModule,
  pageIntro: PageIntroModule,
  featuredPhoto: FeaturedPhotoModule,
  metadataBar: MetadataBarModule,
  richContent: RichContentModule,
  photoPair: PhotoPairModule,
  articleFooter: ArticleFooterModule,
  finalWords: FinalWordsModule,
  editorialIntro: EditorialIntroModule,
  editorialSplit: EditorialSplitModule,
  editorialFeature: EditorialFeatureModule,
  banner: BannerModule,
  quote: QuoteModule,
  photoSequence: PhotoSequenceModule,
  journalListing: JournalListingModule,
  topicListing: TopicsListingModule,
  topicExplorer: TopicExplorerModule,
} satisfies {
  [K in Exclude<ModuleKind, "articleSection">]: ModuleRenderer<K>;
};

export const Module = ({ module, contained }: Props) => {
  if (module.kind === "articleSection") {
    return <ArticleSectionModule module={module} renderModule={Module} />;
  }

  const Component = moduleLibrary[module.kind] as
    | ModuleRenderer<ModuleKind>
    | undefined;

  if (typeof Component !== "function") {
    throw new Error(
      `Invalid AppRender component for "${module.kind}": ${typeof Component}`,
    );
  }

  return <Component module={module} contained={contained} />;
};
