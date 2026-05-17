// src/app-state/resolve/site-config.resolve.app-state.test.ts

import { appStateResolveSiteConfig } from "@app-state/resolve/site-config.resolve.app-state";
import { appStateSiteConfigAuthored } from "@app-state/config/site-config/authored.site-config.app-state";

describe("appStateResolveSiteConfig", () => {
  it("resolves host, origin, and preload defaults", () => {
    expect(
      appStateResolveSiteConfig({
        APP_HOST: "example.com",
      } as unknown as Env),
    ).toEqual({
      ...appStateSiteConfigAuthored,
      preload: appStateSiteConfigAuthored.preload ?? [],
      host: "example.com",
      origin: "https://example.com",
    });
  });

  it("throws when APP_HOST is missing", () => {
    expect(() => appStateResolveSiteConfig({} as unknown as Env)).toThrow(
      "AppState site config: APP_HOST is not set.",
    );
  });

  it("throws when APP_HOST is empty", () => {
    expect(() =>
      appStateResolveSiteConfig({
        APP_HOST: "",
      } as unknown as Env),
    ).toThrow("AppState site config: APP_HOST is not set.");
  });

  it("defaults preload to an empty array when preload is undefined", () => {
    jest.resetModules();

    jest.doMock(
      "@app-state/config/site-config/authored.site-config.app-state",
      () => ({
        appStateSiteConfigAuthored: {
          siteName: "Test",
          description: "Test description",
          language: "en-GB",
          headerBranding: {
            homeHref: "/",
          },
        },
      }),
    );

    const {
      appStateResolveSiteConfig: resolveSiteConfig,
    } = require("@app-state/resolve/site-config.resolve.app-state");

    expect(
      resolveSiteConfig({
        APP_HOST: "example.com",
      }),
    ).toMatchObject({
      preload: [],
    });
  });
});
