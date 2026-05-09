// src/app-context/resolve/page-content/block/section-links.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-state.section-links.block.types";

import { appContextResolveSectionLinksBlock } from "@app-context/resolve/page-content/block/section-links.resolve.app-context";

const createBlock = (): AppStateSectionLinksBlock => ({
  kind: "sectionLinks",
  flow: "content",
  sections: [
    {
      heading: {
        text: "Journal",
        level: 3,
        visuallyHidden: false,
      },
      intro: "Latest field notes.",
      icon: "icon-newspaper",
      link: {
        kind: "internal",
        id: "journal",
        text: null,
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
    },
    {
      heading: {
        text: "Articles",
        level: 3,
        visuallyHidden: false,
      },
      intro: "Long-form writing.",
      icon: "icon-newspaper",
      link: {
        kind: "internal",
        id: "articles",
        text: null,
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
    },
  ],
});

describe("appContextResolveSectionLinksBlock", () => {
  it("resolves internal links for all sections", () => {
    const resolvedJournalLink = {
      kind: "internal",
      id: "journal",
      href: "/journal",
      text: "Journal",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const resolvedArticlesLink = {
      kind: "internal",
      id: "articles",
      href: "/articles",
      text: "Articles",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const context = {
      resolveInternalLink: jest
        .fn()
        .mockReturnValueOnce(resolvedJournalLink)
        .mockReturnValueOnce(resolvedArticlesLink),
    } as unknown as AppContextPageContentResolverContext;

    const block = createBlock();

    const result = appContextResolveSectionLinksBlock(block, context);

    expect(result).toEqual({
      kind: "sectionLinks",
      flow: "content",
      sections: [
        {
          heading: {
            text: "Journal",
            level: 3,
            visuallyHidden: false,
          },
          intro: "Latest field notes.",
          icon: "icon-newspaper",
          link: resolvedJournalLink,
        },
        {
          heading: {
            text: "Articles",
            level: 3,
            visuallyHidden: false,
          },
          intro: "Long-form writing.",
          icon: "icon-newspaper",
          link: resolvedArticlesLink,
        },
      ],
    });

    expect(context.resolveInternalLink).toHaveBeenCalledTimes(2);

    expect(context.resolveInternalLink).toHaveBeenNthCalledWith(
      1,
      block.sections[0].link,
    );

    expect(context.resolveInternalLink).toHaveBeenNthCalledWith(
      2,
      block.sections[1].link,
    );
  });

  it("preserves empty sections", () => {
    const context = {
      resolveInternalLink: jest.fn(),
    } as unknown as AppContextPageContentResolverContext;

    const block: AppStateSectionLinksBlock = {
      kind: "sectionLinks",
      flow: "content",
      sections: [],
    };

    const result = appContextResolveSectionLinksBlock(block, context);

    expect(result).toEqual({
      kind: "sectionLinks",
      flow: "content",
      sections: [],
    });

    expect(context.resolveInternalLink).not.toHaveBeenCalled();
  });
});
