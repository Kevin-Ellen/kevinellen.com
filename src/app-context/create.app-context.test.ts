// src/app-context/create.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { RoutingResult } from "@request/types/request.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

import { AppContext } from "@app-context/class.app-context";
import { appContextCreate } from "@app-context/create.app-context";

import { appContextResolveNavigation } from "@app-context/resolve/shell/navigation/navigation.resolve.app-context";
import { appContextResolveGlobalFooter } from "@app-context/resolve/shell/footer/global-footer.resolve.app-context";
import { appContextResolvePageSource } from "@app-context/resolve/source.resolve.app-context";
import { appContextResolvePage } from "@app-context/resolve/page.resolve.app-context";
import { appContextResolveAssets } from "@app-context/resolve/assets.resolve.app-context";
import { appContextResolveStructuredData } from "@app-context/resolve/structured-data/structured-data.resolve.app-context";
import { appContextResolveBreadcrumbs } from "@app-context/resolve/breadcrumbs.resolve.app-context";
import { appContextResolveInternalLink } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";
import { appContextCollectPhotoIds } from "@app-context/resolve/page-content/shared/collect-photo-ids.resolve.app-context";
import { appContextResolvePhotos } from "@app-context/resolve/photos/photos.resolve.app-context";

import { HOMEPAGE_STRIP_PHOTO_INDEX_KEY } from "@shared-types/media/photo/indices.photo.types";

jest.mock(
  "@app-context/resolve/shell/navigation/navigation.resolve.app-context",
  () => ({
    appContextResolveNavigation: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/shell/footer/global-footer.resolve.app-context",
  () => ({
    appContextResolveGlobalFooter: jest.fn(),
  }),
);

jest.mock("@app-context/resolve/source.resolve.app-context", () => ({
  appContextResolvePageSource: jest.fn(),
}));

jest.mock("@app-context/resolve/page.resolve.app-context", () => ({
  appContextResolvePage: jest.fn(),
}));

jest.mock("@app-context/resolve/assets.resolve.app-context", () => ({
  appContextResolveAssets: jest.fn(),
}));

jest.mock(
  "@app-context/resolve/structured-data/structured-data.resolve.app-context",
  () => ({
    appContextResolveStructuredData: jest.fn(),
  }),
);

jest.mock("@app-context/resolve/breadcrumbs.resolve.app-context", () => ({
  appContextResolveBreadcrumbs: jest.fn(),
}));

jest.mock(
  "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context",
  () => ({
    appContextResolveInternalLink: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/shared/collect-photo-ids.resolve.app-context",
  () => ({
    appContextCollectPhotoIds: jest.fn(),
  }),
);

jest.mock("@app-context/resolve/photos/photos.resolve.app-context", () => ({
  appContextResolvePhotos: jest.fn(),
}));

describe("appContextCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates AppContext from resolved app state, routing, assets, photos, and page context", async () => {
    const routing: RoutingResult = {
      kind: "found",
      publicPageId: "home",
      pagination: {
        currentPage: 2,
      },
    };

    const pageState = {
      id: "home",
      slug: "/",
      metadata: {
        title: "Home",
        description: "Homepage",
      },
      robots: {
        allowIndex: true,
        allowFollow: true,
      },
      breadcrumbs: ["home"],
      assets: {
        scripts: [],
        svg: [],
      },
      content: {
        content: [],
      },
    };

    const appState = {
      navigation: { header: {}, footer: {} },
      globalFooter: {},
      assets: { scripts: [], svg: [] },
      structuredData: { website: {} },
      siteConfig: {
        origin: "https://example.com",
        language: "en-GB",
        headAssets: {},
        headerBranding: {},
        preload: {},
      },
      manifest: {
        backgroundColor: "#ffffff",
      },
      metadataLabels: {},
      getPublicPages: [],
    } as unknown as AppState;

    const photos = [
      {
        id: "used-photo",
      },
      {
        id: "strip-photo",
      },
    ];

    const navigation = { header: {}, footer: {} };
    const globalFooter = {};
    const assets = { scripts: [], svg: [] };
    const structuredData: readonly AppContextStructuredDataEntry[] = [];
    const breadcrumbs = { items: [], current: "Home" };
    const page = { id: "home" };

    const kv = {
      get: jest.fn().mockResolvedValue({
        photoIds: ["used-photo", "strip-photo"],
      }),
    };

    const env = {
      KV_PHOTOS: kv,
    } as unknown as Env;

    jest
      .mocked(appContextResolveNavigation)
      .mockReturnValue(navigation as never);
    jest
      .mocked(appContextResolveGlobalFooter)
      .mockReturnValue(globalFooter as never);
    jest
      .mocked(appContextResolvePageSource)
      .mockReturnValue(pageState as never);
    jest.mocked(appContextCollectPhotoIds).mockReturnValue(["used-photo"]);
    jest.mocked(appContextResolvePhotos).mockResolvedValue(photos as never);
    jest.mocked(appContextResolveAssets).mockReturnValue(assets as never);
    jest
      .mocked(appContextResolveStructuredData)
      .mockReturnValue(structuredData);
    jest
      .mocked(appContextResolveBreadcrumbs)
      .mockReturnValue(breadcrumbs as never);
    jest.mocked(appContextResolvePage).mockReturnValue(page as never);

    const result = await appContextCreate(appState, routing, env);

    expect(result).toBeInstanceOf(AppContext);

    expect(kv.get).toHaveBeenCalledWith(HOMEPAGE_STRIP_PHOTO_INDEX_KEY, "json");

    expect(appContextResolveNavigation).toHaveBeenCalledWith(
      appState.navigation,
      appState,
    );

    expect(appContextResolveGlobalFooter).toHaveBeenCalledWith(
      appState.globalFooter,
    );

    expect(appContextResolvePageSource).toHaveBeenCalledWith(appState, routing);

    expect(appContextCollectPhotoIds).toHaveBeenCalledWith(
      pageState.content.content,
      {
        publicPages: appState.getPublicPages,
      },
    );

    expect(appContextResolvePhotos).toHaveBeenCalledWith({
      kv,
      photoIds: ["used-photo", "strip-photo"],
    });

    expect(appContextResolveAssets).toHaveBeenCalledWith(
      appState.assets,
      pageState.assets,
    );

    expect(appContextResolveStructuredData).toHaveBeenCalledWith(
      appState,
      pageState,
    );

    expect(appContextResolveBreadcrumbs).toHaveBeenCalledWith(
      pageState.breadcrumbs,
      appState,
    );

    expect(appContextResolvePage).toHaveBeenCalledWith(
      pageState,
      routing,
      expect.objectContaining({
        photos,
        homepageStripPhotoIds: ["strip-photo"],
        metadataLabels: appState.metadataLabels,
        publicPages: appState.getPublicPages,
        currentPageSlug: "/",
        routingPagination: {
          currentPage: 2,
        },
      }),
    );

    const pageContext = jest.mocked(appContextResolvePage).mock.calls[0][2];

    expect(pageContext.resolvePhoto("used-photo")).toBe(photos[0]);
    expect(pageContext.resolvePhoto("missing-photo")).toBeNull();

    const internalLink = {
      kind: "internal",
      id: "journal",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    jest.mocked(appContextResolveInternalLink).mockReturnValue({
      ...internalLink,
      href: "/journal",
      text: "Journal",
    } as never);

    expect(pageContext.resolveInternalLink(internalLink as never)).toEqual({
      ...internalLink,
      href: "/journal",
      text: "Journal",
    });

    expect(appContextResolveInternalLink).toHaveBeenCalledWith(
      internalLink,
      appState,
    );

    expect(result.inspect).toEqual({
      navigation,
      globalFooter,
      assets,
      structuredData,
      breadcrumbs,
      page,
      metadata: pageState.metadata,
      robots: pageState.robots,
      canonicalUrl: "https://example.com/",
      language: "en-GB",
      headAssets: appState.siteConfig.headAssets,
      preload: appState.siteConfig.preload,
      themeColour: appState.manifest.backgroundColor,
      headerBranding: appState.siteConfig.headerBranding,
      metadataLabels: appState.metadataLabels,
    });
  });

  it("uses an empty homepage strip index when the KV index is missing", async () => {
    const routing: RoutingResult = {
      kind: "error",
      status: 404,
    };

    const pageState = {
      slug: null,
      metadata: {},
      robots: null,
      breadcrumbs: ["error-404"],
      assets: {
        scripts: [],
        svg: [],
      },
      content: {
        content: [],
      },
    };

    const appState = {
      navigation: {},
      globalFooter: {},
      assets: { scripts: [], svg: [] },
      siteConfig: {
        origin: "https://example.com",
        language: "en-GB",
        headAssets: {},
        headerBranding: {},
        preload: {},
      },
      manifest: {
        backgroundColor: "#ffffff",
      },
      metadataLabels: {},
      getPublicPages: [],
    } as unknown as AppState;

    const kv = {
      get: jest.fn().mockResolvedValue(null),
    };

    const env = {
      KV_PHOTOS: kv,
    } as unknown as Env;

    jest.mocked(appContextResolveNavigation).mockReturnValue({} as never);
    jest.mocked(appContextResolveGlobalFooter).mockReturnValue({} as never);
    jest
      .mocked(appContextResolvePageSource)
      .mockReturnValue(pageState as never);
    jest.mocked(appContextCollectPhotoIds).mockReturnValue([]);
    jest.mocked(appContextResolvePhotos).mockResolvedValue([]);
    jest.mocked(appContextResolveAssets).mockReturnValue({} as never);
    jest.mocked(appContextResolveStructuredData).mockReturnValue([]);
    jest.mocked(appContextResolveBreadcrumbs).mockReturnValue({} as never);
    jest.mocked(appContextResolvePage).mockReturnValue({} as never);

    const result = await appContextCreate(appState, routing, env);

    expect(appContextResolvePhotos).toHaveBeenCalledWith({
      kv,
      photoIds: [],
    });

    expect(appContextResolvePage).toHaveBeenCalledWith(
      pageState,
      routing,
      expect.objectContaining({
        homepageStripPhotoIds: [],
        currentPageSlug: null,
        routingPagination: null,
      }),
    );

    expect(result.canonicalUrl).toBeNull();
  });
});
