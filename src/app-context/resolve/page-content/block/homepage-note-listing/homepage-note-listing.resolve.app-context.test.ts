// src/app-context/resolve/page-content/block/homepage-note-listing/homepage-note-listing.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-state.homepage-note-listing.block.types";

import { appContextResolveHomepageNoteListingBlock } from "@app-context/resolve/page-content/block/homepage-note-listing/homepage-note-listing.resolve.app-context";

import { appContextResolveNoteListingItems } from "@app-context/resolve/page-content/shared/note-listing-items.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/shared/note-listing-items.resolve.app-context",
  () => ({
    appContextResolveNoteListingItems: jest.fn(),
  }),
);

describe("appContextResolveHomepageNoteListingBlock", () => {
  const mockedAppContextResolveNoteListingItems = jest.mocked(
    appContextResolveNoteListingItems,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("limits notes to the configured item count", () => {
    const context = {} as AppContextPageContentResolverContext;

    const module: AppStateHomepageNoteListingBlock = {
      kind: "homepageNoteListing",
      heading: {
        text: "Latest notes",
        level: 2,
        visuallyHidden: false,
      },
      itemCount: 2,
      flow: "content",
    };

    mockedAppContextResolveNoteListingItems.mockReturnValue([
      {
        id: "note:one",
        href: "/notes/one",
        title: "One",
        intro: "Intro one",
        eyebrow: "Note",
        publishedAt: "2025-01-01",
        topic: "Architecture",
      },
      {
        id: "note:two",
        href: "/notes/two",
        title: "Two",
        intro: "Intro two",
        eyebrow: "Note",
        publishedAt: "2025-01-02",
        topic: "TypeScript",
      },
      {
        id: "note:three",
        href: "/notes/three",
        title: "Three",
        intro: "Intro three",
        eyebrow: "Note",
        publishedAt: "2025-01-03",
        topic: "Testing",
      },
    ]);

    const result = appContextResolveHomepageNoteListingBlock(module, context);

    expect(result).toEqual({
      kind: "homepageNoteListing",
      heading: {
        text: "Latest notes",
        level: 2,
        visuallyHidden: false,
      },
      itemCount: 2,
      flow: "content",
      notes: [
        {
          id: "note:one",
          href: "/notes/one",
          title: "One",
          intro: "Intro one",
          eyebrow: "Note",
          publishedAt: "2025-01-01",
          topic: "Architecture",
        },
        {
          id: "note:two",
          href: "/notes/two",
          title: "Two",
          intro: "Intro two",
          eyebrow: "Note",
          publishedAt: "2025-01-02",
          topic: "TypeScript",
        },
      ],
    });

    expect(mockedAppContextResolveNoteListingItems).toHaveBeenCalledTimes(1);
    expect(mockedAppContextResolveNoteListingItems).toHaveBeenCalledWith(
      context,
    );
  });

  it("returns empty notes when no note items exist", () => {
    const context = {} as AppContextPageContentResolverContext;

    const module: AppStateHomepageNoteListingBlock = {
      kind: "homepageNoteListing",
      heading: {
        text: "Latest notes",
        level: 2,
        visuallyHidden: false,
      },
      itemCount: 2,
      flow: "content",
    };

    mockedAppContextResolveNoteListingItems.mockReturnValue([]);

    const result = appContextResolveHomepageNoteListingBlock(module, context);

    expect(result).toEqual({
      kind: "homepageNoteListing",
      heading: {
        text: "Latest notes",
        level: 2,
        visuallyHidden: false,
      },
      itemCount: 2,
      flow: "content",
      notes: [],
    });
  });
});
