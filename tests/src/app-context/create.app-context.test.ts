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
import { appContextCollectPhotoIdsFromBlockContent } from "@app-context/resolve/page-content/collect-photo-ids.page-content.resolve.app-context";
import { resolvePhotosAppContext } from "@app-context/resolve/photos/photos.resolve.app-context";

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

jest.mock(
  "@app-context/resolve/page-content/collect-photo-ids.page-content.resolve.app-context",
  () => ({
    appContextCollectPhotoIdsFromBlockContent: jest.fn(),
  }),
);

jest.mock("@app-context/resolve/photos/photos.resolve.app-context", () => ({
  resolvePhotosAppContext: jest.fn(),
}));

const env = {
  APP_HOST: "kevinellen.com",
  KV_PHOTOS: {} as KVNamespace,
} as Env;

const metadataLabels = {
  location: "Location",
  capturedAt: "Captured",
  shutterSpeed: "Shutter speed",
  aperture: "Aperture",
  focalLength: "Focal length",
  iso: "ISO",
};

const createAppState = () => ({
  siteConfig: {
    origin: "https://www.kevinellen.com",
    language: "en-GB",
    headAssets: {
      links: [],
    },
    headerBranding: {
      href: "/",
      ariaLabel: "Kevin Ellen home",
      logo: {
        id: "logo-monogram-ke",
        width: 100,
        height: 100,
      },
    },
    preload: [],
  },
  manifest: {
    backgroundColor: "#ffffff",
  },
  navigation: { some: "navigation-state" },
  globalFooter: { some: "global-footer-state" },
  assets: { some: "global-assets" },
  metadataLabels,
  getPublicPages: [],
});

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
  const mockedAppContextCollectPhotoIdsFromBlockContent = jest.mocked(
    appContextCollectPhotoIdsFromBlockContent,
  );
  const mockedResolvePhotosAppContext = jest.mocked(resolvePhotosAppContext);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedAppContextCollectPhotoIdsFromBlockContent.mockReturnValue([]);
    mockedResolvePhotosAppContext.mockResolvedValue({} as never);
  });

  it("orchestrates AppContext creation for a public page", async () => {
    const appState = createAppState();

    const routing = {
      kind: "found",
      publicPageId: "about",
      pagination: null,
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
        header: {
          title: "About",
          eyebrow: null,
          intro: null,
        },
        content: [],
        footer: [],
      },
    };

    const resolvedNavigation = { header: {}, footer: {} } as never;
    const resolvedGlobalFooter = { affiliations: {}, colophon: {} } as never;
    const resolvedAssets = { scripts: [], svg: [] } as never;
    const resolvedStructuredData = [{ id: "website", json: {} }] as never;
    const resolvedBreadcrumbs = { items: [], current: "About" } as never;
    const resolvedPhotos = {
      "photo-page-1": {
        id: "photo-page-1",
      },
    } as never;
    const resolvedPage = {
      id: "about",
      kind: "static",
      slug: "/about",
      label: "About",
      content: {
        header: {
          title: "Resolved About",
          eyebrow: null,
          intro: null,
        },
        content: [],
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
    mockedAppContextCollectPhotoIdsFromBlockContent.mockReturnValue([
      "photo-page-1",
    ]);
    mockedResolvePhotosAppContext.mockResolvedValue(resolvedPhotos);
    mockedResolvePageAppContext.mockReturnValue(resolvedPage);

    const result = await appContextCreate(appState as never, routing, env);

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
    expect(
      mockedAppContextCollectPhotoIdsFromBlockContent,
    ).toHaveBeenCalledWith(pageState.content.content);
    expect(mockedResolvePhotosAppContext).toHaveBeenCalledWith({
      kv: env.KV_PHOTOS,
      photoIds: ["photo-page-1"],
    });
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

    expect(pageContextArg).toEqual({
      photos: resolvedPhotos,
      metadataLabels: appState.metadataLabels,
      resolveInternalLink: expect.any(Function),
      publicPages: appState.getPublicPages,
      routingPagination: null,
    });

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
      canonicalUrl: "https://www.kevinellen.com/about",
      language: "en-GB",
      headAssets: {
        links: [],
      },
      headerBranding: {
        href: "/",
        ariaLabel: "Kevin Ellen home",
        logo: {
          id: "logo-monogram-ke",
          width: 100,
          height: 100,
        },
      },
      preload: [],
      themeColour: "#ffffff",
      metadataLabels,
    });
  });

  it("omits robots when the resolved page source does not include them", async () => {
    const appState = createAppState();

    const routing = {
      kind: "error",
      status: 404,
      pagination: null,
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
        header: {
          title: "404",
          eyebrow: null,
          intro: null,
        },
        content: [],
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

    const result = await appContextCreate(appState as never, routing, env);

    expect(mockedResolvePhotosAppContext).toHaveBeenCalledWith({
      kv: env.KV_PHOTOS,
      photoIds: [],
    });

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
      robots: undefined,
      canonicalUrl: null,
      language: "en-GB",
      headAssets: {
        links: [],
      },
      headerBranding: {
        href: "/",
        ariaLabel: "Kevin Ellen home",
        logo: {
          id: "logo-monogram-ke",
          width: 100,
          height: 100,
        },
      },
      preload: [],
      themeColour: "#ffffff",
      metadataLabels,
    });

    expect(result.inspect.robots).toBeUndefined();
  });

  it("omits metadata and robots when the resolved page source exposes neither", async () => {
    const appState = createAppState();

    const routing = {
      kind: "error",
      status: 500,
      pagination: null,
    } as never;

    const pageState = {
      id: "synthetic-page",
      assets: {
        scripts: [],
        svg: [],
      },
      breadcrumbs: ["home"],
      content: {
        header: {
          title: "Synthetic",
          eyebrow: null,
          intro: null,
        },
        content: [],
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

    const result = await appContextCreate(appState as never, routing, env);

    expect(mockedResolvePhotosAppContext).toHaveBeenCalledWith({
      kv: env.KV_PHOTOS,
      photoIds: [],
    });

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
      metadata: undefined,
      robots: undefined,
      canonicalUrl: null,
      language: "en-GB",
      headAssets: {
        links: [],
      },
      headerBranding: {
        href: "/",
        ariaLabel: "Kevin Ellen home",
        logo: {
          id: "logo-monogram-ke",
          width: 100,
          height: 100,
        },
      },
      preload: [],
      themeColour: "#ffffff",
      metadataLabels,
    });

    expect(result.inspect.metadata).toBeUndefined();
    expect(result.inspect.robots).toBeUndefined();
  });

  it("collects photo ids from listing pages and listed journal pages", async () => {
    const journalPage = {
      id: "journal-entry",
      kind: "journal",
      content: {
        content: [{ kind: "hero", photoId: "journal-photo" }],
      },
    };

    const appState = {
      ...createAppState(),
      getPublicPages: [
        journalPage,
        {
          id: "about",
          kind: "static",
          content: {
            content: [{ kind: "hero", photoId: "ignored-static-photo" }],
          },
        },
      ],
    };

    const routing = {
      kind: "found",
      publicPageId: "journal",
      pagination: null,
    } as never;

    const pageState = {
      id: "journal",
      kind: "listing",
      slug: "/journal",
      metadata: {},
      robots: {},
      assets: { scripts: [], svg: [] },
      breadcrumbs: [],
      content: {
        header: { title: "Journal", eyebrow: null, intro: null },
        content: [{ kind: "hero", photoId: "listing-photo" }],
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
    mockedResolveBreadcrumbsAppContext.mockReturnValue({ items: [] } as never);
    mockedResolvePageAppContext.mockReturnValue({ id: "journal" } as never);

    mockedAppContextCollectPhotoIdsFromBlockContent
      .mockReturnValueOnce(["listing-photo"])
      .mockReturnValueOnce(["journal-photo"]);

    mockedResolvePhotosAppContext.mockResolvedValue({
      "listing-photo": { id: "listing-photo" },
      "journal-photo": { id: "journal-photo" },
    } as never);

    await appContextCreate(appState as never, routing, env);

    expect(
      mockedAppContextCollectPhotoIdsFromBlockContent,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockedAppContextCollectPhotoIdsFromBlockContent,
    ).toHaveBeenNthCalledWith(1, pageState.content.content);
    expect(
      mockedAppContextCollectPhotoIdsFromBlockContent,
    ).toHaveBeenNthCalledWith(2, journalPage.content.content);

    expect(mockedResolvePhotosAppContext).toHaveBeenCalledWith({
      kv: env.KV_PHOTOS,
      photoIds: ["listing-photo", "journal-photo"],
    });
  });

  it("deduplicates collected photo ids before resolving photos", async () => {
    const appState = createAppState();

    const routing = {
      kind: "found",
      publicPageId: "about",
      pagination: null,
    } as never;

    const pageState = {
      id: "about",
      kind: "static",
      slug: "/about",
      metadata: {},
      robots: {},
      assets: { scripts: [], svg: [] },
      breadcrumbs: [],
      content: {
        header: { title: "About", eyebrow: null, intro: null },
        content: [],
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
    mockedResolveBreadcrumbsAppContext.mockReturnValue({ items: [] } as never);
    mockedResolvePageAppContext.mockReturnValue({ id: "about" } as never);
    mockedAppContextCollectPhotoIdsFromBlockContent.mockReturnValue([
      "shared-photo",
      "shared-photo",
      "unique-photo",
    ]);

    await appContextCreate(appState as never, routing, env);

    expect(mockedResolvePhotosAppContext).toHaveBeenCalledWith({
      kv: env.KV_PHOTOS,
      photoIds: ["shared-photo", "unique-photo"],
    });
  });
});
