// src/rendering/body-content/block/journal-listing/journal-listing.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.types";

import { JournalListingBlockTemplate } from "@rendering/body-content/block/journal-listing/journal-listing.block.template";

const block = (
  overrides: Partial<AppRenderContextJournalListingBlock> = {},
): AppRenderContextJournalListingBlock =>
  ({
    kind: "journalListing",

    items: [
      {
        href: "/journal/kingfisher-hide",
        title: "Kingfisher hide session",
        intro: "A cold early morning waiting for diving behaviour.",
        publishedAt: "2026-05-16",
        publishedLabel: "16 May 2026",

        image: {
          src: "/media/photo/kingfisher/1200",
          srcset: [
            "/media/photo/kingfisher/800 800w",
            "/media/photo/kingfisher/1200 1200w",
          ],
          sizes: "(min-width: 900px) 50vw, 100vw",
          alt: "Kingfisher perched above water",
          width: 1200,
          height: 800,
        },
      },

      {
        href: "/journal/coot-chaos",
        title: "Coot chaos",
        intro: "Absolute marsh nonsense.",
        publishedAt: "2026-05-15",
        publishedLabel: "15 May 2026",
        image: null,
      },
    ],

    pagination: {
      currentPage: 1,
      totalPages: 3,
      label: "Page 1 of 3",
      previousHref: null,
      previousLabel: "Previous",
      nextHref: "/journal/page/2",
      nextLabel: "Next",
    },

    ...overrides,
  }) as AppRenderContextJournalListingBlock;

describe("JournalListingBlockTemplate", () => {
  it("renders the journal listing block", () => {
    expect(
      renderToStaticMarkup(<JournalListingBlockTemplate block={block()} />),
    ).toBe(
      '<section class="m-contentBlock m-journal-listing" aria-label="Journal listing"><ul class="m-journal-listing__list"><li class="m-journal-listing__item m-journal-listing__item--featured l-content"><a class="m-journal-listing__link" href="/journal/kingfisher-hide"><div class="m-journal-listing__media"><img src="/media/photo/kingfisher/1200" srcSet="/media/photo/kingfisher/800 800w, /media/photo/kingfisher/1200 1200w" sizes="(min-width: 900px) 50vw, 100vw" alt="Kingfisher perched above water" width="1200" height="800" loading="lazy"/></div><div class="m-journal-listing__content m-heading"><time class="m-heading__eyebrow" dateTime="2026-05-16">16 May 2026</time><h3 class="m-heading__title">Kingfisher hide session</h3><p class="m-heading__intro">A cold early morning waiting for diving behaviour.</p></div></a></li><li class="m-journal-listing__item l-content"><a class="m-journal-listing__link" href="/journal/coot-chaos"><div class="m-journal-listing__content m-heading"><time class="m-heading__eyebrow" dateTime="2026-05-15">15 May 2026</time><h3 class="m-heading__title">Coot chaos</h3></div></a></li></ul><div class="m-contentBlock--content"><nav class="m-pagination" aria-label="Journal pagination"><div class="m-pagination__slot m-pagination__slot--previous"></div><div class="m-pagination__slot m-pagination__slot--label"><span class="m-pagination__label">Page 1 of 3</span></div><div class="m-pagination__slot m-pagination__slot--next"><a class="m-pagination__link m-pagination__link--next" href="/journal/page/2">Next</a></div></nav></div></section>',
    );
  });

  it("does not render featured intro on later pages", () => {
    const html = renderToStaticMarkup(
      <JournalListingBlockTemplate
        block={block({
          pagination: {
            ...block().pagination,
            currentPage: 2,
          },
        })}
      />,
    );

    expect(html).not.toContain("m-heading__intro");
    expect(html).not.toContain("m-journal-listing__item--featured");
  });

  it("omits image markup when an item has no image", () => {
    const html = renderToStaticMarkup(
      <JournalListingBlockTemplate
        block={block({
          items: [
            {
              ...block().items[0],
              image: null,
            },
          ],
        })}
      />,
    );

    expect(html).not.toContain("m-journal-listing__media");
  });

  it("renders without pagination navigation when only one page exists", () => {
    const html = renderToStaticMarkup(
      <JournalListingBlockTemplate
        block={block({
          pagination: {
            ...block().pagination,
            totalPages: 1,
          },
        })}
      />,
    );

    expect(html).not.toContain("m-pagination");
  });

  it("omits published date when published label is missing", () => {
    const html = renderToStaticMarkup(
      <JournalListingBlockTemplate
        block={block({
          items: [
            {
              ...block().items[0],
              publishedAt: null,
              publishedLabel: null,
            },
          ],
        })}
      />,
    );

    expect(html).not.toContain("m-heading__eyebrow");
    expect(html).not.toContain("<time");
  });

  it("renders published label with empty datetime when publishedAt is missing", () => {
    const html = renderToStaticMarkup(
      <JournalListingBlockTemplate
        block={block({
          items: [
            {
              ...block().items[0],
              publishedAt: null,
            },
          ],
        })}
      />,
    );

    expect(html).toContain(
      '<time class="m-heading__eyebrow" dateTime="">16 May 2026</time>',
    );
  });
});
