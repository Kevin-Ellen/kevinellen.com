// tests/src/app-render-context/resolve/body-footer/affiliations.resolve.body-footer.app-render-context.test.ts

import { resolveAffiliationsBodyFooterAppRenderContext } from "@app-render-context/resolve/body-footer/affiliations.resolve.body-footer.app-render-context";
import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context",
  () => ({
    resolveSvgReferenceByIdAppRenderContext: jest.fn(),
  }),
);

describe("resolveAffiliationsBodyFooterAppRenderContext", () => {
  it("resolves footer affiliation items with logos", () => {
    const appContext = {
      globalFooter: {
        affiliations: {
          items: [
            {
              label: "RSPB",
              href: "https://www.rspb.org.uk/",
              svgId: "icon-home",
            },
          ],
        },
      },
    } as unknown as AppContext;

    const logo = {
      id: "icon-home",
      width: 100,
      height: 100,
    } as const;

    jest.mocked(resolveSvgReferenceByIdAppRenderContext).mockReturnValue(logo);

    const result = resolveAffiliationsBodyFooterAppRenderContext(appContext);

    expect(resolveSvgReferenceByIdAppRenderContext).toHaveBeenCalledWith(
      appContext,
      "icon-home",
    );

    expect(result).toEqual({
      items: [
        {
          ariaLabel: "RSPB",
          href: "https://www.rspb.org.uk/",
          logo,
        },
      ],
    });
  });

  it("throws when an affiliation logo cannot be resolved", () => {
    const appContext = {
      globalFooter: {
        affiliations: {
          items: [
            {
              label: "RSPB",
              href: "https://www.rspb.org.uk/",
              svgId: "icon-home",
            },
          ],
        },
      },
    } as unknown as AppContext;

    jest.mocked(resolveSvgReferenceByIdAppRenderContext).mockReturnValue(null);

    expect(() =>
      resolveAffiliationsBodyFooterAppRenderContext(appContext),
    ).toThrow(
      'Footer affiliation logo could not be resolved for svgId "icon-home".',
    );
  });
});
