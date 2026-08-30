// src/app-state/create.app-state.test.ts

import { AppState } from "@app-state/class.app-state";
import { appStateCreate } from "@app-state/create.app-state";

import { appStateResolveSiteConfig } from "@app-state/resolve/site-config.resolve.app-state";
import { appStateResolveWebmanifest } from "@app-state/resolve/webmanifest.resolve.app-state";
import { appStateResolveGlobalFooter } from "@app-state/resolve/page-content/site/global-footer.resolve.app-state";
import { appStateResolveStructuredData } from "@app-state/resolve/structured-data.resolve.app-state";
import { appStateResolvePages } from "@app-state/resolve/pages.resolve.app-state";
import { authoredSocial } from "@app-state/config/social/authored.social.app-state";

jest.mock("@app-state/resolve/site-config.resolve.app-state", () => ({
  appStateResolveSiteConfig: jest.fn(),
}));

jest.mock("@app-state/resolve/webmanifest.resolve.app-state", () => ({
  appStateResolveWebmanifest: jest.fn(),
}));

jest.mock(
  "@app-state/resolve/page-content/site/global-footer.resolve.app-state",
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

describe("appStateCreate", () => {
  const mockedAppStateResolveSiteConfig = jest.mocked(
    appStateResolveSiteConfig,
  );

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates AppState from resolved app-state data", async () => {
    const env = {
      KV_JOURNALS: "kv-journals",
      KV_NOTES: "kv-notes",
    } as unknown as Env;

    const siteConfig = { id: "site-config" };
    const webManifest = { id: "web-manifest" };
    const globalFooter = { id: "global-footer" };
    const structuredData = { id: "structured-data" };

    const pages = {
      public: [],
      error: [],
    };

    mockedAppStateResolveSiteConfig.mockReturnValue(siteConfig as never);

    mockedAppStateResolveWebmanifest.mockReturnValue(webManifest as never);

    mockedAppStateResolveGlobalFooter.mockReturnValue(globalFooter as never);

    mockedAppStateResolveStructuredData.mockReturnValue(
      structuredData as never,
    );

    mockedAppStateResolvePages.mockResolvedValue(pages as never);

    const result = await appStateCreate(env);

    expect(result).toBeInstanceOf(AppState);

    expect(mockedAppStateResolveSiteConfig).toHaveBeenCalledWith(env);

    expect(mockedAppStateResolveWebmanifest).toHaveBeenCalledWith(siteConfig);

    expect(mockedAppStateResolveGlobalFooter).toHaveBeenCalledWith(siteConfig);

    expect(mockedAppStateResolveStructuredData).toHaveBeenCalledWith(
      siteConfig,
      authoredSocial,
    );

    expect(mockedAppStateResolvePages).toHaveBeenCalledWith({
      journalKv: env.KV_JOURNALS,
      notesKv: env.KV_NOTES,
    });

    expect(result.inspect).toEqual({
      siteConfig,
      webManifest,
      system: expect.anything(),
      assets: expect.anything(),
      globalFooter,
      social: expect.anything(),
      metadataLabels: expect.anything(),
      imageDelivery: expect.anything(),
      navigation: expect.anything(),
      structuredData,
      pages,
    });
  });
});
