// tests/src/app/appState/appState.app.test.ts

import type { AppStateSeed } from "@app/appState/appState.types";

import { AppState } from "@app/appState/appState";

import { siteConfig } from "@config/site.config";
import { navigationConfig } from "@config/navigation.config";
import { socialConfig } from "@config/social.config";
import { structuredDataConfig } from "@config/structured-data.config";
import { assetsConfig } from "@config/assets.config";
import { footerConfig } from "@config/footer.config";
import { webManifestConfig } from "@config/webmanifest.config";

describe("AppState", () => {
  const createSeed = (): AppStateSeed => ({
    site: siteConfig,
    navigation: navigationConfig,
    social: socialConfig,
    structuredData: structuredDataConfig,
    assets: assetsConfig,
    footer: footerConfig,
    webmanifest: webManifestConfig,
  });

  it("returns the seeded site config", () => {
    const seed = createSeed();
    const appState = new AppState(seed);

    expect(appState.getSiteConfig()).toBe(seed.site);
  });

  it("returns the seeded navigation config", () => {
    const seed = createSeed();
    const appState = new AppState(seed);

    expect(appState.getNavigationConfig()).toBe(seed.navigation);
  });

  it("returns the seeded social config", () => {
    const seed = createSeed();
    const appState = new AppState(seed);

    expect(appState.getSocialConfig()).toBe(seed.social);
  });

  it("returns the seeded structured data config", () => {
    const seed = createSeed();
    const appState = new AppState(seed);

    expect(appState.getStructuredDataConfig()).toBe(seed.structuredData);
  });

  it("returns the seeded assets config", () => {
    const seed = createSeed();
    const appState = new AppState(seed);

    expect(appState.getAssetsConfig()).toBe(seed.assets);
  });

  it("returns the seeded footer config", () => {
    const seed = createSeed();
    const appState = new AppState(seed);

    expect(appState.getFooterConfig()).toBe(seed.footer);
  });

  it("returns the seeded webmanifest config", () => {
    const seed = createSeed();
    const appState = new AppState(seed);

    expect(appState.getWebManifestConfig()).toBe(seed.webmanifest);
  });

  it("returns the original seed from toJSON", () => {
    const seed = createSeed();
    const appState = new AppState(seed);

    expect(appState.toJSON()).toBe(seed);
  });
});
