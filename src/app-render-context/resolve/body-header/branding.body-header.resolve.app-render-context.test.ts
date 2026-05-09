// src/app-render-context/resolve/body-header/branding.body-header.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveBodyHeaderBranding } from "@app-render-context/resolve/body-header/branding.body-header.resolve.app-render-context";
import { resolveSvgReferencesAppRenderContext } from "@app-render-context/shared/svg.resolve.app-render-context";

jest.mock("@app-render-context/shared/svg.resolve.app-render-context", () => ({
  resolveSvgReferencesAppRenderContext: jest.fn(),
}));

describe("appRenderContextResolveBodyHeaderBranding", () => {
  const mockedResolveSvgReferencesAppRenderContext = jest.mocked(
    resolveSvgReferencesAppRenderContext,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves header branding logo", () => {
    const logo = {
      id: "brand-logo",
      href: "#svg-brand-logo",
    };

    mockedResolveSvgReferencesAppRenderContext.mockReturnValue([logo as never]);

    const appContext = {
      headerBranding: {
        homeHref: "/",
        ariaLabel: "Kevin Ellen homepage",
        logo: {
          svg: "brand-logo",
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyHeaderBranding(appContext)).toEqual({
      href: "/",
      ariaLabel: "Kevin Ellen homepage",
      logo,
    });
  });

  it("throws when branding logo cannot be resolved", () => {
    mockedResolveSvgReferencesAppRenderContext.mockReturnValue([]);

    const appContext = {
      headerBranding: {
        homeHref: "/",
        ariaLabel: "Kevin Ellen homepage",
        logo: {
          svg: "missing-logo",
        },
      },
    } as unknown as AppContext;

    expect(() => appRenderContextResolveBodyHeaderBranding(appContext)).toThrow(
      "Missing SVG asset: missing-logo",
    );
  });
});
