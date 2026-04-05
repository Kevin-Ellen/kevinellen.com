// tests/src/app/appContext/resolvers/canonical.resolve.appContext.test.ts

import { resolveCanonicalUrl } from "@app/appContext/resolvers/canonical.resolve.appContext";

import { journalListingPage } from "@app/content/pages/public/journal-listing.public.page";
import { notFoundErrorPage } from "@app/content/pages/error/404.error.page";

const createEnv = (overrides: Partial<Env> = {}): Env =>
  ({
    APP_ENV: "stg",
    APP_HOST: "stg.kevinellen.com",
    ...overrides,
  }) as Env;

describe("resolveCanonicalUrl", () => {
  it("returns the canonical url for a public page when canonical is enabled", () => {
    const env = createEnv({
      APP_ENV: "stg",
      APP_HOST: "stg.kevinellen.com",
    });

    const result = resolveCanonicalUrl(env, journalListingPage);

    expect(result).toBe("https://stg.kevinellen.com/journal");
  });

  it("returns the canonical url even when canonical redirect is disabled", () => {
    const env = createEnv({
      APP_ENV: "dev",
      APP_HOST: "dev.kevinellen.com",
    });

    const result = resolveCanonicalUrl(env, journalListingPage);

    expect(result).toBe("https://dev.kevinellen.com/journal");
  });

  it("returns null for an error page", () => {
    const env = createEnv({
      APP_ENV: "prod",
      APP_HOST: "kevinellen.com",
    });

    const result = resolveCanonicalUrl(env, notFoundErrorPage);

    expect(result).toBeNull();
  });

  it("throws when canonical is enabled but canonical host is missing", () => {
    const env = createEnv({
      APP_ENV: "prod",
      APP_HOST: undefined,
    });

    expect(() => resolveCanonicalUrl(env, journalListingPage)).toThrow(
      "Runtime canonical host is required when canonical is enabled",
    );
  });
});
