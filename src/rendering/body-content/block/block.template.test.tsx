// src/rendering/body-content/block/block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { BlockTemplate } from "@rendering/body-content/block/block.template";

const renderBlock = (block: unknown): string =>
  renderToStaticMarkup(
    <BlockTemplate block={block as AppRenderContextBlock} />,
  );

describe("BlockTemplate", () => {
  it("renders a paragraph block", () => {
    expect(
      renderBlock({
        kind: "paragraph",
        flow: "content",
        content: [{ kind: "text", value: "Hello world" }],
      }),
    ).toContain("Hello world");
  });

  it("renders a list block", () => {
    expect(
      renderBlock({
        kind: "list",
        flow: "content",
        style: "unordered",
        items: [{ content: [{ kind: "text", value: "Birds" }] }],
      }),
    ).toContain("<ul");
  });

  it("renders a quote block", () => {
    expect(
      renderBlock({
        kind: "quote",
        id: "quote-1",
        flow: "content",
        text: "Nature rewards patience.",
        attribution: "Field notes",
      }),
    ).toContain("m-quote__body");
  });

  it("renders a hero block", () => {
    expect(
      renderBlock({
        kind: "hero",
        flow: "content",
        immersive: false,
        photo: {
          id: "hero-photo",
          title: "Hero photo",
          src: "/hero.jpg",
          srcset: ["/hero.jpg 1000w"],
          sizes: "100vw",
          alt: "Kingfisher",
          commentary: "A kingfisher waiting patiently.",
          width: 1000,
          height: 600,
          meta: [],
        },
      }),
    ).toContain("m-photo");
  });

  it("renders a journal listing block", () => {
    expect(
      renderBlock({
        kind: "journalListing",
        items: [],
        pagination: {
          pageSize: 10,
          currentPage: 1,
          totalItems: 0,
          totalPages: 1,
          label: "Page 1 of 1",
          previousHref: null,
          previousLabel: "Previous",
          nextHref: null,
          nextLabel: "Next",
        },
      }),
    ).toContain("m-journal-listing");
  });

  it("renders a pre block", () => {
    expect(
      renderBlock({
        kind: "pre",
        flow: "content",
        value: "const x = 1;",
      }),
    ).toContain("<code>const x = 1;</code>");
  });

  it("renders an article section block", () => {
    expect(
      renderBlock({
        kind: "articleSection",
        heading: {
          text: "Field notes",
          level: 2,
          visuallyHidden: false,
        },
        modules: [],
      }),
    ).toContain("m-articleSection");
  });

  it("renders a homepage hero block", () => {
    expect(
      renderBlock({
        kind: "homepageHero",
        flow: "breakout",
        eyebrow: null,
        title: "Observation",
        intro: [],
        primaryLink: null,
        photo: {
          src: "/hero.jpg",
          srcset: ["/hero.jpg 1200w"],
          sizes: "100vw",
          alt: "Hero",
          width: 1200,
          height: 800,
        },
      }),
    ).toContain("m-homepage-hero");
  });

  it("renders an image strip block", () => {
    expect(
      renderBlock({
        kind: "imageStrip",
        flow: "content",
        heading: {
          text: "Gallery",
          level: 2,
          visuallyHidden: false,
        },
        photos: [],
      }),
    ).toContain("m-image-strip");
  });

  it("renders a homepage journal listing block", () => {
    expect(
      renderBlock({
        kind: "homepageJournalListing",
        heading: {
          text: "Journal",
          level: 2,
          visuallyHidden: false,
        },
        entries: [],
      }),
    ).toBe("");
  });

  it("renders a section links block", () => {
    expect(
      renderBlock({
        kind: "sectionLinks",
        flow: "content",
        sections: [],
      }),
    ).toContain("m-section-links");
  });

  it("renders a note listing block", () => {
    expect(
      renderBlock({
        kind: "noteListing",
        items: [],
        pagination: {
          pageSize: 10,
          currentPage: 1,
          totalItems: 0,
          totalPages: 1,
          label: "Page 1 of 1",
          previousHref: null,
          previousLabel: "Previous",
          nextHref: null,
          nextLabel: "Next",
        },
      }),
    ).toContain("m-note-listing");
  });

  it("renders a homepage note listing block", () => {
    expect(
      renderBlock({
        kind: "homepageNoteListing",
        heading: {
          text: "Notes",
          level: 2,
          visuallyHidden: false,
        },
        notes: [],
      }),
    ).toBe("");
  });
});
