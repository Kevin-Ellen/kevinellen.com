// src/app-render-context/resolve/body-content/block/section-links.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-context.section-links.block.types";

import { appRenderContextResolveSectionLinksBlock } from "@app-render-context/resolve/body-content/block/section-links.resolve.app-render-context";
import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";
import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

jest.mock("@app-render-context/shared/link.resolve.app-render-context", () => ({
  appRenderContextResolveLink: jest.fn(),
}));

jest.mock(
  "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context",
  () => ({
    resolveSvgReferenceByIdAppRenderContext: jest.fn(),
  }),
);

describe("appRenderContextResolveSectionLinksBlock", () => {
  const mockedAppRenderContextResolveLink = jest.mocked(
    appRenderContextResolveLink,
  );

  const mockedResolveSvgReferenceByIdAppRenderContext = jest.mocked(
    resolveSvgReferenceByIdAppRenderContext,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves section links and icons", () => {
    const link = {
      id: "journal",
      kind: "internal",
      href: "/journal",
      text: "Journal",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const resolvedLink = {
      kind: "internal",
      href: "/journal",
      text: "Journal",
      openInNewTab: false,
      svg: null,
    };

    const resolvedIcon = {
      id: "journal",
      href: "#svg-journal",
    };

    mockedAppRenderContextResolveLink.mockReturnValue(resolvedLink as never);

    mockedResolveSvgReferenceByIdAppRenderContext.mockReturnValue(
      resolvedIcon as never,
    );

    const block: AppContextSectionLinksBlock = {
      kind: "sectionLinks",
      flow: "content",
      sections: [
        {
          heading: {
            text: "Journal",
            visuallyHidden: false,
            level: 3,
          },
          intro: "Field notes and observations.",
          link: link as never,
          icon: "journal" as never,
        },
      ],
    };

    const appContext = {} as unknown as AppContext;

    expect(appRenderContextResolveSectionLinksBlock(appContext, block)).toEqual(
      {
        ...block,
        sections: [
          {
            ...block.sections[0],
            link: resolvedLink,
            icon: resolvedIcon,
          },
        ],
      },
    );

    expect(mockedAppRenderContextResolveLink).toHaveBeenCalledTimes(1);
    expect(mockedResolveSvgReferenceByIdAppRenderContext).toHaveBeenCalledTimes(
      1,
    );

    expect(mockedAppRenderContextResolveLink).toHaveBeenCalledWith(
      appContext,
      link,
    );

    expect(mockedResolveSvgReferenceByIdAppRenderContext).toHaveBeenCalledWith(
      appContext,
      "journal",
    );
  });

  it("preserves an empty sections array", () => {
    const block: AppContextSectionLinksBlock = {
      kind: "sectionLinks",
      flow: "content",
      sections: [],
    };

    expect(
      appRenderContextResolveSectionLinksBlock(
        {} as unknown as AppContext,
        block,
      ),
    ).toEqual(block);

    expect(mockedAppRenderContextResolveLink).not.toHaveBeenCalled();
    expect(
      mockedResolveSvgReferenceByIdAppRenderContext,
    ).not.toHaveBeenCalled();
  });
});
