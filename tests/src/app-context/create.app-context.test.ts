// tests/src/app-context/create.app-context.test.ts

import { appContextCreate } from "@app-context/create.app-context";
import { AppContext } from "@app-context/class.app-context";

import { resolveNavigationAppContext } from "@app-context/resolve/navigation/navigation.resolve.app-context";
import { resolveGlobalFooterAppContext } from "@app-context/resolve/page-content/global-footer.resolve.app-context";
import { resolvePageSourceAppContext } from "@app-context/resolve/page/source.page.resolve.app-context";
import { resolvePageAppContext } from "@app-context/resolve/page/page.resolve.app-context";
import { resolveAssetsAppContext } from "@app-context/resolve/assets.resolve.app-context";
import { resolveStructuredDataAppContext } from "@app-context/resolve/structured-data.resolve.app-context";
import { resolveBreadcrumbsAppContext } from "@app-context/resolve/breadcrumbs.resolve.app-context";
import { resolveInternalLinkAppContext } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";

jest.mock(
  "@app-context/resolve/navigation/navigation.resolve.app-context",
  () => ({
    resolveNavigationAppContext: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/global-footer.resolve.app-context",
  () => ({
    resolveGlobalFooterAppContext: jest.fn(),
  }),
);

jest.mock("@app-context/resolve/page/source.page.resolve.app-context", () => ({
  resolvePageSourceAppContext: jest.fn(),
}));

jest.mock("@app-context/resolve/page/page.resolve.app-context", () => ({
  resolvePageAppContext: jest.fn(),
}));

jest.mock("@app-context/resolve/assets.resolve.app-context", () => ({
  resolveAssetsAppContext: jest.fn(),
}));

jest.mock("@app-context/resolve/structured-data.resolve.app-context", () => ({
  resolveStructuredDataAppContext: jest.fn(),
}));

jest.mock("@app-context/resolve/breadcrumbs.resolve.app-context", () => ({
  resolveBreadcrumbsAppContext: jest.fn(),
}));

jest.mock(
  "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context",
  () => ({
    resolveInternalLinkAppContext: jest.fn(),
  }),
);

describe("appContextCreate", () => {
  const mockedResolveNavigationAppContext = jest.mocked(
    resolveNavigationAppContext,
  );
  const mockedResolveGlobalFooterAppContext = jest.mocked(
    resolveGlobalFooterAppContext,
  );
  const mockedResolvePageSourceAppContext = jest.mocked(
    resolvePageSourceAppContext,
  );
  const mockedResolvePageAppContext = jest.mocked(resolvePageAppContext);
  const mockedResolveAssetsAppContext = jest.mocked(resolveAssetsAppContext);
  const mockedResolveStructuredDataAppContext = jest.mocked(
    resolveStructuredDataAppContext,
  );
  const mockedResolveBreadcrumbsAppContext = jest.mocked(
    resolveBreadcrumbsAppContext,
  );
  const mockedResolveInternalLinkAppContext = jest.mocked(
    resolveInternalLinkAppContext,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("orchestrates AppContext creation for a public page", () => {
    const appState = {
      navigation: { some: "navigation-state" },
      globalFooter: { some: "global-footer-state" },
      assets: { some: "global-assets" },
    };

    const routing = {
      kind: "found",
      publicPageId: "about",
    } as const;

    const pageState = {
      id: "about",
      kind: "static",
      slug: "/about",
      label: "About",
      metadata: {
        pageTitle: "About | Kevin Ellen",
        metaDescription: "About page",
      },
      robots: {
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
      robotsTxt: {
        disallow: false,
      },
      sitemapXml: {
        include: true,
      },
      structuredData: [],
      assets: {
        scripts: [],
        svg: [],
      },
      breadcrumbs: ["home", "about"],
      content: {
        head: {
          title: "About",
          eyebrow: null,
          intro: null,
        },
        body: [],
        footer: [],
      },
    };

    const resolvedNavigation = { header: {}, footer: {} } as never;
    const resolvedGlobalFooter = { affiliations: {}, colophon: {} } as never;
    const resolvedAssets = { scripts: [], svg: [] } as never;
    const resolvedStructuredData = [{ id: "website", json: {} }] as never;
    const resolvedBreadcrumbs = { items: [], current: "About" } as never;
    const resolvedPage = {
      id: "about",
      kind: "static",
      slug: "/about",
      label: "About",
      content: {
        head: {
          title: "Resolved About",
          eyebrow: null,
          intro: null,
        },
        body: [],
        footer: [],
      },
    } as never;

    mockedResolveNavigationAppContext.mockReturnValue(resolvedNavigation);
    mockedResolveGlobalFooterAppContext.mockReturnValue(resolvedGlobalFooter);
    mockedResolvePageSourceAppContext.mockReturnValue(pageState as never);
    mockedResolveAssetsAppContext.mockReturnValue(resolvedAssets);
    mockedResolveStructuredDataAppContext.mockReturnValue(
      resolvedStructuredData,
    );
    mockedResolveBreadcrumbsAppContext.mockReturnValue(resolvedBreadcrumbs);
    mockedResolvePageAppContext.mockReturnValue(resolvedPage);

    const result = appContextCreate(appState as never, routing);

    expect(result).toBeInstanceOf(AppContext);

    expect(mockedResolveNavigationAppContext).toHaveBeenCalledWith(
      appState.navigation,
      appState,
    );
    expect(mockedResolveGlobalFooterAppContext).toHaveBeenCalledWith(
      appState.globalFooter,
    );
    expect(mockedResolvePageSourceAppContext).toHaveBeenCalledWith(
      appState,
      routing,
    );
    expect(mockedResolveAssetsAppContext).toHaveBeenCalledWith(
      appState.assets,
      pageState.assets,
    );
    expect(mockedResolveStructuredDataAppContext).toHaveBeenCalledWith(
      appState,
      pageState,
    );
    expect(mockedResolveBreadcrumbsAppContext).toHaveBeenCalledWith(
      pageState.breadcrumbs,
      appState,
    );

    expect(mockedResolvePageAppContext).toHaveBeenCalledTimes(1);

    const [, , pageContextArg] = mockedResolvePageAppContext.mock.calls[0];
    expect(mockedResolvePageAppContext).toHaveBeenCalledWith(
      pageState,
      routing,
      pageContextArg,
    );

    pageContextArg.resolveInternalLink({
      kind: "internal",
      id: "about",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    });

    expect(mockedResolveInternalLinkAppContext).toHaveBeenCalledWith(
      {
        kind: "internal",
        id: "about",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
      appState,
    );

    expect(result.inspect).toEqual({
      navigation: resolvedNavigation,
      globalFooter: resolvedGlobalFooter,
      assets: resolvedAssets,
      structuredData: resolvedStructuredData,
      breadcrumbs: resolvedBreadcrumbs,
      page: resolvedPage,
      metadata: pageState.metadata,
      robots: pageState.robots,
    });
  });

  it("omits robots when the resolved page source does not include them", () => {
    const appState = {
      navigation: { some: "navigation-state" },
      globalFooter: { some: "global-footer-state" },
      assets: { some: "global-assets" },
    };

    const routing = {
      kind: "error",
      status: 404,
    } as never;

    const pageState = {
      id: "error-404",
      status: 404,
      metadata: {
        pageTitle: "404 | Not found",
        metaDescription: "Not found",
      },
      assets: {
        scripts: [],
        svg: [],
      },
      breadcrumbs: ["home", "error-404"],
      content: {
        head: {
          title: "404",
          eyebrow: null,
          intro: null,
        },
        body: [],
        footer: [],
      },
    };

    mockedResolveNavigationAppContext.mockReturnValue({} as never);
    mockedResolveGlobalFooterAppContext.mockReturnValue({} as never);
    mockedResolvePageSourceAppContext.mockReturnValue(pageState as never);
    mockedResolveAssetsAppContext.mockReturnValue({
      scripts: [],
      svg: [],
    } as never);
    mockedResolveStructuredDataAppContext.mockReturnValue([] as never);
    mockedResolveBreadcrumbsAppContext.mockReturnValue({
      items: [],
      current: "404 | Not found",
    } as never);
    mockedResolvePageAppContext.mockReturnValue({
      id: "error-404",
      status: 404,
      metadata: pageState.metadata,
      content: pageState.content,
    } as never);

    const result = appContextCreate(appState as never, routing);

    expect(result.inspect).toEqual({
      navigation: {},
      globalFooter: {},
      assets: { scripts: [], svg: [] },
      structuredData: [],
      breadcrumbs: { items: [], current: "404 | Not found" },
      page: {
        id: "error-404",
        status: 404,
        metadata: pageState.metadata,
        content: pageState.content,
      },
      metadata: pageState.metadata,
    });

    expect("robots" in result.inspect).toBe(false);
  });

  // Defensive branch coverage: real AppState page definitions currently always
  // include metadata, but appContextCreate defensively tolerates missing runtime fields.
  it("omits metadata and robots when the resolved page source exposes neither", () => {
    const appState = {
      navigation: { some: "navigation-state" },
      globalFooter: { some: "global-footer-state" },
      assets: { some: "global-assets" },
    };

    const routing = {
      kind: "error",
      status: 500,
    } as never;

    const pageState = {
      id: "synthetic-page",
      assets: {
        scripts: [],
        svg: [],
      },
      breadcrumbs: ["home"],
      content: {
        head: {
          title: "Synthetic",
          eyebrow: null,
          intro: null,
        },
        body: [],
        footer: [],
      },
    };

    mockedResolveNavigationAppContext.mockReturnValue({} as never);
    mockedResolveGlobalFooterAppContext.mockReturnValue({} as never);
    mockedResolvePageSourceAppContext.mockReturnValue(pageState as never);
    mockedResolveAssetsAppContext.mockReturnValue({
      scripts: [],
      svg: [],
    } as never);
    mockedResolveStructuredDataAppContext.mockReturnValue([] as never);
    mockedResolveBreadcrumbsAppContext.mockReturnValue({
      items: [],
      current: "Synthetic",
    } as never);
    mockedResolvePageAppContext.mockReturnValue({
      id: "synthetic-page",
      content: pageState.content,
    } as never);

    const result = appContextCreate(appState as never, routing);

    expect(result.inspect).toEqual({
      navigation: {},
      globalFooter: {},
      assets: { scripts: [], svg: [] },
      structuredData: [],
      breadcrumbs: { items: [], current: "Synthetic" },
      page: {
        id: "synthetic-page",
        content: pageState.content,
      },
    });

    expect("metadata" in result.inspect).toBe(false);
    expect("robots" in result.inspect).toBe(false);
  });
});
