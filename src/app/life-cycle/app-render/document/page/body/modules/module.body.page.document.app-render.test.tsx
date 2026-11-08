// src/app/life-cycle/app-render/document/page/body/modules/module.body.page.document.app-render.test.tsx

import { renderToStaticMarkup } from "react-dom/server";
import { Module } from "./module.body.page.document.app-render";
import { ArticleSectionModule } from "./article-section/article-section.module.body.page.document.app-render";
import { HeroModule } from "./hero/hero.module.body.page.document.app-render";
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
import { JournalListingModule } from "./journal-listing/journal-listing.module.body.page.document.app-render";
import { TopicsListingModule } from "./topic-listing/topics-listing.module.body.page.document.app-render";
import { TopicExplorerModule } from "./topic-explorer/topic-explorer.module.body.page.document.app-render";

jest.mock(
  "./article-section/article-section.module.body.page.document.app-render",
  () => ({
    ArticleSectionModule: jest.fn(() => null),
  }),
);
jest.mock("./hero/hero.module.body.page.document.app-render", () => ({
  HeroModule: jest.fn(() => null),
}));
jest.mock(
  "./page-intro/page-intro.module.body.page.document.app-render",
  () => ({
    PageIntroModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./featured-photo/featured-photo.module.body.page.document.app-render",
  () => ({
    FeaturedPhotoModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./metadata-bar/metadata-bar.module.body.page.document.app-render",
  () => ({
    MetadataBarModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./rich-content/rich-content.module.body.page.document.app-render",
  () => ({
    RichContentModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./photo-pair/photo-pair.module.body.page.document.app-render",
  () => ({
    PhotoPairModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./article-footer/article-footer.module.body.page.document.app-render",
  () => ({
    ArticleFooterModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./final-words/final-words.module.body.page.document.app-render",
  () => ({
    FinalWordsModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./editorial-intro/editorial-intro.module.body.page.document.app-render",
  () => ({
    EditorialIntroModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./editorial-split/editorial-split.module.body.page.document.app-render",
  () => ({
    EditorialSplitModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./editorial-feature/editorial-feature.module.body.page.document.app-render",
  () => ({
    EditorialFeatureModule: jest.fn(() => null),
  }),
);
jest.mock("./banner/banner.module.body.page.document.app-render", () => ({
  BannerModule: jest.fn(() => null),
}));
jest.mock("./quote/quote.module.body.page.document.app-render", () => ({
  QuoteModule: jest.fn(() => null),
}));
jest.mock(
  "./photo-sequence/photo-sequence.module.body.page.document.app-render",
  () => ({
    PhotoSequenceModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./journal-listing/journal-listing.module.body.page.document.app-render",
  () => ({
    JournalListingModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./topic-listing/topics-listing.module.body.page.document.app-render",
  () => ({
    TopicsListingModule: jest.fn(() => null),
  }),
);
jest.mock(
  "./topic-explorer/topic-explorer.module.body.page.document.app-render",
  () => ({
    TopicExplorerModule: jest.fn(() => null),
  }),
);
type ModuleContext = Parameters<typeof Module>[0]["module"];
type ModuleKind = ModuleContext["kind"];
const renderers = {
  articleSection: jest.mocked(ArticleSectionModule),
  hero: jest.mocked(HeroModule),
  pageIntro: jest.mocked(PageIntroModule),
  featuredPhoto: jest.mocked(FeaturedPhotoModule),
  metadataBar: jest.mocked(MetadataBarModule),
  richContent: jest.mocked(RichContentModule),
  photoPair: jest.mocked(PhotoPairModule),
  articleFooter: jest.mocked(ArticleFooterModule),
  finalWords: jest.mocked(FinalWordsModule),
  editorialIntro: jest.mocked(EditorialIntroModule),
  editorialSplit: jest.mocked(EditorialSplitModule),
  editorialFeature: jest.mocked(EditorialFeatureModule),
  banner: jest.mocked(BannerModule),
  quote: jest.mocked(QuoteModule),
  photoSequence: jest.mocked(PhotoSequenceModule),
  journalListing: jest.mocked(JournalListingModule),
  topicListing: jest.mocked(TopicsListingModule),
  topicExplorer: jest.mocked(TopicExplorerModule),
};
const kinds = Object.keys(renderers) as ModuleKind[];
describe("Module AppRender dispatcher", () => {
  /**
   * Deliberately use minimal discriminated fixtures here.
   * Child renderers are mocked; this suite tests dispatch and prop forwarding.
   */
  const createModule = (kind: ModuleKind): ModuleContext =>
    ({ kind }) as unknown as ModuleContext;
  const renderModule = (module: ModuleContext, contained?: boolean): string =>
    renderToStaticMarkup(<Module module={module} contained={contained} />);
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Renderer dispatch", () => {
    it.each(kinds)(
      "dispatches %s to the corresponding module renderer",
      (kind) => {
        const module = createModule(kind);
        renderModule(module);
        expect(renderers[kind]).toHaveBeenCalledTimes(1);
        expect(renderers[kind].mock.calls[0]?.[0]).toEqual(
          kind === "articleSection"
            ? { module, renderModule: Module }
            : { module, contained: undefined },
        );
      },
    );
    it.each(kinds)("preserves the original %s module reference", (kind) => {
      const module = createModule(kind);
      renderModule(module);
      expect(renderers[kind].mock.calls[0]?.[0].module).toBe(module);
    });
    it.each(kinds)("does not invoke unrelated renderers for %s", (kind) => {
      renderModule(createModule(kind));
      for (const otherKind of kinds) {
        if (otherKind !== kind) {
          expect(renderers[otherKind]).not.toHaveBeenCalled();
        }
      }
    });
  });
  it("injects the dispatcher as the ArticleSection nested renderer", () => {
    const module = createModule("articleSection");
    renderModule(module);
    expect(renderers.articleSection).toHaveBeenCalledTimes(1);
    expect(renderers.articleSection.mock.calls[0]?.[0]).toEqual({
      module,
      renderModule: Module,
    });
  });
  describe("Containment", () => {
    it.each([true, false])(
      "forwards contained=%s to RichContentModule",
      (contained) => {
        const module = createModule("richContent");
        renderModule(module, contained);
        expect(renderers.richContent.mock.calls[0]?.[0]).toEqual({
          module,
          contained,
        });
      },
    );
    it("forwards containment to JournalListingModule", () => {
      const module = createModule("journalListing");
      renderModule(module, false);
      expect(renderers.journalListing.mock.calls[0]?.[0]).toEqual({
        module,
        contained: false,
      });
    });
    it("forwards containment without transforming it", () => {
      const module = createModule("hero");
      renderModule(module, true);
      expect(renderers.hero.mock.calls[0]?.[0]).toEqual({
        module,
        contained: true,
      });
    });
  });
  describe("Invalid renderer guard", () => {
    it("throws for an unregistered module kind", () => {
      const module = {
        kind: "unregisteredModule",
      } as unknown as ModuleContext;
      expect(() => renderModule(module)).toThrow(
        'Invalid AppRender component for "unregisteredModule": undefined',
      );
      for (const kind of kinds) {
        expect(renderers[kind]).not.toHaveBeenCalled();
      }
    });
    it("throws for a missing module kind", () => {
      const module = {} as unknown as ModuleContext;
      expect(() => renderModule(module)).toThrow(
        'Invalid AppRender component for "undefined": undefined',
      );
    });
  });
  describe("Render output", () => {
    it("does not introduce its own DOM wrapper", () => {
      const output = renderModule(createModule("hero"));
      expect(output).toBe("");
      expect(renderers.hero).toHaveBeenCalledTimes(1);
    });
  });
});
