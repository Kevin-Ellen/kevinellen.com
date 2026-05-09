// src/app-state/class.app-state.test.ts

import { AppState } from "@app-state/class.app-state";

import type { AppStateData } from "@app-state/types/app-state.types";

const createAppStateData = (): AppStateData =>
  ({
    siteConfig: { siteName: "Test Site" },
    system: {
      goneRules: [
        {
          path: "/gone",
          reason: "Removed",
        },
      ],
      redirectRules: [
        {
          fromPath: "/old",
          toPath: "/new",
          status: 301,
        },
      ],
    },
    webManifest: { name: "Test Manifest" },
    pages: {
      public: [
        {
          id: "home",
          slug: "/",
          label: "Home",
          status: null,
        },
        {
          id: "draft-like-public-page",
          slug: null,
          label: "No Slug",
          status: null,
        },
      ],
      error: [
        {
          id: "not-found",
          slug: null,
          label: "Not Found",
          status: 404,
        },
        {
          id: "invalid-error-page",
          slug: null,
          label: "Invalid Error",
          status: null,
        },
      ],
    },
    social: { links: [] },
    navigation: { items: [] },
    globalFooter: { sections: [] },
    assets: { svg: [] },
    metadataLabels: {},
    structuredData: {},
  }) as never;

describe("AppState", () => {
  it("exposes source data through getters", () => {
    const data = createAppStateData();
    const appState = new AppState(data);

    expect(appState.siteConfig).toBe(data.siteConfig);
    expect(appState.goneRules).toBe(data.system.goneRules);
    expect(appState.redirectRules).toBe(data.system.redirectRules);
    expect(appState.manifest).toBe(data.webManifest);
    expect(appState.publicPages).toBe(data.pages.public);
    expect(appState.errorPages).toBe(data.pages.error);
    expect(appState.social).toBe(data.social);
    expect(appState.navigation).toBe(data.navigation);
    expect(appState.globalFooter).toBe(data.globalFooter);
    expect(appState.assets).toBe(data.assets);
    expect(appState.metadataLabels).toBe(data.metadataLabels);
    expect(appState.structuredData).toBe(data.structuredData);
    expect(appState.getPublicPages).toBe(data.pages.public);
    expect(appState.inspect).toBe(data);
  });

  it("resolves gone and redirect rules by path", () => {
    const data = createAppStateData();
    const appState = new AppState(data);

    expect(appState.getGoneRuleByPath("/gone")).toBe(data.system.goneRules[0]);
    expect(appState.getGoneRuleByPath("/missing")).toBeNull();

    expect(appState.getRedirectRuleByPath("/old")).toBe(
      data.system.redirectRules[0],
    );
    expect(appState.getRedirectRuleByPath("/missing")).toBeNull();
  });

  it("resolves only public pages with slugs by id and slug", () => {
    const data = createAppStateData();
    const appState = new AppState(data);

    expect(appState.getPublicPageById("home" as never)).toBe(
      data.pages.public[0],
    );
    expect(appState.getPublicPageBySlug("/")).toBe(data.pages.public[0]);

    expect(
      appState.getPublicPageById("draft-like-public-page" as never),
    ).toBeNull();
    expect(appState.getPublicPageBySlug("/missing")).toBeNull();
  });

  it("resolves only error pages with statuses by id and status", () => {
    const data = createAppStateData();
    const appState = new AppState(data);

    expect(appState.getErrorPageById("not-found" as never)).toBe(
      data.pages.error[0],
    );
    expect(appState.getErrorPageByStatus(404)).toBe(data.pages.error[0]);

    expect(appState.getErrorPageById("invalid-error-page" as never)).toBeNull();
    expect(appState.getErrorPageByStatus(500)).toBeNull();
  });
});
