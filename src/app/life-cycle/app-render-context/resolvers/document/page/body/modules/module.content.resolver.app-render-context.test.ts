// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/module.content.resolver.app-render-context.test.ts

import { resolveContentModuleAppRenderContext } from "./module.content.resolver.app-render-context";
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
import { resolveJournalListingModuleAppRenderContext } from "./journal-listing/journal-listing.module.body.page.document.content.resolver.app-render-context";
import { resolveTopicListingModuleAppRenderContext } from "./topic-list/topic-list.module.body.page.document.content.resolver.app-render-context";
import { resolveTopicExplorerModuleAppRenderContext } from "./topic-explorer/topic-explorer.module.body.page.content.resolver.app-render-context";

jest.mock(
  "./article-section/article-section.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveArticleSectionModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock("./hero/hero.module.content.resolver.app-render-context", () => ({
  resolveHeroModuleContentAppRenderContext: jest.fn(),
}));

jest.mock(
  "./page-intro/page-intro.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolvePageIntroModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./featured-photo/featured-photo.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveFeaturedPhotoModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./metadata-bar/metadata-bar.module.content.resolver.app-render-context",
  () => ({
    resolveMetadataBarModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./rich-content/rich-content.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveRichContentModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./photo-pair/photo-pair.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolvePhotoPairModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./article-footer/article-footer.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveArticleFooterModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./final-words/final-words.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveFinalWordsModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./editorial-intro/editorial-intro.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveEditorialIntroModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./editorial-split/editorial-split.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveEditorialSplitModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./editorial-feature/editorial-feature.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveEditorialFeatureModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./banner/banner.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveBannerModuleContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./quote/quote.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveQuoteModuleAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./photo-sequence/photo-sequence.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolvePhotoSequenceModuleAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./journal-listing/journal-listing.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveJournalListingModuleAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./topic-list/topic-list.module.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveTopicListingModuleAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./topic-explorer/topic-explorer.module.body.page.content.resolver.app-render-context",
  () => ({
    resolveTopicExplorerModuleAppRenderContext: jest.fn(),
  }),
);

type Content = Parameters<
  typeof resolveContentModuleAppRenderContext
>[0]["content"];
type Kind = Content["kind"];
type ResolvedContent = ReturnType<typeof resolveContentModuleAppRenderContext>;
type ArticleSectionInput = Parameters<
  typeof resolveArticleSectionModuleContentAppRenderContext
>[0];

const resolvers: Record<Kind, jest.Mock> = {
  articleSection:
    resolveArticleSectionModuleContentAppRenderContext as jest.Mock,
  hero: resolveHeroModuleContentAppRenderContext as jest.Mock,
  pageIntro: resolvePageIntroModuleContentAppRenderContext as jest.Mock,
  featuredPhoto: resolveFeaturedPhotoModuleContentAppRenderContext as jest.Mock,
  metadataBar: resolveMetadataBarModuleContentAppRenderContext as jest.Mock,
  richContent: resolveRichContentModuleContentAppRenderContext as jest.Mock,
  photoPair: resolvePhotoPairModuleContentAppRenderContext as jest.Mock,
  articleFooter: resolveArticleFooterModuleContentAppRenderContext as jest.Mock,
  finalWords: resolveFinalWordsModuleContentAppRenderContext as jest.Mock,
  editorialIntro:
    resolveEditorialIntroModuleContentAppRenderContext as jest.Mock,
  editorialSplit:
    resolveEditorialSplitModuleContentAppRenderContext as jest.Mock,
  editorialFeature:
    resolveEditorialFeatureModuleContentAppRenderContext as jest.Mock,
  banner: resolveBannerModuleContentAppRenderContext as jest.Mock,
  quote: resolveQuoteModuleAppRenderContext as jest.Mock,
  photoSequence: resolvePhotoSequenceModuleAppRenderContext as jest.Mock,
  journalListing: resolveJournalListingModuleAppRenderContext as jest.Mock,
  topicListing: resolveTopicListingModuleAppRenderContext as jest.Mock,
  topicExplorer: resolveTopicExplorerModuleAppRenderContext as jest.Mock,
};

describe("Module content AppRenderContext dispatcher", () => {
  const kinds = Object.keys(resolvers) as Kind[];

  const createContent = (
    kind: Kind,
    overrides: Record<string, unknown> = {},
  ): Content =>
    ({
      kind,
      ...overrides,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    for (const kind of kinds) {
      resolvers[kind].mockReturnValue({ kind });
    }
  });

  it.each(kinds)("dispatches %s to the correct resolver", (kind) => {
    const content = createContent(kind);
    const result = resolveContentModuleAppRenderContext({ content });

    expect(resolvers[kind]).toHaveBeenCalledTimes(1);
    expect(resolvers[kind]).toHaveBeenCalledWith(
      kind === "articleSection"
        ? { content, resolveModule: expect.any(Function) }
        : { content },
    );
    expect(result.kind).toBe(kind);

    for (const otherKind of kinds) {
      if (otherKind !== kind) {
        expect(resolvers[otherKind]).not.toHaveBeenCalled();
      }
    }
  });

  it.each(kinds)("preserves the exact resolved result for %s", (kind) => {
    const content = createContent(kind);
    const expected = {
      kind,
      marker: "resolved",
    } as unknown as ResolvedContent;

    resolvers[kind].mockReturnValue(expected);

    const result = resolveContentModuleAppRenderContext({ content });

    expect(result).toBe(expected);
  });

  it.each(kinds)("propagates errors from the %s resolver", (kind) => {
    const error = new Error(`${kind} resolution failed`);

    resolvers[kind].mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveContentModuleAppRenderContext({ content: createContent(kind) }),
    ).toThrow(error);
  });

  describe("ArticleSection dependency injection", () => {
    it("injects a resolver for nested modules", () => {
      const content = createContent("articleSection");

      resolveContentModuleAppRenderContext({ content });

      expect(resolvers.articleSection).toHaveBeenCalledWith({
        content,
        resolveModule: expect.any(Function),
      });
    });

    it("dispatches nested modules synchronously", () => {
      resolveContentModuleAppRenderContext({
        content: createContent("articleSection"),
      });

      const sectionInput = resolvers.articleSection.mock.calls[0]?.[0] as
        | ArticleSectionInput
        | undefined;

      if (!sectionInput) {
        throw new Error("ArticleSection resolver was not called");
      }

      const nestedContent = createContent("hero");
      const resolved = {
        kind: "hero",
        marker: "nested",
      } as unknown as ResolvedContent;
      resolvers.hero.mockReturnValue(resolved);

      const result = sectionInput.resolveModule(nestedContent);

      expect(result).toBe(resolved);
      expect(resolvers.hero).toHaveBeenCalledTimes(1);
      expect(resolvers.hero).toHaveBeenCalledWith({ content: nestedContent });
    });

    it("supports recursively nested ArticleSections", () => {
      resolveContentModuleAppRenderContext({
        content: createContent("articleSection"),
      });

      const sectionInput = resolvers.articleSection.mock.calls[0]?.[0] as
        | ArticleSectionInput
        | undefined;

      if (!sectionInput) {
        throw new Error("ArticleSection resolver was not called");
      }

      const nestedContent = createContent("articleSection");
      sectionInput.resolveModule(nestedContent);

      expect(resolvers.articleSection).toHaveBeenCalledTimes(2);
      expect(resolvers.articleSection).toHaveBeenNthCalledWith(2, {
        content: nestedContent,
        resolveModule: expect.any(Function),
      });
    });
  });

  it("forwards the original content object without modification", () => {
    const content = Object.freeze(
      createContent("hero", { heading: "Wildlife photography" }),
    );
    const resolved = {
      kind: "hero",
      heading: "Resolved hero",
    } as unknown as ResolvedContent;

    resolvers.hero.mockReturnValue(resolved);
    resolveContentModuleAppRenderContext({ content });

    expect(resolvers.hero.mock.calls[0]?.[0].content).toBe(content);
    expect(content.kind).toBe("hero");
  });

  it("does not pass additional arguments to child resolvers", () => {
    const content = createContent("quote");

    resolveContentModuleAppRenderContext({ content });

    expect(resolvers.quote).toHaveBeenCalledWith({ content });
    expect(resolvers.quote.mock.calls[0]).toHaveLength(1);
  });

  it("returns synchronously", () => {
    const content = createContent("hero");
    const expected = { kind: "hero" } as unknown as ResolvedContent;

    resolvers.hero.mockReturnValue(expected);

    const result = resolveContentModuleAppRenderContext({ content });

    expect(result).toBe(expected);
  });
});
