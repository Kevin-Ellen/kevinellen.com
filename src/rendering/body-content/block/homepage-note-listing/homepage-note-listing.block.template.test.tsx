// src/rendering/body-content/block/homepage-note-listing/homepage-note-listing.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-render-context.homepage-note-listing.block.types";

import { HomepageNoteListingBlockTemplate } from "@rendering/body-content/block/homepage-note-listing/homepage-note-listing.block.template";

const block = (
  overrides: Partial<AppRenderContextHomepageNoteListingBlock> = {},
): AppRenderContextHomepageNoteListingBlock =>
  ({
    kind: "homepageNoteListing",
    heading: {
      text: "Latest notes",
      level: 2,
      visuallyHidden: false,
    },
    notes: [
      {
        href: "/notes/render-tsx",
        title: "Moving render templates to TSX",
        intro: "A cleaner render-layer implementation.",
        topic: "Rendering",
        publishedAt: "2026-05-16",
        publishedLabel: "16 May 2026",
      },
      {
        href: "/notes/kv-boundaries",
        title: "Keeping KV as a published layer",
        intro: null,
        topic: "Architecture",
        publishedAt: "2026-05-15",
        publishedLabel: "15 May 2026",
      },
    ],
    ...overrides,
  }) as AppRenderContextHomepageNoteListingBlock;

describe("HomepageNoteListingBlockTemplate", () => {
  it("renders homepage note listing", () => {
    expect(
      renderToStaticMarkup(
        <HomepageNoteListingBlockTemplate block={block()} />,
      ),
    ).toBe(
      '<section class="m-homepage-note-listing l-content"><h2 class="m-homepage-note-listing__heading">Latest notes</h2><article class="m-homepage-note-listing__featured"><div class="m-homepage-note-listing__featured-content"><p class="m-homepage-note-listing__meta"><span>Rendering</span><span aria-hidden="true">·</span><time dateTime="2026-05-16">16 May 2026</time></p><h3 class="m-homepage-note-listing__featured-title"><a class="m-homepage-note-listing__featured-link" href="/notes/render-tsx">Moving render templates to TSX</a></h3><p class="m-homepage-note-listing__featured-intro">A cleaner render-layer implementation.</p><a class="m-homepage-note-listing__action" href="/notes/render-tsx">Read note</a></div></article><div class="m-homepage-note-listing__list"><article class="m-homepage-note-listing__item"><p class="m-homepage-note-listing__meta"><span>Architecture</span><span aria-hidden="true">·</span><time dateTime="2026-05-15">15 May 2026</time></p><h3 class="m-homepage-note-listing__title"><a class="m-homepage-note-listing__link" href="/notes/kv-boundaries">Keeping KV as a published layer</a></h3><a class="m-homepage-note-listing__item-action" href="/notes/kv-boundaries">Read note</a></article></div></section>',
    );
  });

  it("renders nothing when there are no notes", () => {
    expect(
      renderToStaticMarkup(
        <HomepageNoteListingBlockTemplate block={block({ notes: [] })} />,
      ),
    ).toBe("");
  });

  it("omits optional featured fields", () => {
    const html = renderToStaticMarkup(
      <HomepageNoteListingBlockTemplate
        block={block({
          notes: [
            {
              ...block().notes[0],
              intro: null,
              topic: null,
              publishedAt: null,
              publishedLabel: null,
            },
          ],
        })}
      />,
    );

    expect(html).not.toContain("m-homepage-note-listing__meta");
    expect(html).not.toContain("m-homepage-note-listing__featured-intro");
  });

  it("renders meta with only a published date", () => {
    const html = renderToStaticMarkup(
      <HomepageNoteListingBlockTemplate
        block={block({
          notes: [
            {
              ...block().notes[0],
              topic: null,
            },
          ],
        })}
      />,
    );

    expect(html).toContain(
      '<p class="m-homepage-note-listing__meta"><time dateTime="2026-05-16">16 May 2026</time></p>',
    );
    expect(html).not.toContain('<span aria-hidden="true">·</span>');
  });

  it("renders non-featured note intro", () => {
    const html = renderToStaticMarkup(
      <HomepageNoteListingBlockTemplate
        block={block({
          notes: [
            block().notes[0],
            {
              ...block().notes[1],
              intro: "A second note intro.",
            },
          ],
        })}
      />,
    );

    expect(html).toContain(
      '<p class="m-homepage-note-listing__intro">A second note intro.</p>',
    );
  });

  it("renders meta with only a topic", () => {
    const html = renderToStaticMarkup(
      <HomepageNoteListingBlockTemplate
        block={block({
          notes: [
            {
              ...block().notes[0],
              publishedAt: null,
              publishedLabel: null,
            },
          ],
        })}
      />,
    );

    expect(html).toContain(
      '<p class="m-homepage-note-listing__meta"><span>Rendering</span></p>',
    );
    expect(html).not.toContain("<time");
    expect(html).not.toContain('<span aria-hidden="true">·</span>');
  });
});
