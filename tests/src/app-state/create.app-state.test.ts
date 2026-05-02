// tests/src/app-state/create.app-state.test.ts

jest.mock("@app-state/resolve/site-config.resolve.app-state", () => ({
  appStateResolveSiteConfig: jest.fn(),
}));

jest.mock("@app-state/resolve/webmanifest.resolve.app-state", () => ({
  appStateResolveWebmanifest: jest.fn(),
}));

jest.mock(
  "@app-state/resolve/page-content/global-footer.resolve.app-state",
  () => ({
    appStateResolveGlobalFooter: jest.fn(),
  }),
);

jest.mock("@app-state/resolve/structured-data.resolve.app-state", () => ({
  appStateResolveStructuredData: jest.fn(),
}));

jest.mock("@app-state/resolve/pages.resolve.app-state", () => ({
  appStateResolvePages: jest.fn(),
}));

import { appStateResolveSiteConfig } from "@app-state/resolve/site-config.resolve.app-state";
import { appStateResolveWebmanifest } from "@app-state/resolve/webmanifest.resolve.app-state";
import { appStateResolveSystem } from "@app-state/resolve/system.resolve.app-state";
import { appStateResolveAssets } from "@app-state/resolve/assets.resolve.app-state";
import { appStateResolveGlobalFooter } from "@app-state/resolve/page-content/global-footer.resolve.app-state";
import { appStateResolveSocial } from "@app-state/resolve/social.resolve.app-state";
import { appStateResolveMetadataLabels } from "@app-state/resolve/metadata-labels.resolve.app-state";
import { appStateResolveNavigation } from "@app-state/resolve/navigation.resolve.app-state";
import { appStateResolveStructuredData } from "@app-state/resolve/structured-data.resolve.app-state";
import { appStateResolvePages } from "@app-state/resolve/pages.resolve.app-state";

import { appStateCreate } from "@app-state/create.app-state";

const mockedAppStateResolveSiteConfig = jest.mocked(appStateResolveSiteConfig);
const mockedAppStateResolveWebmanifest = jest.mocked(
  appStateResolveWebmanifest,
);
const mockedAppStateResolveGlobalFooter = jest.mocked(
  appStateResolveGlobalFooter,
);
const mockedAppStateResolveStructuredData = jest.mocked(
  appStateResolveStructuredData,
);
const mockedAppStateResolvePages = jest.mocked(appStateResolvePages);

const makeKv = (): KVNamespace =>
  ({
    list: jest.fn().mockResolvedValue({ keys: [] }),
    get: jest.fn(),
  }) as unknown as KVNamespace;

const makeEnv = (overrides: Partial<Env> = {}): Env =>
  ({
    APP_HOST: "kevinellen.com",
    KV_JOURNALS: makeKv(),
    ...overrides,
  }) as unknown as Env;

describe("appStateCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedAppStateResolvePages.mockResolvedValue({
      public: [],
      error: [],
    } as never);
  });

  it("creates an AppState from resolved AppState parts", async () => {
    const env = makeEnv();

    const siteConfig = {
      siteName: "Kevin Ellen",
      origin: "https://kevinellen.com",
      description: "Description",
      language: "en-GB",
      headerBranding: {
        homeHref: "/",
      },
    } as never;

    const webManifest = {
      name: "Kevin Ellen",
    } as never;

    const globalFooter = {
      affiliations: {
        kind: "affiliations",
      },
      colophon: {
        kind: "colophon",
      },
    } as never;

    const structuredData = {
      website: {
        name: "Kevin Ellen",
      },
    } as never;

    const pages = {
      public: [],
      error: [],
    } as never;

    mockedAppStateResolveSiteConfig.mockReturnValue(siteConfig);
    mockedAppStateResolveWebmanifest.mockReturnValue(webManifest);
    mockedAppStateResolveGlobalFooter.mockReturnValue(globalFooter);
    mockedAppStateResolveStructuredData.mockReturnValue(structuredData);
    mockedAppStateResolvePages.mockResolvedValue(pages);

    const result = await appStateCreate(env);

    expect(mockedAppStateResolveSiteConfig).toHaveBeenCalledWith(env);
    expect(mockedAppStateResolveWebmanifest).toHaveBeenCalledWith(siteConfig);
    expect(mockedAppStateResolveGlobalFooter).toHaveBeenCalledWith(siteConfig);
    expect(mockedAppStateResolveStructuredData).toHaveBeenCalledWith(
      siteConfig,
    );
    expect(mockedAppStateResolvePages).toHaveBeenCalledWith({
      kv: env.KV_JOURNALS,
    });

    expect(result.inspect).toEqual({
      siteConfig,
      webManifest,
      system: appStateResolveSystem,
      assets: appStateResolveAssets,
      globalFooter,
      social: appStateResolveSocial,
      metadataLabels: appStateResolveMetadataLabels,
      navigation: appStateResolveNavigation,
      structuredData,
      pages,
    });
  });

  it("returns an AppState instance", async () => {
    const env = makeEnv();

    mockedAppStateResolveSiteConfig.mockReturnValue({
      siteName: "Kevin Ellen",
      origin: "https://kevinellen.com",
      description: "Description",
      language: "en-GB",
      headerBranding: {
        homeHref: "/",
      },
    } as never);

    mockedAppStateResolveWebmanifest.mockReturnValue({} as never);
    mockedAppStateResolveGlobalFooter.mockReturnValue({} as never);
    mockedAppStateResolveStructuredData.mockReturnValue({} as never);

    const result = await appStateCreate(env);

    expect(result.constructor.name).toBe("AppState");
  });
});
