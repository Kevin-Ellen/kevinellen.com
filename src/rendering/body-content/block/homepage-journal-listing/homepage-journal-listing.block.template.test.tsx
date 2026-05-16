// src/rendering/body-content/block/homepage-journal-listing/homepage-journal-listing.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-render-context.homepage-journal-listing.block.types";

import { HomepageJournalListingBlockTemplate } from "@rendering/body-content/block/homepage-journal-listing/homepage-journal-listing.block.template";

const block = (
  overrides: Partial<AppRenderContextHomepageJournalListingBlock> = {},
): AppRenderContextHomepageJournalListingBlock =>
  ({
    kind: "homepageJournalListing",
    heading: {
      text: "Latest journal entries",
      level: 2,
      visuallyHidden: false,
    },
    entries: [
      {
        href: "/journal/kingfisher-session",
        title: "Kingfisher session",
        intro: "A quiet morning watching kingfishers.",
        publishedLabel: "16 May 2026",
        image: {
          src: "/media/photo/kingfisher/1200",
          srcset: [
            "/media/photo/kingfisher/800 800w",
            "/media/photo/kingfisher/1200 1200w",
          ],
          sizes: "(min-width: 900px) 50vw, 100vw",
          alt: "Kingfisher over water",
          width: 1200,
          height: 800,
        },
      },
      {
        href: "/journal/coot-chaos",
        title: "Coot chaos",
        intro: null,
        publishedLabel: "15 May 2026",
        image: null,
      },
    ],
    ...overrides,
  }) as AppRenderContextHomepageJournalListingBlock;

describe("HomepageJournalListingBlockTemplate", () => {
  it("renders homepage journal listing", () => {
    expect(
      renderToStaticMarkup(
        <HomepageJournalListingBlockTemplate block={block()} />,
      ),
    ).toBe(
      '<section class="m-homepage-journal-listing l-content"><h2 class="m-homepage-journal-listing__heading">Latest journal entries</h2><article class="m-homepage-journal-listing__featured"><a class="m-homepage-journal-listing__media-link" href="/journal/kingfisher-session"><img class="m-homepage-journal-listing__image" src="/media/photo/kingfisher/1200" srcSet="/media/photo/kingfisher/800 800w, /media/photo/kingfisher/1200 1200w" sizes="(min-width: 900px) 50vw, 100vw" alt="Kingfisher over water" width="1200" height="800" loading="lazy" decoding="async"/></a><div class="m-homepage-journal-listing__featured-content"><p class="m-homepage-journal-listing__date">16 May 2026</p><h3 class="m-homepage-journal-listing__featured-title"><a class="m-homepage-journal-listing__featured-link" href="/journal/kingfisher-session">Kingfisher session</a></h3><p class="m-homepage-journal-listing__featured-intro">A quiet morning watching kingfishers.</p><a class="m-homepage-journal-listing__action" href="/journal/kingfisher-session">Read entry</a></div></article><div class="m-homepage-journal-listing__list"><article class="m-homepage-journal-listing__item"><p class="m-homepage-journal-listing__item-date">15 May 2026</p><h3 class="m-homepage-journal-listing__title"><a class="m-homepage-journal-listing__link" href="/journal/coot-chaos">Coot chaos</a></h3><a class="m-homepage-journal-listing__item-action" href="/journal/coot-chaos">Read entry</a></article></div></section>',
    );
  });

  it("renders nothing when there are no entries", () => {
    expect(
      renderToStaticMarkup(
        <HomepageJournalListingBlockTemplate
          block={block({
            entries: [],
          })}
        />,
      ),
    ).toBe("");
  });

  it("omits optional featured fields", () => {
    const html = renderToStaticMarkup(
      <HomepageJournalListingBlockTemplate
        block={block({
          entries: [
            {
              ...block().entries[0],
              intro: null,
              publishedLabel: null,
              image: null,
            },
          ],
        })}
      />,
    );

    expect(html).not.toContain("m-homepage-journal-listing__date");
    expect(html).not.toContain("m-homepage-journal-listing__featured-intro");
    expect(html).not.toContain("m-homepage-journal-listing__image");
  });

  it("omits non-featured entry date when published label is missing", () => {
    const html = renderToStaticMarkup(
      <HomepageJournalListingBlockTemplate
        block={block({
          entries: [
            block().entries[0],
            {
              ...block().entries[1],
              publishedLabel: null,
            },
          ],
        })}
      />,
    );

    expect(html).not.toContain("m-homepage-journal-listing__item-date");
  });
});
