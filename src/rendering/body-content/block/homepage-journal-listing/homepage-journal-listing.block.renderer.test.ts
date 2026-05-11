// src/rendering/body-content/block/homepage-journal-listing/homepage-journal-listing.block.renderer.test.ts

import type { AppRenderContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-render-context.homepage-journal-listing.block.types";

import { renderHomepageJournalListingBlock } from "@rendering/body-content/block/homepage-journal-listing/homepage-journal-listing.block.renderer";
import { renderHeading } from "@rendering/shared/heading.shared.renderer";

jest.mock("@rendering/shared/heading.shared.renderer", () => ({
  renderHeading: jest.fn(),
}));

type HomepageJournalListingEntry =
  AppRenderContextHomepageJournalListingBlock["entries"][number];

const createImage = (
  overrides: Partial<NonNullable<HomepageJournalListingEntry["image"]>> = {},
): NonNullable<HomepageJournalListingEntry["image"]> => ({
  src: "/media/photo/coot-in-soft-light",
  srcset: [
    "/media/photo/coot-in-soft-light/640/400 640w",
    "/media/photo/coot-in-soft-light/960/600 960w",
  ],
  sizes: "(min-width: 1200px) 1200px, 100vw",
  alt: "A coot swimming through soft light.",
  width: 1600,
  height: 1000,
  ratio: {
    width: 8,
    height: 5,
  },
  ...overrides,
});

const createEntry = (
  overrides: Partial<HomepageJournalListingEntry> = {},
): HomepageJournalListingEntry => ({
  id: "coot-in-soft-light",
  href: "/journal/coot-in-soft-light",
  title: "Coot in soft light",
  intro: "A calm evening encounter in soft light.",
  eyebrow: null,
  publishedAt: "2026-05-09T08:00:00.000Z",
  publishedLabel: "9 May 2026",
  image: createImage(),
  ...overrides,
});

const createModule = (
  overrides: Partial<AppRenderContextHomepageJournalListingBlock> = {},
): AppRenderContextHomepageJournalListingBlock =>
  ({
    kind: "homepageJournalListing",
    heading: {
      level: 2,
      text: "Latest field notes",
    },
    entries: [
      createEntry(),
      createEntry({
        id: "misty-morning",
        href: "/journal/misty-morning",
        title: "Misty morning",
        intro: null,
        publishedAt: "2026-05-08T08:00:00.000Z",
        publishedLabel: "8 May 2026",
        image: null,
      }),
    ],
    ...overrides,
  }) as AppRenderContextHomepageJournalListingBlock;

describe("renderHomepageJournalListingBlock", () => {
  const mockedRenderHeading = jest.mocked(renderHeading);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderHeading.mockReturnValue(
      `<h2 class="m-homepage-journal-listing__heading">Latest field notes</h2>`,
    );
  });

  it("renders homepage journal listing block", () => {
    expect(renderHomepageJournalListingBlock(createModule())).toBe(
      `<section class="m-homepage-journal-listing l-content"><h2 class="m-homepage-journal-listing__heading">Latest field notes</h2><article class="m-homepage-journal-listing__featured"><a class="m-homepage-journal-listing__media-link" href="/journal/coot-in-soft-light"><img class="m-homepage-journal-listing__image" src="/media/photo/coot-in-soft-light" srcset="/media/photo/coot-in-soft-light/640/400 640w, /media/photo/coot-in-soft-light/960/600 960w" sizes="(min-width: 1200px) 1200px, 100vw" alt="A coot swimming through soft light." width="1600" height="1000" loading="lazy" decoding="async"></a><div class="m-homepage-journal-listing__featured-content"><p class="m-homepage-journal-listing__date">9 May 2026</p><h3 class="m-homepage-journal-listing__featured-title"><a class="m-homepage-journal-listing__featured-link" href="/journal/coot-in-soft-light">Coot in soft light</a></h3><p class="m-homepage-journal-listing__featured-intro">A calm evening encounter in soft light.</p><a class="m-homepage-journal-listing__action" href="/journal/coot-in-soft-light">Read entry</a></div></article><div class="m-homepage-journal-listing__list"><article class="m-homepage-journal-listing__item"><p class="m-homepage-journal-listing__item-date">8 May 2026</p><h3 class="m-homepage-journal-listing__title"><a class="m-homepage-journal-listing__link" href="/journal/misty-morning">Misty morning</a></h3><a class="m-homepage-journal-listing__item-action" href="/journal/misty-morning">Read entry</a></article></div></section>`,
    );

    expect(mockedRenderHeading).toHaveBeenCalledWith(createModule().heading, {
      className: "m-homepage-journal-listing__heading",
    });
  });

  it("returns empty string when there is no featured entry", () => {
    expect(
      renderHomepageJournalListingBlock(
        createModule({
          entries: [],
        }),
      ),
    ).toBe("");
  });

  it("omits featured intro when not present", () => {
    const result = renderHomepageJournalListingBlock(
      createModule({
        entries: [
          {
            ...createModule().entries[0],
            intro: null,
          },
        ],
      }),
    );

    expect(result).not.toContain("m-homepage-journal-listing__featured-intro");
  });

  it("renders featured entry without image", () => {
    const result = renderHomepageJournalListingBlock(
      createModule({
        entries: [
          {
            ...createModule().entries[0],
            image: null,
          },
        ],
      }),
    );

    expect(result).not.toContain("m-homepage-journal-listing__image");
  });

  it("escapes rendered values", () => {
    const result = renderHomepageJournalListingBlock(
      createModule({
        entries: [
          createEntry({
            href: `/journal/"bad"`,
            title: `Bad <title>`,
            intro: `Intro <script>alert("x")</script>`,
            publishedLabel: `9 <May>`,
            image: createImage({
              src: `/media/photo/<bad>`,
              srcset: [`/media/photo/<bad>/640/400 640w`],
              sizes: `"bad"`,
              alt: `Alt "text" <bad>`,
            }),
          }),
        ],
      }),
    );

    expect(result).toContain(`href="/journal/&quot;bad&quot;"`);

    expect(result).toContain(`Bad &lt;title&gt;`);

    expect(result).toContain(
      `Intro &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;`,
    );

    expect(result).toContain(`9 &lt;May&gt;`);

    expect(result).toContain(`src="/media/photo/&lt;bad&gt;"`);

    expect(result).toContain(`srcset="/media/photo/&lt;bad&gt;/640/400 640w"`);

    expect(result).toContain(`sizes="&quot;bad&quot;"`);

    expect(result).toContain(`alt="Alt &quot;text&quot; &lt;bad&gt;"`);
  });

  it("omits featured published label when not present", () => {
    const result = renderHomepageJournalListingBlock(
      createModule({
        entries: [
          createEntry({
            publishedLabel: null,
          }),
        ],
      }),
    );

    expect(result).not.toContain("m-homepage-journal-listing__date");
  });

  it("omits standard item published label when not present", () => {
    const result = renderHomepageJournalListingBlock(
      createModule({
        entries: [
          createEntry(),
          createEntry({
            id: "misty-morning",
            href: "/journal/misty-morning",
            title: "Misty morning",
            intro: null,
            publishedAt: null,
            publishedLabel: null,
            image: null,
          }),
        ],
      }),
    );

    expect(result).not.toContain("m-homepage-journal-listing__item-date");
  });
});
