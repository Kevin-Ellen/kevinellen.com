// src/app-render-context/shared/link.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";
import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

jest.mock(
  "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context",
  () => ({
    resolveSvgReferenceByIdAppRenderContext: jest.fn(),
  }),
);

describe("appRenderContextResolveLink", () => {
  const appContext = {} as unknown as AppContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves internal links", () => {
    const svg = {
      id: "icon-journal",
      width: 24,
      height: 24,
    };

    jest
      .mocked(resolveSvgReferenceByIdAppRenderContext)
      .mockReturnValue(svg as never);

    expect(
      appRenderContextResolveLink(appContext, {
        id: "journal",
        kind: "internal",
        href: "/journal",
        text: "Journal",
        svgId: "icon-home",
        behaviour: {
          openInNewTab: false,
        },
      }),
    ).toEqual({
      kind: "internal",
      href: "/journal",
      text: "Journal",
      openInNewTab: false,
      svg,
    });

    expect(resolveSvgReferenceByIdAppRenderContext).toHaveBeenCalledWith(
      appContext,
      "icon-home",
    );
  });

  it("resolves external links", () => {
    jest.mocked(resolveSvgReferenceByIdAppRenderContext).mockReturnValue(null);

    expect(
      appRenderContextResolveLink(appContext, {
        id: "example",
        kind: "external",
        href: "https://example.com",
        text: "Example",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      }),
    ).toEqual({
      kind: "external",
      href: "https://example.com",
      text: "Example",
      openInNewTab: false,
      svg: null,
    });

    expect(resolveSvgReferenceByIdAppRenderContext).toHaveBeenCalledWith(
      appContext,
      null,
    );
  });

  it("preserves external open-in-new-tab behaviour", () => {
    jest.mocked(resolveSvgReferenceByIdAppRenderContext).mockReturnValue(null);

    expect(
      appRenderContextResolveLink(appContext, {
        id: "bluesky",
        kind: "external",
        href: "https://bsky.app",
        text: "Bluesky",
        svgId: null,
        behaviour: {
          openInNewTab: true,
        },
      }),
    ).toEqual({
      kind: "external",
      href: "https://bsky.app",
      text: "Bluesky",
      openInNewTab: true,
      svg: null,
    });
  });

  it("throws when no link resolver is registered", () => {
    expect(() =>
      appRenderContextResolveLink(appContext, {
        kind: "missingLink",
      } as never),
    ).toThrow(
      "No AppRenderContext link resolver registered for kind: missingLink",
    );
  });
});
