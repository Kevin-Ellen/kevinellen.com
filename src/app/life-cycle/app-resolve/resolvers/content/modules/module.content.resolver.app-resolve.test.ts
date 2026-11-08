// src/app/life-cycle/app-resolve/resolvers/content/modules/module.content.resolver.app-resolve.test.ts


import { resolveContentModuleAppResolve } from "./module.content.resolver.app-resolve";
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

jest.mock(
  "./article-section/article-section.module.content.resolver.app-resolve",
  () => ({
    resolveArticleSectionModuleContentAppResolve: jest.fn(),
  }),
);
jest.mock("./hero/hero.module.content.resolver.app-resolve", () => ({
  resolveHeroModuleContentAppResolve: jest.fn(),
}));
jest.mock(
  "./page-intro/page-intro.module.content.resolver.app-resolve",
  () => ({
    resolvePageIntroModuleContentAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./featured-photo/featured-photo.module.content.resolver.app-resolve",
  () => ({
    resolveFeaturedPhotoModuleContentAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./metadata-bar/metadata-bar.module.content.resolver.app-resolve",
  () => ({
    resolveMetadataBarModuleContentAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./rich-content/rich-content.module.content.resolver.app-resolve",
  () => ({
    resolveRichContentModuleContentAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./photo-pair/photo-pair.module.content.resolver.app-resolver",
  () => ({
    resolvePhotoPairModuleContentAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./article-footer/article-footer.module.content.resolver.app-resolve",
  () => ({
    resolveArticleFooterModuleContentAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./final-words/final-words.module.content.resolver.app-resolve",
  () => ({
    resolveFinalWordsModuleContentAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./editorial-intro/editorial-intro.module.content.resolver.app-resolve",
  () => ({
    resolveEditorialIntroModuleContentAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./editorial-split/editorial-split.module.content.resolver.app-resolve",
  () => ({
    resolveEditorialSplitModuleContentAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./editorial-feature/editorial-feature.module.content.resolver.app-resolve",
  () => ({
    resolveEditorialFeatureModuleContentAppResolve: jest.fn(),
  }),
);
jest.mock("./banner/banner.module.content.resolver.app-resolve", () => ({
  resolveBannerModuleContentAppResolve: jest.fn(),
}));
jest.mock("./quote/quote.module.content.resolver.app-resolve", () => ({
  resolveQuoteModuleAppResolve: jest.fn(),
}));
jest.mock(
  "./photo-sequence/photo-sequence.module.content.resolver.app-resolve",
  () => ({
    resolvePhotoSequenceModuleAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./journal-listing/journal-listing.module.content.resolver.app-resolve",
  () => ({
    resolveJournalListingModuleAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./topic-listing/topic-listing.module.content.resolver.app-resolve",
  () => ({
    resolveTopicListingModuleAppResolve: jest.fn(),
  }),
);
jest.mock(
  "./topic-explorer/topic-explorer.module.content.resolver.app-resolve",
  () => ({
    resolveTopicExplorerModuleAppResolve: jest.fn(),
  }),
);

type Input = Parameters<typeof resolveContentModuleAppResolve>[0];
type Kind = Input["content"]["kind"];
type ArticleSectionInput = Parameters<
  typeof resolveArticleSectionModuleContentAppResolve
>[0];

const resolvers: Record<Kind, jest.Mock> = {
  articleSection:
    resolveArticleSectionModuleContentAppResolve as unknown as jest.Mock,
  hero: resolveHeroModuleContentAppResolve as unknown as jest.Mock,
  pageIntro: resolvePageIntroModuleContentAppResolve as unknown as jest.Mock,
  featuredPhoto:
    resolveFeaturedPhotoModuleContentAppResolve as unknown as jest.Mock,
  metadataBar:
    resolveMetadataBarModuleContentAppResolve as unknown as jest.Mock,
  richContent:
    resolveRichContentModuleContentAppResolve as unknown as jest.Mock,
  photoPair: resolvePhotoPairModuleContentAppResolve as unknown as jest.Mock,
  articleFooter:
    resolveArticleFooterModuleContentAppResolve as unknown as jest.Mock,
  finalWords: resolveFinalWordsModuleContentAppResolve as unknown as jest.Mock,
  editorialIntro:
    resolveEditorialIntroModuleContentAppResolve as unknown as jest.Mock,
  editorialSplit:
    resolveEditorialSplitModuleContentAppResolve as unknown as jest.Mock,
  editorialFeature:
    resolveEditorialFeatureModuleContentAppResolve as unknown as jest.Mock,
  banner: resolveBannerModuleContentAppResolve as unknown as jest.Mock,
  quote: resolveQuoteModuleAppResolve as unknown as jest.Mock,
  photoSequence: resolvePhotoSequenceModuleAppResolve as unknown as jest.Mock,
  journalListing: resolveJournalListingModuleAppResolve as unknown as jest.Mock,
  topicListing: resolveTopicListingModuleAppResolve as unknown as jest.Mock,
  topicExplorer: resolveTopicExplorerModuleAppResolve as unknown as jest.Mock,
};

const kinds = Object.keys(resolvers) as Kind[];

describe("Module content AppResolve resolver", () => {
  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["contentRegistry"];

  const getPhoto = jest.fn<
    ReturnType<Input["getPhoto"]>,
    Parameters<Input["getPhoto"]>
  >();

  const journalLedger = {
    bySlug: {},
    newestFirst: [],
  } as unknown as Input["journalLedger"];

  const publication = {
    author: "Kevin Ellen",
    published: "2026-10-15",
    lastUpdated: "2026-10-20",
  };

  const createContent = (kind: Kind): Input["content"] =>
    ({ kind }) as Input["content"];

  const createInput = (kind: Kind, overrides: Partial<Input> = {}): Input => ({
    content: createContent(kind),
    contentRegistry,
    getPhoto,
    publication,
    journalLedger,
    requestedPage: 2,
    ...overrides,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    for (const kind of kinds) {
      resolvers[kind].mockReturnValue({ kind });
    }
  });

  it.each(kinds)(
    "dispatches %s to its corresponding resolver",
    async (kind) => {
      const input = createInput(kind);
      const result = await resolveContentModuleAppResolve(input);

      expect(resolvers[kind]).toHaveBeenCalledTimes(1);
      expect(result.kind).toBe(kind);

      for (const otherKind of kinds) {
        if (otherKind !== kind) {
          expect(resolvers[otherKind]).not.toHaveBeenCalled();
        }
      }
    },
  );

  it.each([
    "richContent",
    "finalWords",
    "editorialSplit",
    "editorialFeature",
    "banner",
  ] as Kind[])(
    "forwards the content registry and photo getter to %s",
    async (kind) => {
      const input = createInput(kind);
      await resolveContentModuleAppResolve(input);

      expect(resolvers[kind]).toHaveBeenCalledWith(
        expect.objectContaining({
          content: input.content,
          contentRegistry,
          getPhoto,
        }),
      );
    },
  );

  it.each(["journalListing", "topicExplorer"] as Kind[])(
    "forwards the journal ledger to %s",
    async (kind) => {
      const input = createInput(kind);
      await resolveContentModuleAppResolve(input);

      expect(resolvers[kind]).toHaveBeenCalledWith(
        expect.objectContaining({ journalLedger }),
      );
    },
  );

  it.each(["journalListing", "topicListing"] as Kind[])(
    "forwards the requested page to %s",
    async (kind) => {
      const input = createInput(kind, { requestedPage: 4 });
      await resolveContentModuleAppResolve(input);

      expect(resolvers[kind]).toHaveBeenCalledWith(
        expect.objectContaining({ requestedPage: 4 }),
      );
    },
  );

  describe("ArticleSection dependency injection", () => {
    const getSectionInput = (): ArticleSectionInput => {
      const sectionInput = resolvers.articleSection.mock.calls[0]?.[0] as
        | ArticleSectionInput
        | undefined;

      if (!sectionInput) {
        throw new Error("ArticleSection resolver was not called");
      }

      return sectionInput;
    };

    it("injects the nested module resolver", async () => {
      const input = createInput("articleSection");
      await resolveContentModuleAppResolve(input);

      expect(resolvers.articleSection).toHaveBeenCalledTimes(1);
      expect(resolvers.articleSection).toHaveBeenCalledWith({
        content: input.content,
        resolveModule: expect.any(Function),
      });
      expect(getSectionInput().content).toBe(input.content);
    });

    it("preserves complete context when resolving a nested module", async () => {
      const input = createInput("articleSection", {
        requestedPage: 4,
        topicId: "wildlife" as Input["topicId"],
      });

      await resolveContentModuleAppResolve(input);

      const nestedContent = createContent("hero");
      const result = await getSectionInput().resolveModule(nestedContent);

      expect(result).toBeDefined();
      expect(resolvers.hero).toHaveBeenCalledTimes(1);
      expect(resolvers.hero).toHaveBeenCalledWith({
        ...input,
        content: nestedContent,
      });

      const forwarded = resolvers.hero.mock.calls[0]?.[0] as Input;
      expect(forwarded.content).toBe(nestedContent);
      expect(forwarded.contentRegistry).toBe(contentRegistry);
      expect(forwarded.getPhoto).toBe(getPhoto);
      expect(forwarded.publication).toBe(publication);
      expect(forwarded.journalLedger).toBe(journalLedger);
      expect(forwarded.requestedPage).toBe(4);
      expect(forwarded.topicId).toBe(input.topicId);
    });

    it("supports recursive ArticleSection dispatch", async () => {
      await resolveContentModuleAppResolve(createInput("articleSection"));

      const nestedContent = createContent("articleSection");
      await getSectionInput().resolveModule(nestedContent);

      expect(resolvers.articleSection).toHaveBeenCalledTimes(2);
      const nestedInput = resolvers.articleSection.mock.calls[1]?.[0] as
        | ArticleSectionInput
        | undefined;

      expect(nestedInput?.content).toBe(nestedContent);
      expect(nestedInput?.resolveModule).toEqual(expect.any(Function));
    });
  });

  it("passes the complete input to directly assigned resolvers", async () => {
    const input = createInput("hero", {
      topicId: "wildlife" as Input["topicId"],
    });

    await resolveContentModuleAppResolve(input);

    expect(resolvers.hero).toHaveBeenCalledWith({
      ...input,
      topicId: input.topicId,
    });
  });

  it("passes publication metadata to the article-footer resolver", async () => {
    const input = createInput("articleFooter");
    await resolveContentModuleAppResolve(input);

    expect(resolvers.articleFooter).toHaveBeenCalledTimes(1);
    expect(resolvers.articleFooter).toHaveBeenCalledWith({
      content: input.content,
      publication,
    });
  });

  it("rejects an article footer without publication metadata", async () => {
    const input = createInput("articleFooter", { publication: undefined });

    await expect(resolveContentModuleAppResolve(input)).rejects.toThrow(
      "Publication metadata is required for articleFooter",
    );
    expect(resolvers.articleFooter).not.toHaveBeenCalled();
  });

  it("returns the exact object from a synchronous resolver", async () => {
    const expected = { kind: "hero", marker: "resolved" };
    resolvers.hero.mockReturnValue(expected);

    const result = await resolveContentModuleAppResolve(createInput("hero"));
    expect(result).toBe(expected);
  });

  it("awaits asynchronous child resolvers", async () => {
    const expected = {
      kind: "photoPair",
      marker: "resolved asynchronously",
    };
    resolvers.photoPair.mockResolvedValue(expected);

    const result = await resolveContentModuleAppResolve(
      createInput("photoPair"),
    );
    expect(result).toBe(expected);
  });

  it("returns a Promise for synchronous modules", async () => {
    const operation = resolveContentModuleAppResolve(createInput("quote"));
    expect(operation).toBeInstanceOf(Promise);
    await expect(operation).resolves.toMatchObject({ kind: "quote" });
  });

  it("converts synchronous child errors into promise rejections", async () => {
    const error = new Error("Quote resolution failed");
    resolvers.quote.mockImplementation(() => {
      throw error;
    });

    await expect(
      resolveContentModuleAppResolve(createInput("quote")),
    ).rejects.toThrow(error);
  });

  it("propagates asynchronous child resolution failures", async () => {
    const error = new Error("Photo metadata unavailable");
    resolvers.featuredPhoto.mockRejectedValue(error);

    await expect(
      resolveContentModuleAppResolve(createInput("featuredPhoto")),
    ).rejects.toThrow(error);
  });

  it("preserves the original input references", async () => {
    const input = createInput("hero");
    const originalContent = input.content;
    await resolveContentModuleAppResolve(input);

    expect(input.content).toBe(originalContent);
    expect(input.contentRegistry).toBe(contentRegistry);
    expect(input.getPhoto).toBe(getPhoto);
    expect(input.journalLedger).toBe(journalLedger);
  });
});
