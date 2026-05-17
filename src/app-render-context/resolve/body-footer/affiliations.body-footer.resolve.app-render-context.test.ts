// src/app-render-context/resolve/body-footer/affiliations.resolve.body-footer.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveBodyFooterAffiliations } from "@app-render-context/resolve/body-footer/affiliations.body-footer.resolve.app-render-context";
import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

jest.mock(
  "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context",
  () => ({
    resolveSvgReferenceByIdAppRenderContext: jest.fn(),
  }),
);

describe("appRenderContextResolveBodyFooterAffiliations", () => {
  const mockedResolveSvgReferenceByIdAppRenderContext = jest.mocked(
    resolveSvgReferenceByIdAppRenderContext,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves footer affiliation logos", () => {
    const logo = {
      id: "github",
      href: "#svg-github",
    };

    mockedResolveSvgReferenceByIdAppRenderContext.mockReturnValue(
      logo as never,
    );

    const appContext = {
      globalFooter: {
        affiliations: {
          items: [
            {
              label: "GitHub",
              href: "https://github.com/Kevin-Ellen",
              svgId: "github",
            },
          ],
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyFooterAffiliations(appContext)).toEqual({
      items: [
        {
          ariaLabel: "GitHub",
          href: "https://github.com/Kevin-Ellen",
          logo,
        },
      ],
    });

    expect(mockedResolveSvgReferenceByIdAppRenderContext).toHaveBeenCalledWith(
      appContext,
      "github",
    );
  });

  it("returns an empty items array when there are no affiliations", () => {
    const appContext = {
      globalFooter: {
        affiliations: {
          items: [],
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyFooterAffiliations(appContext)).toEqual({
      items: [],
    });

    expect(
      mockedResolveSvgReferenceByIdAppRenderContext,
    ).not.toHaveBeenCalled();
  });

  it("throws when an affiliation logo cannot be resolved", () => {
    mockedResolveSvgReferenceByIdAppRenderContext.mockReturnValue(null);

    const appContext = {
      globalFooter: {
        affiliations: {
          items: [
            {
              label: "GitHub",
              href: "https://github.com/Kevin-Ellen",
              svgId: "github",
            },
          ],
        },
      },
    } as unknown as AppContext;

    expect(() =>
      appRenderContextResolveBodyFooterAffiliations(appContext),
    ).toThrow(
      'Footer affiliation logo could not be resolved for svgId "github".',
    );
  });
});
