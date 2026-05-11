// src/rendering/body-content/block/journal-listing/journal-listing.block.renderer.test.ts

import type {
  AppRenderContextJournalListingBlock,
  AppRenderContextJournalListingItem,
} from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.types";

import { renderJournalListingBlock } from "@rendering/body-content/block/journal-listing/journal-listing.block.renderer";
import { renderPagination } from "@rendering/shared/pagination.shared.renderer";

jest.mock("@rendering/shared/pagination.shared.renderer", () => ({
  renderPagination: jest.fn(),
}));

const createImage = (
  overrides: Partial<
    NonNullable<AppRenderContextJournalListingItem["image"]>
  > = {},
): NonNullable<AppRenderContextJournalListingItem["image"]> =>
  ({
    id: "coot-in-soft-light",
    title: "Coot in soft light",
    alt: "A coot swimming through soft light.",
    commentary: null,
    width: 1600,
    height: 1000,
    src: "/media/photo/coot-in-soft-light",
    srcset: [
      "/media/photo/coot-in-soft-light/640/400 640w",
      "/media/photo/coot-in-soft-light/960/600 960w",
    ],
    sizes: "(min-width: 1200px) 1200px, 100vw",
    attribution: "Kevin Ellen",
    ratio: {
      width: 8,
      height: 5,
    },
    meta: [],
    ...overrides,
  }) as NonNullable<AppRenderContextJournalListingItem["image"]>;

const createItem = (
  overrides: Partial<AppRenderContextJournalListingItem> = {},
): AppRenderContextJournalListingItem =>
  ({
    id: "coot-in-soft-light",
    href: "/journal/coot-in-soft-light",
    title: "Coot in soft light",
    intro: "A calm evening encounter in soft light.",
    eyebrow: null,
    publishedAt: "2026-05-09T08:00:00.000Z",
    publishedLabel: "9 May 2026",
    image: createImage(),
    ...overrides,
  }) as AppRenderContextJournalListingItem;

const createModule = (
  overrides: Partial<AppRenderContextJournalListingBlock> = {},
): AppRenderContextJournalListingBlock =>
  ({
    kind: "journalListing",
    items: [
      createItem(),
      createItem({
        id: "misty-morning",
        href: "/journal/misty-morning",
        title: "Misty morning",
        intro: null,
        publishedAt: "2026-05-08T08:00:00.000Z",
        publishedLabel: "8 May 2026",
        image: null,
      }),
    ],
    pagination: {
      currentPage: 1,
      totalPages: 2,
      label: "Page 1 of 2",
      previous: null,
      next: {
        href: "/journal/page-2",
        label: "Older entries →",
      },
    },
    ...overrides,
  }) as AppRenderContextJournalListingBlock;

describe("renderJournalListingBlock", () => {
  const mockedRenderPagination = jest.mocked(renderPagination);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderPagination.mockReturnValue(
      `<nav class="m-pagination" aria-label="Journal pagination"></nav>`,
    );
  });

  it("renders journal listing block", () => {
    expect(renderJournalListingBlock(createModule())).toBe(
      `<section class="m-contentBlock m-journal-listing" aria-label="Journal listing"><ul class="m-journal-listing__list"><li class="m-journal-listing__item m-journal-listing__item--featured l-content"><a class="m-journal-listing__link" href="/journal/coot-in-soft-light"><div class="m-journal-listing__media"><img src="/media/photo/coot-in-soft-light" srcset="/media/photo/coot-in-soft-light/640/400 640w, /media/photo/coot-in-soft-light/960/600 960w" sizes="(min-width: 1200px) 1200px, 100vw" alt="A coot swimming through soft light." width="1600" height="1000" loading="lazy"></div><div class="m-journal-listing__content m-heading"><time class="m-heading__eyebrow" datetime="2026-05-09T08:00:00.000Z">9 May 2026</time><h3 class="m-heading__title">Coot in soft light</h3><p class="m-heading__intro">A calm evening encounter in soft light.</p></div></a></li><li class="m-journal-listing__item l-content"><a class="m-journal-listing__link" href="/journal/misty-morning"><div class="m-journal-listing__content m-heading"><time class="m-heading__eyebrow" datetime="2026-05-08T08:00:00.000Z">8 May 2026</time><h3 class="m-heading__title">Misty morning</h3></div></a></li></ul><div class="m-contentBlock--content"><nav class="m-pagination" aria-label="Journal pagination"></nav></div></section>`,
    );

    expect(mockedRenderPagination).toHaveBeenCalledWith(
      createModule().pagination,
      "Journal pagination",
    );
  });

  it("does not feature the first item after page one", () => {
    const result = renderJournalListingBlock(
      createModule({
        pagination: {
          ...createModule().pagination,
          currentPage: 2,
        },
      }),
    );

    expect(result).not.toContain("m-journal-listing__item--featured");
    expect(result).not.toContain("m-heading__intro");
  });

  it("omits published time when published label is missing", () => {
    const result = renderJournalListingBlock(
      createModule({
        items: [
          createItem({
            publishedAt: null,
            publishedLabel: null,
          }),
        ],
      }),
    );

    expect(result).not.toContain("<time");
  });

  it("renders empty listing items", () => {
    expect(
      renderJournalListingBlock(
        createModule({
          items: [],
        }),
      ),
    ).toBe(
      `<section class="m-contentBlock m-journal-listing" aria-label="Journal listing"><ul class="m-journal-listing__list"></ul><div class="m-contentBlock--content"><nav class="m-pagination" aria-label="Journal pagination"></nav></div></section>`,
    );
  });

  it("escapes rendered values", () => {
    const result = renderJournalListingBlock(
      createModule({
        items: [
          createItem({
            href: `/journal/"bad"`,
            title: `Bad <title>`,
            intro: `Intro <script>alert("x")</script>`,
            publishedAt: `2026-"bad"`,
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
    expect(result).toContain(`datetime="2026-&quot;bad&quot;"`);
    expect(result).toContain(`9 &lt;May&gt;`);
    expect(result).toContain(`src="/media/photo/&lt;bad&gt;"`);
    expect(result).toContain(`srcset="/media/photo/&lt;bad&gt;/640/400 640w"`);
    expect(result).toContain(`sizes="&quot;bad&quot;"`);
    expect(result).toContain(`alt="Alt &quot;text&quot; &lt;bad&gt;"`);
  });

  it("renders empty datetime when published label exists without published date", () => {
    const result = renderJournalListingBlock(
      createModule({
        items: [
          createItem({
            publishedAt: null,
            publishedLabel: "Undated",
          }),
        ],
      }),
    );

    expect(result).toContain(
      `<time class="m-heading__eyebrow" datetime="">Undated</time>`,
    );
  });
});
