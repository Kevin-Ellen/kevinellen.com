// tests/src/app-context/resolve/page-content/collect-photo-ids.page-content.resolve.app-context.test.ts

import { appContextCollectPhotoIdsFromBlockContent } from "@app-context/resolve/page-content/collect-photo-ids.page-content.resolve.app-context";

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

    expect(appContextCollectPhotoIdsFromBlockContent(modules)).toEqual([
      "photo-hero-1",
    ]);
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

    expect(appContextCollectPhotoIdsFromBlockContent(modules)).toEqual([
      "photo-nested-hero",
    ]);
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

    expect(appContextCollectPhotoIdsFromBlockContent(modules)).toEqual([
      "photo-a",
      "photo-b",
      "photo-c",
    ]);
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

    expect(appContextCollectPhotoIdsFromBlockContent(modules)).toEqual([]);
  });

  it("returns an empty array for empty module arrays", () => {
    expect(appContextCollectPhotoIdsFromBlockContent([])).toEqual([]);
  });
});
