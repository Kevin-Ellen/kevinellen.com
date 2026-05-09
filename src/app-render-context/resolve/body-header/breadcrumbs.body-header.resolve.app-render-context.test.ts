// src/app-render-context/resolve/body-header/breadcrumbs.body-header.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveBodyHeaderBreadcrumbs } from "@app-render-context/resolve/body-header/breadcrumbs.body-header.resolve.app-render-context";
import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";

jest.mock("@app-render-context/shared/link.resolve.app-render-context", () => ({
  appRenderContextResolveLink: jest.fn(),
}));

describe("appRenderContextResolveBodyHeaderBreadcrumbs", () => {
  const mockedAppRenderContextResolveLink = jest.mocked(
    appRenderContextResolveLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves breadcrumb links and preserves current item", () => {
    const sourceItem = {
      href: "/journal",
      text: "Journal",
    };

    const resolvedItem = {
      href: "/journal",
      text: "Journal",
      openInNewTab: false,
      svg: null,
    };

    mockedAppRenderContextResolveLink.mockReturnValue(resolvedItem as never);

    const appContext = {
      breadcrumbs: {
        items: [sourceItem],
        current: "Coot field notes",
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyHeaderBreadcrumbs(appContext)).toEqual({
      items: [resolvedItem],
      current: "Coot field notes",
    });

    expect(mockedAppRenderContextResolveLink).toHaveBeenCalledWith(
      appContext,
      sourceItem,
    );
  });

  it("preserves empty breadcrumb items", () => {
    const appContext = {
      breadcrumbs: {
        items: [],
        current: "Homepage",
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyHeaderBreadcrumbs(appContext)).toEqual({
      items: [],
      current: "Homepage",
    });

    expect(mockedAppRenderContextResolveLink).not.toHaveBeenCalled();
  });
});
