// src/app-render-context/resolve/body-content/block/homepage-note-listing/homepage-note-listing.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-context.homepage-note-listing.block.types";

import { appRenderContextResolveHomepageNoteListingBlock } from "@app-render-context/resolve/body-content/block/homepage-note-listing/homepage-note-listing.resolve.app-render-context";
import { formatDate } from "@utils/date.format.util";

jest.mock("@utils/date.format.util", () => ({
  formatDate: jest.fn(),
}));

describe("appRenderContextResolveHomepageNoteListingBlock", () => {
  const mockedFormatDate = jest.mocked(formatDate);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves homepage note listing notes", () => {
    mockedFormatDate.mockReturnValue("10 May 2026");

    const block: AppContextHomepageNoteListingBlock = {
      kind: "homepageNoteListing",
      flow: "content",
      itemCount: 3,
      heading: {
        text: "Latest notes",
        visuallyHidden: false,
        level: 2,
      },
      notes: [
        {
          id: "note:building-this-website-was-worth-it",
          href: "/notes/building-this-website-was-worth-it",
          title: "Building this website was worth it",
          intro: "A note about building the site.",
          eyebrow: "Note",
          publishedAt: "2026-05-10T22:14:49+01:00",
          topic: "Architecture",
        },
      ],
    };

    expect(
      appRenderContextResolveHomepageNoteListingBlock(
        {} as unknown as AppContext,
        block,
      ),
    ).toEqual({
      ...block,
      notes: [
        {
          id: "note:building-this-website-was-worth-it",
          href: "/notes/building-this-website-was-worth-it",
          title: "Building this website was worth it",
          intro: "A note about building the site.",
          eyebrow: "Note",
          publishedAt: "2026-05-10T22:14:49+01:00",
          publishedLabel: "10 May 2026",
          topic: "Architecture",
        },
      ],
    });

    expect(mockedFormatDate).toHaveBeenCalledWith("2026-05-10T22:14:49+01:00");
  });

  it("returns null publishedLabel when publishedAt is null", () => {
    const block: AppContextHomepageNoteListingBlock = {
      kind: "homepageNoteListing",
      flow: "content",
      itemCount: 1,
      heading: {
        text: "Latest notes",
        visuallyHidden: false,
        level: 2,
      },
      notes: [
        {
          id: "note:quiet-note",
          href: "/notes/quiet-note",
          title: "Quiet Note",
          intro: null,
          eyebrow: null,
          publishedAt: null,
          topic: null,
        },
      ],
    };

    expect(
      appRenderContextResolveHomepageNoteListingBlock(
        {} as unknown as AppContext,
        block,
      ),
    ).toEqual({
      ...block,
      notes: [
        {
          id: "note:quiet-note",
          href: "/notes/quiet-note",
          title: "Quiet Note",
          intro: null,
          eyebrow: null,
          publishedAt: null,
          publishedLabel: null,
          topic: null,
        },
      ],
    });

    expect(mockedFormatDate).not.toHaveBeenCalled();
  });

  it("resolves multiple notes independently", () => {
    mockedFormatDate
      .mockReturnValueOnce("1 May 2026")
      .mockReturnValueOnce("2 May 2026");

    const block: AppContextHomepageNoteListingBlock = {
      kind: "homepageNoteListing",
      flow: "content",
      itemCount: 2,
      heading: {
        text: "Recent notes",
        visuallyHidden: false,
        level: 2,
      },
      notes: [
        {
          id: "note:one",
          href: "/notes/one",
          title: "Note One",
          intro: null,
          eyebrow: null,
          publishedAt: "2026-05-01T00:00:00.000Z",
          topic: "Architecture",
        },
        {
          id: "note:two",
          href: "/notes/two",
          title: "Note Two",
          intro: null,
          eyebrow: null,
          publishedAt: "2026-05-02T00:00:00.000Z",
          topic: "TypeScript",
        },
      ],
    };

    const result = appRenderContextResolveHomepageNoteListingBlock(
      {} as unknown as AppContext,
      block,
    );

    expect(result.notes).toHaveLength(2);
    expect(mockedFormatDate).toHaveBeenCalledTimes(2);
  });
});
