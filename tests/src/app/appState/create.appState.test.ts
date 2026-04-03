// tests/src/app/appState/create.appState.test.ts

import { AppState } from "@app/appState/class.appState";
import { createAppState } from "@app/appState/create.appState";

import { siteConfig } from "@config/site.config";
import { assetsConfig } from "@config/assets.config";
import { footerConfig } from "@config/footer.config";
import { navigationConfig } from "@config/navigation.config";
import { socialConfig } from "@config/social.config";
import { structuredDataConfig } from "@config/structured-data.config";
import { webManifestConfig } from "@config/webmanifest.config";
import { REDIRECTS } from "@config/redirects.config";
import { GONE_RULES } from "@config/gone.config";

import { homePage } from "@app/pages/public/home.page";
import { error404Page } from "@app/pages/error/404.error.page";

describe("createAppState", () => {
  it("returns an AppState instance", () => {
    const appState = createAppState();

    expect(appState).toBeInstanceOf(AppState);
  });

  it("wires the real config domains into AppState", () => {
    const appState = createAppState();

    expect(appState.getSiteConfig()).toBe(siteConfig);
    expect(appState.getAssetsConfig()).toBe(assetsConfig);
    expect(appState.getFooterConfig()).toBe(footerConfig);
    expect(appState.getNavigationConfig()).toBe(navigationConfig);
    expect(appState.getSocialConfig()).toBe(socialConfig);
    expect(appState.getStructuredDataConfig()).toBe(structuredDataConfig);
    expect(appState.getWebManifestConfig()).toBe(webManifestConfig);
    expect(appState.getRedirectsConfig()).toStrictEqual(REDIRECTS);
    expect(appState.getGoneConfig()).toStrictEqual(GONE_RULES);
  });

  it("supports lookups for the wired pages", () => {
    const appState = createAppState();

    expect(appState.getPublicPageById(homePage.core.id)).toBe(homePage);
    expect(appState.getPageBySlug(homePage.core.slug)).toBe(homePage);
    expect(appState.getErrorPageById(error404Page.core.id)).toBe(error404Page);
    expect(appState.getErrorPageByStatus(error404Page.core.status)).toBe(
      error404Page,
    );
  });

  it("returns frozen nested state from the factory boundary", () => {
    const appState = createAppState();

    expect(Object.isFrozen(appState.getSiteConfig())).toBe(true);
    expect(Object.isFrozen(appState.getAssetsConfig())).toBe(true);
    expect(Object.isFrozen(appState.getFooterConfig())).toBe(true);
    expect(Object.isFrozen(appState.getNavigationConfig())).toBe(true);
    expect(Object.isFrozen(appState.getSocialConfig())).toBe(true);
    expect(Object.isFrozen(appState.getStructuredDataConfig())).toBe(true);
    expect(Object.isFrozen(appState.getWebManifestConfig())).toBe(true);
    expect(Object.isFrozen(appState.getRedirectsConfig())).toBe(true);
    expect(Object.isFrozen(appState.getGoneConfig())).toBe(true);
  });

  it("returns a frozen AppState instance", () => {
    const appState = createAppState();

    expect(Object.isFrozen(appState)).toBe(true);
  });
});
