// src/rendering/body-content/block/homepage-note-listing/homepage-note-listing.block.renderer.test.ts

import type { AppRenderContextHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-render-context.homepage-note-listing.block.types";

import { renderHomepageNoteListingBlock } from "@rendering/body-content/block/homepage-note-listing/homepage-note-listing.block.renderer";
import { renderHeading } from "@rendering/shared/heading.shared.renderer";

jest.mock("@rendering/shared/heading.shared.renderer", () => ({
  renderHeading: jest.fn(),
}));

type HomepageNoteListingItem =
  AppRenderContextHomepageNoteListingBlock["notes"][number];

const createNote = (
  overrides: Partial<HomepageNoteListingItem> = {},
): HomepageNoteListingItem => ({
  id: "note:building-this-website-was-worth-it",
  href: "/notes/building-this-website-was-worth-it",
  title: "Building this website was worth it",
  intro: "A note about building the site.",
  eyebrow: "Note",
  publishedAt: "2026-05-10T22:14:49+01:00",
  publishedLabel: "10 May 2026",
  topic: "Architecture",
  ...overrides,
});

const createModule = (
  overrides: Partial<AppRenderContextHomepageNoteListingBlock> = {},
): AppRenderContextHomepageNoteListingBlock =>
  ({
    kind: "homepageNoteListing",
    heading: {
      level: 2,
      text: "Latest notes",
    },
    notes: [
      createNote(),
      createNote({
        id: "note:quiet-note",
        href: "/notes/quiet-note",
        title: "Quiet Note",
        intro: null,
        publishedAt: "2026-05-09T22:14:49+01:00",
        publishedLabel: "9 May 2026",
        topic: "TypeScript",
      }),
    ],
    ...overrides,
  }) as AppRenderContextHomepageNoteListingBlock;

describe("renderHomepageNoteListingBlock", () => {
  const mockedRenderHeading = jest.mocked(renderHeading);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderHeading.mockReturnValue(
      `<h2 class="m-homepage-note-listing__heading">Latest notes</h2>`,
    );
  });

  it("renders homepage note listing block", () => {
    expect(renderHomepageNoteListingBlock(createModule())).toBe(
      `<section class="m-homepage-note-listing l-content"><h2 class="m-homepage-note-listing__heading">Latest notes</h2><article class="m-homepage-note-listing__featured"><div class="m-homepage-note-listing__featured-content"><p class="m-homepage-note-listing__meta"><span>Architecture</span><span aria-hidden="true">·</span><time datetime="2026-05-10T22:14:49+01:00">10 May 2026</time></p><h3 class="m-homepage-note-listing__featured-title"><a class="m-homepage-note-listing__featured-link" href="/notes/building-this-website-was-worth-it">Building this website was worth it</a></h3><p class="m-homepage-note-listing__featured-intro">A note about building the site.</p><a class="m-homepage-note-listing__action" href="/notes/building-this-website-was-worth-it">Read note</a></div></article><div class="m-homepage-note-listing__list"><article class="m-homepage-note-listing__item"><p class="m-homepage-note-listing__meta"><span>TypeScript</span><span aria-hidden="true">·</span><time datetime="2026-05-09T22:14:49+01:00">9 May 2026</time></p><h3 class="m-homepage-note-listing__title"><a class="m-homepage-note-listing__link" href="/notes/quiet-note">Quiet Note</a></h3><a class="m-homepage-note-listing__item-action" href="/notes/quiet-note">Read note</a></article></div></section>`,
    );

    expect(mockedRenderHeading).toHaveBeenCalledWith(createModule().heading, {
      className: "m-homepage-note-listing__heading",
    });
  });

  it("returns empty string when there is no featured note", () => {
    expect(
      renderHomepageNoteListingBlock(
        createModule({
          notes: [],
        }),
      ),
    ).toBe("");
  });

  it("omits featured intro when not present", () => {
    const result = renderHomepageNoteListingBlock(
      createModule({
        notes: [
          {
            ...createModule().notes[0],
            intro: null,
          },
        ],
      }),
    );

    expect(result).not.toContain("m-homepage-note-listing__featured-intro");
  });

  it("omits featured topic when not present", () => {
    const result = renderHomepageNoteListingBlock(
      createModule({
        notes: [
          {
            ...createModule().notes[0],
            topic: null,
          },
        ],
      }),
    );

    expect(result).not.toContain(`<span>Architecture</span>`);
  });

  it("escapes rendered values", () => {
    const result = renderHomepageNoteListingBlock(
      createModule({
        notes: [
          createNote({
            href: `/notes/"bad"`,
            title: `Bad <title>`,
            intro: `Intro <script>alert("x")</script>`,
            publishedLabel: `10 <May>`,
            topic: `Type <Script>`,
          }),
        ],
      }),
    );

    expect(result).toContain(`href="/notes/&quot;bad&quot;"`);
    expect(result).toContain(`Bad &lt;title&gt;`);
    expect(result).toContain(
      `Intro &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;`,
    );
    expect(result).toContain(`10 &lt;May&gt;`);
    expect(result).toContain(`Type &lt;Script&gt;`);
  });

  it("omits featured published label when not present", () => {
    const result = renderHomepageNoteListingBlock(
      createModule({
        notes: [
          createNote({
            publishedLabel: null,
          }),
        ],
      }),
    );

    expect(result).not.toContain(`<time`);
    expect(result).not.toContain(`10 May 2026`);
  });

  it("omits standard item published label when not present", () => {
    const result = renderHomepageNoteListingBlock(
      createModule({
        notes: [
          createNote(),
          createNote({
            id: "note:quiet-note",
            href: "/notes/quiet-note",
            title: "Quiet Note",
            intro: null,
            publishedAt: null,
            publishedLabel: null,
            topic: "TypeScript",
          }),
        ],
      }),
    );

    expect(result).not.toContain(`datetime="2026-05-09T22:14:49+01:00"`);
    expect(result).not.toContain(`9 May 2026`);
  });

  it("omits standard item topic when not present", () => {
    const result = renderHomepageNoteListingBlock(
      createModule({
        notes: [
          createNote(),
          createNote({
            id: "note:quiet-note",
            href: "/notes/quiet-note",
            title: "Quiet Note",
            intro: null,
            topic: null,
          }),
        ],
      }),
    );

    expect(result).not.toContain(`<span>TypeScript</span>`);
  });

  it("omits meta when topic and published label are missing", () => {
    const result = renderHomepageNoteListingBlock(
      createModule({
        notes: [
          createNote({
            topic: null,
            publishedAt: null,
            publishedLabel: null,
          }),
        ],
      }),
    );

    expect(result).not.toContain("m-homepage-note-listing__meta");
  });

  it("renders standard item intro when present", () => {
    const result = renderHomepageNoteListingBlock(
      createModule({
        notes: [
          createNote(),
          createNote({
            id: "note:quiet-note",
            href: "/notes/quiet-note",
            title: "Quiet Note",
            intro: "A short standard note intro.",
            topic: null,
            publishedAt: null,
            publishedLabel: null,
          }),
        ],
      }),
    );

    expect(result).toContain(
      `<p class="m-homepage-note-listing__intro">A short standard note intro.</p>`,
    );
  });
});
