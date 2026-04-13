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
});
