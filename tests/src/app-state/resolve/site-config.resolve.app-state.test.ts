// tests/src/app-state/resolve/site-config.resolve.app-state.test.ts

import { appStateResolveSiteConfig } from "@app-state/resolve/site-config.resolve.app-state";
import { appStateSiteConfigAuthored } from "@app-state/config/site-config/authored.site-config.app-state";

describe("appStateResolveSiteConfig", () => {
  const makeEnv = (overrides: Partial<Env> = {}): Env =>
    ({
      APP_HOST: "kevinellen.com",
      ...overrides,
    }) as unknown as Env;

  it("throws when APP_HOST is not set", () => {
    expect(() =>
      appStateResolveSiteConfig(makeEnv({ APP_HOST: undefined })),
    ).toThrow("AppState site config: APP_HOST is not set.");
  });

  it("resolves host and origin from APP_HOST", () => {
    const result = appStateResolveSiteConfig(
      makeEnv({
        APP_HOST: "kevinellen.com",
      }),
    );

    expect(result).toEqual({
      ...appStateSiteConfigAuthored,
      preload: appStateSiteConfigAuthored.preload ?? [],
      host: "kevinellen.com",
      origin: "https://kevinellen.com",
    });
  });

  it("preserves authored site config values", () => {
    const result = appStateResolveSiteConfig(
      makeEnv({
        APP_HOST: "kevinellen.com",
      }),
    );

    expect(result.siteName).toBe(appStateSiteConfigAuthored.siteName);
    expect(result.language).toBe(appStateSiteConfigAuthored.language);
    expect(result.description).toBe(appStateSiteConfigAuthored.description);
  });

  it("returns a deeply frozen site config", () => {
    const result = appStateResolveSiteConfig(
      makeEnv({
        APP_HOST: "kevinellen.com",
      }),
    );

    expect(Object.isFrozen(result)).toBe(true);
  });

  it("defaults preload to an empty array when authored preload is missing", () => {
    const result = appStateResolveSiteConfig(
      makeEnv({
        APP_HOST: "kevinellen.com",
      }),
    );

    expect(result.preload).toEqual(appStateSiteConfigAuthored.preload ?? []);
  });

  it("deeply freezes nested site config values", () => {
    const result = appStateResolveSiteConfig(makeEnv());

    expect(Object.isFrozen(result.headerBranding)).toBe(true);
    expect(Object.isFrozen(result.headAssets)).toBe(true);
    expect(Object.isFrozen(result.assets)).toBe(true);
    expect(Object.isFrozen(result.preload)).toBe(true);
  });

  it("defaults preload to an empty array when authored preload is undefined", () => {
    jest.isolateModules(() => {
      jest.doMock(
        "@app-state/config/site-config/authored.site-config.app-state",
        () => ({
          appStateSiteConfigAuthored: {
            siteName: "Kevin Ellen",
            author: "Kevin Ellen",
            language: "en-GB",
            description: "Test description",
            headerBranding: {},
            headAssets: {},
            assets: {
              scripts: [],
              svgs: [],
            },
            preload: undefined,
          },
        }),
      );

      const {
        appStateResolveSiteConfig,
      } = require("@app-state/resolve/site-config.resolve.app-state");

      const result = appStateResolveSiteConfig({
        APP_HOST: "kevinellen.com",
      } as Env);

      expect(result.preload).toEqual([]);
    });
  });
});
