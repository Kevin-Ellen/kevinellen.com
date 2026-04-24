// tests/src/app-render-context/resolve/body-header/branding.resolve.body-header.app-render-context.test.ts

import { resolveBrandingBodyHeaderAppRenderContext } from "@app-render-context/resolve/body-header/branding.resolve.body-header.app-render-context";
import { resolveSvgReferencesAppRenderContext } from "@app-render-context/shared/svg.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock("@app-render-context/shared/svg.resolve.app-render-context", () => ({
  resolveSvgReferencesAppRenderContext: jest.fn(),
}));

describe("resolveBrandingBodyHeaderAppRenderContext", () => {
  it("resolves body header branding with logo reference", () => {
    const appContext = {
      headerBranding: {
        homeHref: "/",
        ariaLabel: "Kevin Ellen home",
        logo: {
          svg: "logo-monogram-ke",
        },
      },
    } as unknown as AppContext;

    const logo = {
      id: "logo-monogram-ke",
      width: 100,
      height: 100,
    } as const;

    jest.mocked(resolveSvgReferencesAppRenderContext).mockReturnValue([logo]);

    const result = resolveBrandingBodyHeaderAppRenderContext(appContext);

    expect(resolveSvgReferencesAppRenderContext).toHaveBeenCalledWith(
      appContext,
    );

    expect(result).toEqual({
      href: "/",
      ariaLabel: "Kevin Ellen home",
      logo,
    });
  });

  it("throws when the branding logo SVG cannot be resolved", () => {
    const appContext = {
      headerBranding: {
        homeHref: "/",
        ariaLabel: "Kevin Ellen home",
        logo: {
          svg: "logo-monogram-ke",
        },
      },
    } as unknown as AppContext;

    jest.mocked(resolveSvgReferencesAppRenderContext).mockReturnValue([]);

    expect(() => resolveBrandingBodyHeaderAppRenderContext(appContext)).toThrow(
      "Missing SVG asset: logo-monogram-ke",
    );
  });
});
