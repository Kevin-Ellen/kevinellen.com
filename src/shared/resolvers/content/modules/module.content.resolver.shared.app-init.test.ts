// src/shared/resolvers/content/modules/module.content.resolver.shared.app-init.test.ts

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
import { resolveJournalListingModuleAppInit } from "./journal-listing/journal-listing.module.content.resolver.shared.app-init";
import { resolveTopicListingModuleAppInit } from "./topic-listing/topic-listing.module.content.resolver.shared.app-init";
import { resolveTopicExplorerModuleAppInit } from "./topic-explorer/topic-explorer.module.content.resolver.shared.app-init";

import { resolveModuleContentAppInit } from "./module.content.resolver.shared.app-init";

jest.mock(
  "./article-section/article-section.module.content.resolver.shared.app-init",
  () => ({
    resolveArticleSectionModuleContentAppInit: jest.fn(),
  }),
);

jest.mock("./hero/hero.module.content.resolver.shared.app-init", () => ({
  resolveHeroModuleContentSharedAppInit: jest.fn(),
}));

jest.mock(
  "./page-intro/page-intro.module.content.resolver.shared.app-init",
  () => ({
    resolvePageIntroModuleContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "./featured-photo/featured-photo.module.content.resolver.shared.app-init",
  () => ({
    resolveFeaturedPhotoModuleContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "./metadata-bar/metadata-bar.module.content.resolver.shared.app-init",
  () => ({
    resolveMetadataBarModuleContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "./rich-content/rich-content.module.content.resolver.shared.app-init",
  () => ({
    resolveRichContentModuleContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "./photo-pair/photo-pair.module.content.resolver.shared.app-init",
  () => ({
    resolvePhotoPairModuleContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "./article-footer/article-footer.module.content.resolver.shared.app-init",
  () => ({
    resolveArticleFooterModuleContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "./final-words/final-words.module.content.resolver.shared.app-init",
  () => ({
    resolveFinalWordsModuleContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "./editorial-intro/editorial-intro.module.content.resolver.shared.app-init",
  () => ({
    resolveEditorialIntroModuleContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "./editorial-split/editorial-split.module.content.resolver.shared.app-init",
  () => ({
    resolveEditorialSplitModuleContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "./editorial-feature/editorial-feature.module.content.resolver.shared.app-init",
  () => ({
    resolveEditorialFeatureModuleContentAppInit: jest.fn(),
  }),
);

jest.mock("./banner/banner.module.content.resolver.shared.app-init", () => ({
  resolveBannerModuleContentAppInit: jest.fn(),
}));

jest.mock("./quote/quote.module.content.resolver.shared.app-init", () => ({
  resolveQuoteModuleAppInit: jest.fn(),
}));

jest.mock(
  "./photo-sequence/photo-sequence.module.content.resolver.shared.app-init",
  () => ({
    resolvePhotoSequenceModuleAppInit: jest.fn(),
  }),
);

jest.mock(
  "./journal-listing/journal-listing.module.content.resolver.shared.app-init",
  () => ({
    resolveJournalListingModuleAppInit: jest.fn(),
  }),
);

jest.mock(
  "./topic-listing/topic-listing.module.content.resolver.shared.app-init",
  () => ({
    resolveTopicListingModuleAppInit: jest.fn(),
  }),
);

jest.mock(
  "./topic-explorer/topic-explorer.module.content.resolver.shared.app-init",
  () => ({
    resolveTopicExplorerModuleAppInit: jest.fn(),
  }),
);

type Input = Parameters<typeof resolveModuleContentAppInit>[0];
type Kind = Input["authored"]["kind"];

type ResolverCase = Readonly<{
  kind: Kind;
  resolver: jest.Mock;
}>;

const cases: readonly ResolverCase[] = [
  {
    kind: "articleSection",
    resolver: resolveArticleSectionModuleContentAppInit as jest.Mock,
  },
  {
    kind: "hero",
    resolver: resolveHeroModuleContentSharedAppInit as jest.Mock,
  },
  {
    kind: "pageIntro",
    resolver: resolvePageIntroModuleContentAppInit as jest.Mock,
  },
  {
    kind: "featuredPhoto",
    resolver: resolveFeaturedPhotoModuleContentAppInit as jest.Mock,
  },
  {
    kind: "metadataBar",
    resolver: resolveMetadataBarModuleContentAppInit as jest.Mock,
  },
  {
    kind: "richContent",
    resolver: resolveRichContentModuleContentAppInit as jest.Mock,
  },
  {
    kind: "photoPair",
    resolver: resolvePhotoPairModuleContentAppInit as jest.Mock,
  },
  {
    kind: "articleFooter",
    resolver: resolveArticleFooterModuleContentAppInit as jest.Mock,
  },
  {
    kind: "finalWords",
    resolver: resolveFinalWordsModuleContentAppInit as jest.Mock,
  },
  {
    kind: "editorialIntro",
    resolver: resolveEditorialIntroModuleContentAppInit as jest.Mock,
  },
  {
    kind: "editorialSplit",
    resolver: resolveEditorialSplitModuleContentAppInit as jest.Mock,
  },
  {
    kind: "editorialFeature",
    resolver: resolveEditorialFeatureModuleContentAppInit as jest.Mock,
  },
  {
    kind: "banner",
    resolver: resolveBannerModuleContentAppInit as jest.Mock,
  },
  {
    kind: "quote",
    resolver: resolveQuoteModuleAppInit as jest.Mock,
  },
  {
    kind: "photoSequence",
    resolver: resolvePhotoSequenceModuleAppInit as jest.Mock,
  },
  {
    kind: "journalListing",
    resolver: resolveJournalListingModuleAppInit as jest.Mock,
  },
  {
    kind: "topicListing",
    resolver: resolveTopicListingModuleAppInit as jest.Mock,
  },
  {
    kind: "topicExplorer",
    resolver: resolveTopicExplorerModuleAppInit as jest.Mock,
  },
];

describe("Module content AppInit dispatcher", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];
  const dates = {} as Input["dates"];
  const topics = {} as Input["topics"];

  const createInput = (kind: Kind): Input => ({
    authored: { kind } as Input["authored"],
    svgAssets,
    socialProfiles,
    dates,
    topics,
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Module dispatch", () => {
    it.each(cases)(
      "dispatches $kind to its registered resolver",
      ({ kind, resolver }) => {
        const input = createInput(kind);
        const resolved = { kind, resolved: true };

        resolver.mockReturnValue(resolved);

        const result = resolveModuleContentAppInit(input);

        expect(result).toBe(resolved);
        expect(resolver).toHaveBeenCalledTimes(1);
        expect(resolver).toHaveBeenCalledWith(
          kind === "articleSection"
            ? {
                ...input,
                resolveModule: expect.any(Function),
              }
            : input,
        );
      },
    );

    it.each(cases)(
      "invokes only the selected resolver for $kind",
      ({ kind, resolver }) => {
        resolveModuleContentAppInit(createInput(kind));

        for (const entry of cases) {
          expect(entry.resolver).toHaveBeenCalledTimes(
            entry.resolver === resolver ? 1 : 0,
          );
        }
      },
    );

    it.each(cases)(
      "forwards shared dependencies for $kind",
      ({ kind, resolver }) => {
        const input = createInput(kind);

        resolveModuleContentAppInit(input);

        const forwarded = resolver.mock.calls[0]?.[0] as Input & {
          resolveModule?: (...args: never[]) => unknown;
        };

        if (kind === "articleSection") {
          expect(forwarded).not.toBe(input);
          expect(forwarded.resolveModule).toEqual(expect.any(Function));
        } else {
          expect(forwarded).toBe(input);
        }

        expect(forwarded.authored).toBe(input.authored);
        expect(forwarded.svgAssets).toBe(svgAssets);
        expect(forwarded.socialProfiles).toBe(socialProfiles);
        expect(forwarded.dates).toBe(dates);
        expect(forwarded.topics).toBe(topics);
      },
    );
  });

  describe("Failure propagation", () => {
    it.each(cases)("propagates errors from $kind", ({ kind, resolver }) => {
      const error = new Error(`${kind} resolution failed`);

      resolver.mockImplementation(() => {
        throw error;
      });

      expect(() => resolveModuleContentAppInit(createInput(kind))).toThrow(
        error,
      );

      expect(resolver).toHaveBeenCalledTimes(1);
    });
  });

  describe("Registry completeness", () => {
    it("contains no duplicate module kinds", () => {
      const kinds = cases.map(({ kind }) => kind);

      expect(new Set(kinds).size).toBe(kinds.length);
    });

    it("contains all currently registered module kinds", () => {
      expect(cases.map(({ kind }) => kind)).toEqual([
        "articleSection",
        "hero",
        "pageIntro",
        "featuredPhoto",
        "metadataBar",
        "richContent",
        "photoPair",
        "articleFooter",
        "finalWords",
        "editorialIntro",
        "editorialSplit",
        "editorialFeature",
        "banner",
        "quote",
        "photoSequence",
        "journalListing",
        "topicListing",
        "topicExplorer",
      ]);
    });
  });
});
