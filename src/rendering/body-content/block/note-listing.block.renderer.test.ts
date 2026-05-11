// src/rendering/body-content/block/note-listing.block.renderer.test.ts

import type {
  AppRenderContextNoteListingBlock,
  AppRenderContextNoteListingItem,
} from "@shared-types/page-content/block/note-listing/app-render-context.note-listing.block.types";

import { renderNoteListingBlock } from "@rendering/body-content/block/note-listing.block.renderer";
import { renderPagination } from "@rendering/shared/pagination.shared.renderer";

jest.mock("@rendering/shared/pagination.shared.renderer", () => ({
  renderPagination: jest.fn(),
}));

const createItem = (
  overrides: Partial<AppRenderContextNoteListingItem> = {},
): AppRenderContextNoteListingItem =>
  ({
    id: "note:building-this-website-was-worth-it",
    href: "/notes/building-this-website-was-worth-it",
    title: "Building this website was worth it",
    intro: "A note about building the site.",
    eyebrow: "Note",
    publishedAt: "2026-05-10T22:14:49+01:00",
    publishedLabel: "10 May 2026",
    topic: "Architecture",
    ...overrides,
  }) as AppRenderContextNoteListingItem;

const createModule = (
  overrides: Partial<AppRenderContextNoteListingBlock> = {},
): AppRenderContextNoteListingBlock =>
  ({
    kind: "noteListing",
    flow: "content",
    items: [
      createItem(),
      createItem({
        id: "note:quiet-note",
        href: "/notes/quiet-note",
        title: "Quiet Note",
        intro: null,
        publishedAt: "2026-05-09T22:14:49+01:00",
        publishedLabel: "9 May 2026",
        topic: "TypeScript",
      }),
    ],
    pagination: {
      currentPage: 1,
      totalPages: 2,
      label: "Page 1 of 2",
      previous: null,
      next: {
        href: "/notes/page-2",
        label: "Older entries →",
      },
    },
    ...overrides,
  }) as AppRenderContextNoteListingBlock;

describe("renderNoteListingBlock", () => {
  const mockedRenderPagination = jest.mocked(renderPagination);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderPagination.mockReturnValue(
      `<nav class="m-pagination" aria-label="Notes pagination"></nav>`,
    );
  });

  it("renders note listing block", () => {
    expect(renderNoteListingBlock(createModule())).toBe(
      `<section class="m-contentBlock m-note-listing" aria-label="Notes listing"><ul class="m-note-listing__list"><li class="m-note-listing__item"><a class="m-note-listing__link" href="/notes/building-this-website-was-worth-it"><div class="m-note-listing__content m-heading"><p class="m-heading__eyebrow">Architecture</p><h3 class="m-heading__title">Building this website was worth it</h3><p class="m-heading__intro">A note about building the site.</p><time class="m-note-listing__date" datetime="2026-05-10T22:14:49+01:00">10 May 2026</time></div></a></li><li class="m-note-listing__item"><a class="m-note-listing__link" href="/notes/quiet-note"><div class="m-note-listing__content m-heading"><p class="m-heading__eyebrow">TypeScript</p><h3 class="m-heading__title">Quiet Note</h3><time class="m-note-listing__date" datetime="2026-05-09T22:14:49+01:00">9 May 2026</time></div></a></li></ul><nav class="m-pagination" aria-label="Notes pagination"></nav></section>`,
    );

    expect(mockedRenderPagination).toHaveBeenCalledWith(
      createModule().pagination,
      "Notes pagination",
    );
  });

  it("omits optional topic, intro, and published time", () => {
    const result = renderNoteListingBlock(
      createModule({
        items: [
          createItem({
            topic: null,
            intro: null,
            publishedAt: null,
            publishedLabel: null,
          }),
        ],
      }),
    );

    expect(result).not.toContain(`m-heading__eyebrow`);
    expect(result).not.toContain(`m-heading__intro`);
    expect(result).not.toContain(`<time`);
  });

  it("renders empty listing items", () => {
    expect(
      renderNoteListingBlock(
        createModule({
          items: [],
        }),
      ),
    ).toBe(
      `<section class="m-contentBlock m-note-listing" aria-label="Notes listing"><ul class="m-note-listing__list"></ul><nav class="m-pagination" aria-label="Notes pagination"></nav></section>`,
    );
  });

  it("escapes rendered values", () => {
    const result = renderNoteListingBlock(
      createModule({
        items: [
          createItem({
            href: `/notes/"bad"`,
            title: `Bad <title>`,
            intro: `Intro <script>alert("x")</script>`,
            topic: `Type <Script>`,
            publishedAt: `2026-"bad"`,
            publishedLabel: `10 <May>`,
          }),
        ],
      }),
    );

    expect(result).toContain(`href="/notes/&quot;bad&quot;"`);
    expect(result).toContain(`Bad &lt;title&gt;`);
    expect(result).toContain(
      `Intro &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;`,
    );
    expect(result).toContain(`Type &lt;Script&gt;`);
    expect(result).toContain(`datetime="2026-&quot;bad&quot;"`);
    expect(result).toContain(`10 &lt;May&gt;`);
  });

  it("renders empty datetime when published label exists without published date", () => {
    const result = renderNoteListingBlock(
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
      `<time class="m-note-listing__date" datetime="">Undated</time>`,
    );
  });
});
