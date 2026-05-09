// src/app-state/resolve/page-content/block/section-links.resolve.app-state.test.ts

import { appStateResolveSectionLinksBlock } from "@app-state/resolve/page-content/block/section-links.resolve.app-state";

import { appStateResolveInternalLink } from "@app-state/resolve/links/internal.link.resolve.app-state";

jest.mock("@app-state/resolve/links/internal.link.resolve.app-state", () => ({
  appStateResolveInternalLink: jest.fn(),
}));

describe("appStateResolveSectionLinksBlock", () => {
  const mockedAppStateResolveInternalLink = jest.mocked(
    appStateResolveInternalLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies deterministic defaults and resolves section links", () => {
    const link = {
      kind: "internal",
      id: "journal",
    };

    const resolvedLink = {
      kind: "internal",
      id: "journal",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    mockedAppStateResolveInternalLink.mockReturnValue(resolvedLink as never);

    expect(
      appStateResolveSectionLinksBlock({
        kind: "sectionLinks",
        sections: [
          {
            heading: {
              text: "Journal",
              level: 2,
            },
            link,
            icon: "book",
          },
        ],
      } as never),
    ).toEqual({
      kind: "sectionLinks",
      flow: "content",
      sections: [
        {
          heading: {
            text: "Journal",
            level: 2,
          },
          link: resolvedLink,
          icon: "book",
          intro: null,
        },
      ],
    });

    expect(mockedAppStateResolveInternalLink).toHaveBeenCalledWith(link);
  });

  it("preserves authored section intro values", () => {
    const link = {
      kind: "internal",
      id: "articles",
    };

    const resolvedLink = {
      kind: "internal",
      id: "articles",
      text: "Articles",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    mockedAppStateResolveInternalLink.mockReturnValue(resolvedLink as never);

    expect(
      appStateResolveSectionLinksBlock({
        kind: "sectionLinks",
        sections: [
          {
            heading: {
              text: "Articles",
              level: 2,
            },
            link,
            icon: "article",
            intro: "Technical notes and field essays.",
          },
        ],
      } as never),
    ).toEqual({
      kind: "sectionLinks",
      flow: "content",
      sections: [
        {
          heading: {
            text: "Articles",
            level: 2,
          },
          link: resolvedLink,
          icon: "article",
          intro: "Technical notes and field essays.",
        },
      ],
    });
  });
});
