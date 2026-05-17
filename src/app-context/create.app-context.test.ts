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

const createAppState = (): AppState =>
  ({
    navigation: { header: {}, footer: {} },
    globalFooter: {},
    assets: { scripts: [], svg: [] },
    structuredData: { website: {} },
    siteConfig: {
      siteName: "Kevin Ellen",
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
    imageDelivery: {},
    getPublicPages: [],
  }) as unknown as AppState;

type TestPageState = Readonly<{
  id: string;
  slug: "/" | `/${string}` | null;
  metadata: Record<string, unknown>;
  socialPreview: Record<string, unknown> | null;
  robots: Record<string, unknown> | null;
  breadcrumbs: readonly string[];
  assets: {
    scripts: readonly unknown[];
    svg: readonly unknown[];
  };
  content: {
    content: readonly unknown[];
  };
}>;

const createPageState = (
  overrides: Partial<TestPageState> = {},
): TestPageState => ({
  id: "home",
  slug: "/",
  metadata: {
    pageTitle: "Home | Kevin Ellen",
    metaDescription: "Homepage",
  },
  socialPreview: {
    openGraphType: "website",
    image: null,
    title: "Home | Kevin Ellen",
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
  ...overrides,
});

const setupCommonMocks = ({
  pageState = createPageState(),
  photoIds = ["used-photo"],
  photos = [{ id: "used-photo" }, { id: "strip-photo" }],
  homepageStripPhotoIds = ["used-photo", "strip-photo"],
  page = { id: "home" },
}: Readonly<{
  pageState?: Record<string, unknown>;
  photoIds?: readonly string[];
  photos?: readonly Record<string, unknown>[];
  homepageStripPhotoIds?: readonly string[] | null;
  page?: Record<string, unknown>;
}> = {}) => {
  const navigation = { header: {}, footer: {} };
  const globalFooter = {};
  const assets = { scripts: [], svg: [] };
  const structuredData: readonly AppContextStructuredDataEntry[] = [];
  const breadcrumbs = { items: [], current: "Home" };

  const kv = {
    get: jest.fn().mockResolvedValue(
      homepageStripPhotoIds === null
        ? null
        : {
            photoIds: homepageStripPhotoIds,
          },
    ),
  };

  const env = {
    KV_PHOTOS: kv,
  } as unknown as Env;

  jest.mocked(appContextResolveNavigation).mockReturnValue(navigation as never);
  jest
    .mocked(appContextResolveGlobalFooter)
    .mockReturnValue(globalFooter as never);
  jest.mocked(appContextResolvePageSource).mockReturnValue(pageState as never);
  jest.mocked(appContextCollectPhotoIds).mockReturnValue(photoIds);
  jest.mocked(appContextResolvePhotos).mockResolvedValue(photos as never);
  jest.mocked(appContextResolveAssets).mockReturnValue(assets as never);
  jest.mocked(appContextResolveStructuredData).mockReturnValue(structuredData);
  jest
    .mocked(appContextResolveBreadcrumbs)
    .mockReturnValue(breadcrumbs as never);
  jest.mocked(appContextResolvePage).mockReturnValue(page as never);

  return {
    navigation,
    globalFooter,
    assets,
    structuredData,
    breadcrumbs,
    kv,
    env,
    page,
    photos,
  };
};

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

    const appState = createAppState();
    const pageState = createPageState();

    const {
      navigation,
      globalFooter,
      assets,
      structuredData,
      breadcrumbs,
      kv,
      env,
      page,
      photos,
    } = setupCommonMocks({ pageState });

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
        imageDelivery: appState.imageDelivery,
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
      socialPreview: {
        openGraphType: "website",
        image: "https://example.com/media/photo/used-photo/1200/630",
        imageWidth: 1200,
        imageHeight: 630,
        siteName: "Kevin Ellen",
        title: "Home | Kevin Ellen",
        description: "Homepage",
        url: "https://example.com/",
      },
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

  it("uses explicit relative social preview images before inheriting page photos", async () => {
    const routing: RoutingResult = {
      kind: "found",
      publicPageId: "home",
      pagination: null,
    };

    const appState = createAppState();
    const pageState = createPageState({
      socialPreview: {
        openGraphType: "website",
        image: "/assets/social/custom-card.jpg",
        title: "Home | Kevin Ellen",
        description: "Homepage",
      },
    });

    const { env } = setupCommonMocks({ pageState });

    const result = await appContextCreate(appState, routing, env);

    expect(result.socialPreview).toEqual({
      openGraphType: "website",
      image: "https://example.com/assets/social/custom-card.jpg",
      imageWidth: 1200,
      imageHeight: 630,
      siteName: "Kevin Ellen",
      title: "Home | Kevin Ellen",
      description: "Homepage",
      url: "https://example.com/",
    });
  });

  it("uses explicit absolute social preview images as-is", async () => {
    const routing: RoutingResult = {
      kind: "found",
      publicPageId: "home",
      pagination: null,
    };

    const appState = createAppState();
    const pageState = createPageState({
      socialPreview: {
        openGraphType: "website",
        image: "https://cdn.example.com/custom-card.jpg",
        title: "Home | Kevin Ellen",
        description: "Homepage",
      },
    });

    const { env } = setupCommonMocks({ pageState });

    const result = await appContextCreate(appState, routing, env);

    expect(result.socialPreview).toEqual({
      openGraphType: "website",
      image: "https://cdn.example.com/custom-card.jpg",
      imageWidth: 1200,
      imageHeight: 630,
      siteName: "Kevin Ellen",
      title: "Home | Kevin Ellen",
      description: "Homepage",
      url: "https://example.com/",
    });
  });

  it("keeps social preview image null when the inherited photo cannot be resolved", async () => {
    const routing: RoutingResult = {
      kind: "found",
      publicPageId: "home",
      pagination: null,
    };

    const appState = createAppState();
    const pageState = createPageState();

    const { env } = setupCommonMocks({
      pageState,
      photoIds: ["missing-photo"],
      photos: [],
      homepageStripPhotoIds: [],
    });

    const result = await appContextCreate(appState, routing, env);

    expect(result.socialPreview).toEqual({
      openGraphType: "website",
      image: null,
      imageWidth: null,
      imageHeight: null,
      siteName: "Kevin Ellen",
      title: "Home | Kevin Ellen",
      description: "Homepage",
      url: "https://example.com/",
    });
  });

  it("uses an empty homepage strip index when the KV index is missing", async () => {
    const routing: RoutingResult = {
      kind: "error",
      status: 404,
    };

    const appState = createAppState();
    const pageState = createPageState({
      slug: null,
      metadata: {},
      socialPreview: null,
      robots: null,
      breadcrumbs: ["error-404"],
    });

    const { env, kv } = setupCommonMocks({
      pageState,
      photoIds: [],
      photos: [],
      homepageStripPhotoIds: null,
      page: {},
    });

    const result = await appContextCreate(appState, routing, env);

    expect(kv.get).toHaveBeenCalledWith(HOMEPAGE_STRIP_PHOTO_INDEX_KEY, "json");

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
    expect(result.socialPreview).toBeNull();
  });
});
