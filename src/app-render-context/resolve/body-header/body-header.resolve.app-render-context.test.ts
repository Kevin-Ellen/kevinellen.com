// src/app-render-context/resolve/body-header/body-header.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveBodyHeader } from "@app-render-context/resolve/body-header/body-header.resolve.app-render-context";
import { appRenderContextResolveBodyHeaderBranding } from "@app-render-context/resolve/body-header/branding.body-header.resolve.app-render-context";
import { appRenderContextResolveBodyHeaderBreadcrumbs } from "@app-render-context/resolve/body-header/breadcrumbs.body-header.resolve.app-render-context";
import { appRenderContextResolveBodyHeaderNavigation } from "@app-render-context/resolve/body-header/navigation.body-header.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-header/branding.body-header.resolve.app-render-context",
  () => ({
    appRenderContextResolveBodyHeaderBranding: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-header/breadcrumbs.body-header.resolve.app-render-context",
  () => ({
    appRenderContextResolveBodyHeaderBreadcrumbs: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-header/navigation.body-header.resolve.app-render-context",
  () => ({
    appRenderContextResolveBodyHeaderNavigation: jest.fn(),
  }),
);

describe("appRenderContextResolveBodyHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves all body header sections", () => {
    const branding = {
      href: "/",
      ariaLabel: "Homepage",
      logo: { id: "logo", href: "#svg-logo" },
    };

    const navigation = {
      primary: [],
      social: [],
    };

    const breadcrumbs = {
      items: [],
      current: "Current page",
    };

    jest
      .mocked(appRenderContextResolveBodyHeaderBranding)
      .mockReturnValue(branding as never);

    jest
      .mocked(appRenderContextResolveBodyHeaderNavigation)
      .mockReturnValue(navigation as never);

    jest
      .mocked(appRenderContextResolveBodyHeaderBreadcrumbs)
      .mockReturnValue(breadcrumbs as never);

    const appContext = {} as unknown as AppContext;

    expect(appRenderContextResolveBodyHeader(appContext)).toEqual({
      branding,
      navigation,
      breadcrumbs,
    });

    expect(appRenderContextResolveBodyHeaderBranding).toHaveBeenCalledWith(
      appContext,
    );
    expect(appRenderContextResolveBodyHeaderNavigation).toHaveBeenCalledWith(
      appContext,
    );
    expect(appRenderContextResolveBodyHeaderBreadcrumbs).toHaveBeenCalledWith(
      appContext,
    );
  });
});
