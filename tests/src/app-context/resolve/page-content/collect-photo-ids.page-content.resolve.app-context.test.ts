// tests/src/app-context/resolve/page-content/collect-photo-ids.page-content.resolve.app-context.test.ts

import { appContextCollectPhotoIdsFromBlockContent } from "@app-context/resolve/page-content/collect-photo-ids.page-content.resolve.app-context";

const createContext = (publicPages: readonly unknown[] = []) =>
  ({
    publicPages,
  }) as never;

describe("appContextCollectPhotoIdsFromBlockContent", () => {
  it("collects hero photo IDs", () => {
    const modules = [
      {
        kind: "hero",
        photoId: "photo-hero-1",
        immersive: true,
        flow: "breakout",
      },
    ] as never;

    expect(
      appContextCollectPhotoIdsFromBlockContent(modules, createContext()),
    ).toEqual(["photo-hero-1"]);
  });

  it("collects homepage hero photo IDs", () => {
    const modules = [
      {
        kind: "homepageHero",
        photoId: "homepage-hero-deer",
        flow: "breakout",
        eyebrow: "Wildlife",
        title: "Kevin Ellen",
        intro: [],
        primaryLink: null,
      },
    ] as never;

    expect(
      appContextCollectPhotoIdsFromBlockContent(modules, createContext()),
    ).toEqual(["homepage-hero-deer"]);
  });

  it("recurses through article section modules", () => {
    const modules = [
      {
        kind: "articleSection",
        heading: {
          text: "Field notes",
          visuallyHidden: false,
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            flow: "content",
            content: [],
          },
          {
            kind: "hero",
            photoId: "photo-nested-hero",
            immersive: false,
            flow: "content",
          },
        ],
      },
    ] as never;

    expect(
      appContextCollectPhotoIdsFromBlockContent(modules, createContext()),
    ).toEqual(["photo-nested-hero"]);
  });

  it("collects journal listing photo IDs from journal pages", () => {
    const modules = [
      {
        kind: "journalListing",
        flow: "content",
        pagination: {
          pageSize: 12,
        },
      },
    ] as never;

    const publicPages = [
      {
        id: "journal:a",
        kind: "journal",
        content: {
          content: [
            {
              kind: "hero",
              photoId: "journal-photo-a",
              immersive: true,
              flow: "breakout",
            },
          ],
        },
      },
      {
        id: "about",
        kind: "static",
        content: {
          content: [
            {
              kind: "hero",
              photoId: "ignored-static-photo",
              immersive: false,
              flow: "content",
            },
          ],
        },
      },
      {
        id: "journal:b",
        kind: "journal",
        content: {
          content: [
            {
              kind: "articleSection",
              heading: {
                text: "Nested",
                visuallyHidden: false,
                level: 2,
              },
              modules: [
                {
                  kind: "hero",
                  photoId: "journal-photo-b",
                  immersive: false,
                  flow: "content",
                },
              ],
            },
          ],
        },
      },
    ];

    expect(
      appContextCollectPhotoIdsFromBlockContent(
        modules,
        createContext(publicPages),
      ),
    ).toEqual(["journal-photo-a", "journal-photo-b"]);
  });

  it("deduplicates photo IDs while preserving first-seen order", () => {
    const modules = [
      {
        kind: "hero",
        photoId: "photo-a",
        immersive: true,
        flow: "breakout",
      },
      {
        kind: "hero",
        photoId: "photo-b",
        immersive: false,
        flow: "content",
      },
      {
        kind: "articleSection",
        heading: {
          text: "More photos",
          visuallyHidden: false,
          level: 2,
        },
        modules: [
          {
            kind: "hero",
            photoId: "photo-a",
            immersive: false,
            flow: "content",
          },
          {
            kind: "hero",
            photoId: "photo-c",
            immersive: false,
            flow: "content",
          },
        ],
      },
    ] as never;

    expect(
      appContextCollectPhotoIdsFromBlockContent(modules, createContext()),
    ).toEqual(["photo-a", "photo-b", "photo-c"]);
  });

  it("ignores non-photo block modules", () => {
    const modules = [
      {
        kind: "paragraph",
        flow: "content",
        content: [],
      },
      {
        kind: "quote",
        id: "quote-1",
        text: "A quiet field note.",
        attribution: "Kevin Ellen",
        flow: "content",
      },
      {
        kind: "list",
        style: "unordered",
        flow: "content",
        items: [],
      },
    ] as never;

    expect(
      appContextCollectPhotoIdsFromBlockContent(modules, createContext()),
    ).toEqual([]);
  });

  it("returns an empty array for empty module arrays", () => {
    expect(
      appContextCollectPhotoIdsFromBlockContent([], createContext()),
    ).toEqual([]);
  });
});
