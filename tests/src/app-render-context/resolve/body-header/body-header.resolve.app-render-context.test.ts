// tests/src/app-render-context/resolve/body-header/body-header.resolve.app-render-context.test.ts

import { resolveBodyHeaderAppRenderContext } from "@app-render-context/resolve/body-header/body-header.resolve.app-render-context";
import { resolveBrandingBodyHeaderAppRenderContext } from "@app-render-context/resolve/body-header/branding.resolve.body-header.app-render-context";
import { resolveNavigationBodyHeaderAppRenderContext } from "@app-render-context/resolve/body-header/navigation.resolve.body-header.app-render-context";
import { resolveBreadcrumbsAppRenderContext } from "@app-render-context/resolve/body-header/breadcrumbs.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/body-header/branding.resolve.body-header.app-render-context",
  () => ({ resolveBrandingBodyHeaderAppRenderContext: jest.fn() }),
);

jest.mock(
  "@app-render-context/resolve/body-header/navigation.resolve.body-header.app-render-context",
  () => ({ resolveNavigationBodyHeaderAppRenderContext: jest.fn() }),
);

jest.mock(
  "@app-render-context/resolve/body-header/breadcrumbs.resolve.app-render-context",
  () => ({ resolveBreadcrumbsAppRenderContext: jest.fn() }),
);

describe("resolveBodyHeaderAppRenderContext", () => {
  it("composes branding, navigation, and breadcrumbs", () => {
    const appContext = {} as AppContext;

    const branding = {
      href: "/",
      ariaLabel: "Kevin Ellen home",
      logo: {
        id: "logo-monogram-ke",
        width: 100,
        height: 100,
      },
    };

    const navigation = {
      primary: [],
      social: [],
    };

    const breadcrumbs = {
      items: [],
      current: "Home",
    };

    jest
      .mocked(resolveBrandingBodyHeaderAppRenderContext)
      .mockReturnValue(branding as never);
    jest
      .mocked(resolveNavigationBodyHeaderAppRenderContext)
      .mockReturnValue(navigation as never);
    jest
      .mocked(resolveBreadcrumbsAppRenderContext)
      .mockReturnValue(breadcrumbs as never);

    const result = resolveBodyHeaderAppRenderContext(appContext);

    expect(resolveBrandingBodyHeaderAppRenderContext).toHaveBeenCalledWith(
      appContext,
    );
    expect(resolveNavigationBodyHeaderAppRenderContext).toHaveBeenCalledWith(
      appContext,
    );
    expect(resolveBreadcrumbsAppRenderContext).toHaveBeenCalledWith(appContext);

    expect(result).toEqual({
      branding,
      navigation,
      breadcrumbs,
    });
  });
});
