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

const mockedAppStateResolveSiteConfig =
  appStateResolveSiteConfig as jest.MockedFunction<
    typeof appStateResolveSiteConfig
  >;

const mockedAppStateResolveWebmanifest =
  appStateResolveWebmanifest as jest.MockedFunction<
    typeof appStateResolveWebmanifest
  >;

const mockedAppStateResolveGlobalFooter =
  appStateResolveGlobalFooter as jest.MockedFunction<
    typeof appStateResolveGlobalFooter
  >;

const mockedAppStateResolveStructuredData =
  appStateResolveStructuredData as jest.MockedFunction<
    typeof appStateResolveStructuredData
  >;

describe("appStateCreate", () => {
  const makeEnv = (overrides: Partial<Env> = {}): Env =>
    ({
      APP_HOST: "kevinellen.com",
      ...overrides,
    }) as unknown as Env;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates an AppState from resolved AppState parts", () => {
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

    mockedAppStateResolveSiteConfig.mockReturnValue(siteConfig);
    mockedAppStateResolveWebmanifest.mockReturnValue(webManifest);
    mockedAppStateResolveGlobalFooter.mockReturnValue(globalFooter);
    mockedAppStateResolveStructuredData.mockReturnValue(structuredData);

    const result = appStateCreate(env);

    expect(mockedAppStateResolveSiteConfig).toHaveBeenCalledWith(env);
    expect(mockedAppStateResolveWebmanifest).toHaveBeenCalledWith(siteConfig);
    expect(mockedAppStateResolveGlobalFooter).toHaveBeenCalledWith(siteConfig);
    expect(mockedAppStateResolveStructuredData).toHaveBeenCalledWith(
      siteConfig,
    );

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
      pages: appStateResolvePages,
    });
  });

  it("returns an AppState instance", () => {
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

    mockedAppStateResolveSiteConfig.mockReturnValue(siteConfig);
    mockedAppStateResolveWebmanifest.mockReturnValue({} as never);
    mockedAppStateResolveGlobalFooter.mockReturnValue({} as never);
    mockedAppStateResolveStructuredData.mockReturnValue({} as never);

    const result = appStateCreate(env);

    expect(result.constructor.name).toBe("AppState");
  });
});
