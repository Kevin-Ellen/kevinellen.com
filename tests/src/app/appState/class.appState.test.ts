// tests/src/app/appState/class.appState.test.ts

import { AppState } from "@app/appState/class.appState";

import { homePage } from "@app/pages/public/home.page";
import { error404Page } from "@app/pages/error/404.error.page";

import type {
  ErrorPageDefinition,
  PageDefinition,
} from "@app/pages/page.definition";

import { createAppStateConfig } from "@tests/helpers/appState/create.config.appState";

const createPublicPage = (
  coreOverrides: Partial<PageDefinition["core"]>,
): PageDefinition => ({
  ...homePage,
  core: {
    ...homePage.core,
    ...coreOverrides,
  },
});

const createErrorPage = (
  coreOverrides: Partial<ErrorPageDefinition["core"]>,
): ErrorPageDefinition => ({
  ...error404Page,
  core: {
    ...error404Page.core,
    ...coreOverrides,
  },
});

describe("AppState", () => {
  describe("config getters", () => {
    it("returns the stored config domains", () => {
      const config = createAppStateConfig({
        publicPages: [homePage],
        errorPages: [error404Page],
      });

      const appState = new AppState(config);

      expect(appState.getSiteConfig()).toBe(config.siteConfig);
      expect(appState.getAssetsConfig()).toBe(config.assetsConfig);
      expect(appState.getFooterConfig()).toBe(config.footerConfig);
      expect(appState.getNavigationConfig()).toBe(config.navigationConfig);
      expect(appState.getSocialConfig()).toBe(config.socialConfig);
      expect(appState.getStructuredDataConfig()).toBe(
        config.structuredDataConfig,
      );
      expect(appState.getWebManifestConfig()).toBe(config.webManifestConfig);
      expect(appState.getRedirectsConfig()).toBe(config.redirectsConfig);
      expect(appState.getGoneConfig()).toBe(config.goneConfig);
    });
  });

  describe("page lookups", () => {
    it("returns a public page by id", () => {
      const publicPage = createPublicPage({
        id: "journal",
        label: "Journal",
        kind: "listing",
        slug: "/journal",
      });

      const appState = new AppState(
        createAppStateConfig({
          publicPages: [publicPage],
          errorPages: [error404Page],
        }),
      );

      expect(appState.getPublicPageById("journal")).toBe(publicPage);
    });

    it("returns a public page by slug", () => {
      const publicPage = createPublicPage({
        id: "about",
        label: "About",
        kind: "static",
        slug: "/about",
      });

      const appState = new AppState(
        createAppStateConfig({
          publicPages: [publicPage],
          errorPages: [error404Page],
        }),
      );

      expect(appState.getPageBySlug("/about")).toBe(publicPage);
    });

    it("returns an error page by id", () => {
      const errorPage = createErrorPage({
        id: "error-500",
        label: "Server Error",
        status: 500,
      });

      const appState = new AppState(
        createAppStateConfig({
          publicPages: [homePage],
          errorPages: [errorPage],
        }),
      );

      expect(appState.getErrorPageById("error-500")).toBe(errorPage);
    });

    it("returns an error page by status", () => {
      const errorPage = createErrorPage({
        id: "error-410",
        label: "Gone",
        status: 410,
      });

      const appState = new AppState(
        createAppStateConfig({
          publicPages: [homePage],
          errorPages: [errorPage],
        }),
      );

      expect(appState.getErrorPageByStatus(410)).toBe(errorPage);
    });

    it("returns null when a public page id does not exist", () => {
      const appState = new AppState(
        createAppStateConfig({
          publicPages: [homePage],
          errorPages: [error404Page],
        }),
      );

      expect(appState.getPublicPageById("missing")).toBeNull();
    });

    it("returns null when a slug does not exist", () => {
      const appState = new AppState(
        createAppStateConfig({
          publicPages: [homePage],
          errorPages: [error404Page],
        }),
      );

      expect(appState.getPageBySlug("/missing")).toBeNull();
    });

    it("returns null when an error page id does not exist", () => {
      const appState = new AppState(
        createAppStateConfig({
          publicPages: [homePage],
          errorPages: [error404Page],
        }),
      );

      expect(appState.getErrorPageById("missing-error")).toBeNull();
    });

    it("returns null when an error page status does not exist", () => {
      const appState = new AppState(
        createAppStateConfig({
          publicPages: [homePage],
          errorPages: [error404Page],
        }),
      );

      expect(appState.getErrorPageByStatus(500)).toBeNull();
    });
  });

  describe("duplicate guards", () => {
    it("throws when public page ids are duplicated", () => {
      expect(
        () =>
          new AppState(
            createAppStateConfig({
              publicPages: [
                createPublicPage({
                  id: "dup",
                  label: "One",
                  kind: "home",
                  slug: "/",
                }),
                createPublicPage({
                  id: "dup",
                  label: "Two",
                  kind: "static",
                  slug: "/two",
                }),
              ],
              errorPages: [error404Page],
            }),
          ),
      ).toThrow("Duplicate public page id: dup");
    });

    it("throws when public page slugs are duplicated", () => {
      expect(
        () =>
          new AppState(
            createAppStateConfig({
              publicPages: [
                createPublicPage({
                  id: "one",
                  label: "One",
                  kind: "home",
                  slug: "/dup",
                }),
                createPublicPage({
                  id: "two",
                  label: "Two",
                  kind: "static",
                  slug: "/dup",
                }),
              ],
              errorPages: [error404Page],
            }),
          ),
      ).toThrow("Duplicate public page slug: /dup");
    });

    it("throws when error page ids are duplicated", () => {
      expect(
        () =>
          new AppState(
            createAppStateConfig({
              publicPages: [homePage],
              errorPages: [
                createErrorPage({
                  id: "dup-error",
                  label: "404",
                  status: 404,
                }),
                createErrorPage({
                  id: "dup-error",
                  label: "500",
                  status: 500,
                }),
              ],
            }),
          ),
      ).toThrow("Duplicate error page id: dup-error");
    });

    it("throws when error page statuses are duplicated", () => {
      expect(
        () =>
          new AppState(
            createAppStateConfig({
              publicPages: [homePage],
              errorPages: [
                createErrorPage({
                  id: "error-a",
                  label: "404 A",
                  status: 404,
                }),
                createErrorPage({
                  id: "error-b",
                  label: "404 B",
                  status: 404,
                }),
              ],
            }),
          ),
      ).toThrow("Duplicate error page status: 404");
    });
  });

  describe("instance immutability", () => {
    it("freezes the app state instance", () => {
      const appState = new AppState(
        createAppStateConfig({
          publicPages: [homePage],
          errorPages: [error404Page],
        }),
      );

      expect(Object.isFrozen(appState)).toBe(true);
    });
  });
});
