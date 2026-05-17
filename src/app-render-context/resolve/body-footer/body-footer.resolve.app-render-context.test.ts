// src/app-render-context/resolve/body-footer/body-footer.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveBodyFooter } from "@app-render-context/resolve/body-footer/body-footer.resolve.app-render-context";

import { appRenderContextResolveBodyFooterAffiliations } from "@app-render-context/resolve/body-footer/affiliations.body-footer.resolve.app-render-context";
import { appRenderContextResolveBodyFooterColophon } from "@app-render-context/resolve/body-footer/colophon.body-footer.resolve.app-render-context";
import { appRenderContextResolveBodyFooterNav } from "@app-render-context/resolve/body-footer/nav.body-footer.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-footer/nav.body-footer.resolve.app-render-context",
  () => ({
    appRenderContextResolveBodyFooterNav: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-footer/affiliations.body-footer.resolve.app-render-context",
  () => ({
    appRenderContextResolveBodyFooterAffiliations: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-footer/colophon.body-footer.resolve.app-render-context",
  () => ({
    appRenderContextResolveBodyFooterColophon: jest.fn(),
  }),
);

describe("appRenderContextResolveBodyFooter", () => {
  const mockedAppRenderContextResolveBodyFooterNav = jest.mocked(
    appRenderContextResolveBodyFooterNav,
  );

  const mockedAppRenderContextResolveBodyFooterAffiliations = jest.mocked(
    appRenderContextResolveBodyFooterAffiliations,
  );

  const mockedAppRenderContextResolveBodyFooterColophon = jest.mocked(
    appRenderContextResolveBodyFooterColophon,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves all body footer sections", () => {
    const nav = {
      sections: [],
    };

    const affiliations = {
      items: [],
    };

    const colophon = {
      items: [],
    };

    mockedAppRenderContextResolveBodyFooterNav.mockReturnValue(nav as never);

    mockedAppRenderContextResolveBodyFooterAffiliations.mockReturnValue(
      affiliations as never,
    );

    mockedAppRenderContextResolveBodyFooterColophon.mockReturnValue(
      colophon as never,
    );

    const appContext = {} as unknown as AppContext;

    expect(appRenderContextResolveBodyFooter(appContext)).toEqual({
      nav,
      affiliations,
      colophon,
    });

    expect(mockedAppRenderContextResolveBodyFooterNav).toHaveBeenCalledWith(
      appContext,
    );

    expect(
      mockedAppRenderContextResolveBodyFooterAffiliations,
    ).toHaveBeenCalledWith(appContext);

    expect(
      mockedAppRenderContextResolveBodyFooterColophon,
    ).toHaveBeenCalledWith(appContext);
  });
});
