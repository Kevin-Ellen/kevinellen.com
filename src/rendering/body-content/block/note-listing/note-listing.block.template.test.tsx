// src/rendering/body-content/block/note-listing/note-listing.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextNoteListingBlock } from "@shared-types/page-content/block/note-listing/app-render-context.note-listing.block.types";

import { NoteListingBlockTemplate } from "@rendering/body-content/block/note-listing/note-listing.block.template";

const block = (
  overrides: Partial<AppRenderContextNoteListingBlock> = {},
): AppRenderContextNoteListingBlock =>
  ({
    kind: "noteListing",

    items: [
      {
        href: "/notes/render-architecture",
        title: "Render architecture",
        intro: "Separating ARC and Render responsibilities.",
        topic: "Architecture",
        publishedAt: "2026-05-16",
        publishedLabel: "16 May 2026",
      },

      {
        href: "/notes/tsx-migration",
        title: "TSX migration",
        intro: "Removing brittle string rendering.",
        topic: "Rendering",
        publishedAt: "2026-05-15",
        publishedLabel: "15 May 2026",
      },
    ],

    pagination: {
      currentPage: 1,
      totalPages: 2,
      label: "Page 1 of 2",
      previousHref: null,
      previousLabel: "Previous",
      nextHref: "/notes/page/2",
      nextLabel: "Next",
    },

    ...overrides,
  }) as AppRenderContextNoteListingBlock;

describe("NoteListingBlockTemplate", () => {
  it("renders the note listing block", () => {
    expect(
      renderToStaticMarkup(<NoteListingBlockTemplate block={block()} />),
    ).toBe(
      '<section class="m-contentBlock m-note-listing" aria-label="Notes listing"><ul class="m-note-listing__list"><li class="m-note-listing__item m-note-listing__item--featured l-content"><a class="m-note-listing__link" href="/notes/render-architecture"><div class="m-note-listing__content m-heading"><p class="m-heading__eyebrow m-note-listing__meta"><span>Architecture</span><span aria-hidden="true">·</span><time dateTime="2026-05-16">16 May 2026</time></p><h3 class="m-heading__title">Render architecture</h3><p class="m-heading__intro">Separating ARC and Render responsibilities.</p></div></a></li><li class="m-note-listing__item l-content"><a class="m-note-listing__link" href="/notes/tsx-migration"><div class="m-note-listing__content m-heading"><p class="m-heading__eyebrow m-note-listing__meta"><span>Rendering</span><span aria-hidden="true">·</span><time dateTime="2026-05-15">15 May 2026</time></p><h3 class="m-heading__title">TSX migration</h3><p class="m-heading__intro">Removing brittle string rendering.</p></div></a></li></ul><nav class="m-pagination" aria-label="Notes pagination"><div class="m-pagination__slot m-pagination__slot--previous"></div><div class="m-pagination__slot m-pagination__slot--label"><span class="m-pagination__label">Page 1 of 2</span></div><div class="m-pagination__slot m-pagination__slot--next"><a class="m-pagination__link m-pagination__link--next" href="/notes/page/2">Next</a></div></nav></section>',
    );
  });

  it("does not render featured styling on later pages", () => {
    const html = renderToStaticMarkup(
      <NoteListingBlockTemplate
        block={block({
          pagination: {
            ...block().pagination,
            currentPage: 2,
          },
        })}
      />,
    );

    expect(html).not.toContain("m-note-listing__item--featured");
  });

  it("omits meta when topic and published label are missing", () => {
    const html = renderToStaticMarkup(
      <NoteListingBlockTemplate
        block={block({
          items: [
            {
              ...block().items[0],
              topic: null,
              publishedAt: null,
              publishedLabel: null,
            },
          ],
        })}
      />,
    );

    expect(html).not.toContain("m-note-listing__meta");
  });

  it("does not render pagination when only one page exists", () => {
    const html = renderToStaticMarkup(
      <NoteListingBlockTemplate
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

  it("renders meta with only a published label", () => {
    const html = renderToStaticMarkup(
      <NoteListingBlockTemplate
        block={block({
          items: [
            {
              ...block().items[0],
              topic: null,
            },
          ],
        })}
      />,
    );

    expect(html).toContain(
      '<p class="m-heading__eyebrow m-note-listing__meta"><time dateTime="2026-05-16">16 May 2026</time></p>',
    );
    expect(html).not.toContain('<span aria-hidden="true">·</span>');
  });

  it("renders published label with empty datetime when publishedAt is missing", () => {
    const html = renderToStaticMarkup(
      <NoteListingBlockTemplate
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

    expect(html).toContain('<time dateTime="">16 May 2026</time>');
  });

  it("omits intro when intro is missing", () => {
    const html = renderToStaticMarkup(
      <NoteListingBlockTemplate
        block={block({
          items: [
            {
              ...block().items[0],
              intro: null,
            },
          ],
        })}
      />,
    );

    expect(html).not.toContain("m-heading__intro");
  });

  it("renders meta with only a topic", () => {
    const html = renderToStaticMarkup(
      <NoteListingBlockTemplate
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

    expect(html).toContain(
      '<p class="m-heading__eyebrow m-note-listing__meta"><span>Architecture</span></p>',
    );
    expect(html).not.toContain("<time");
    expect(html).not.toContain('<span aria-hidden="true">·</span>');
  });
});
