// src/app-context/class.app-context.test.ts

import type { AppContextData } from "@app-context/app-context.types";

import { AppContext } from "@app-context/class.app-context";

describe("AppContext", () => {
  it("exposes app context data through getters", () => {
    const data = {
      metadata: { title: "Page title", description: "Page description" },
      robots: { allowIndex: true, allowFollow: true },
      language: "en-GB",
      canonicalUrl: "https://example.com/page",
      navigation: { header: {}, footer: {} },
      globalFooter: {},
      structuredData: [],
      assets: { scripts: [], svg: [] },
      headAssets: {},
      themeColour: {},
      headerBranding: {},
      breadcrumbs: { items: [], current: "Current" },
      page: {},
      preload: {},
      metadataLabels: {},
    } as unknown as AppContextData;

    const appContext = new AppContext(data);

    expect(appContext.metadata).toBe(data.metadata);
    expect(appContext.robots).toBe(data.robots);
    expect(appContext.language).toBe(data.language);
    expect(appContext.navigation).toBe(data.navigation);
    expect(appContext.globalFooter).toBe(data.globalFooter);
    expect(appContext.structuredData).toBe(data.structuredData);
    expect(appContext.canonicalUrl).toBe(data.canonicalUrl);
    expect(appContext.assets).toBe(data.assets);
    expect(appContext.headAssets).toBe(data.headAssets);
    expect(appContext.themeColour).toBe(data.themeColour);
    expect(appContext.headerBranding).toBe(data.headerBranding);
    expect(appContext.breadcrumbs).toBe(data.breadcrumbs);
    expect(appContext.page).toBe(data.page);
    expect(appContext.preload).toBe(data.preload);
    expect(appContext.metadataLabels).toBe(data.metadataLabels);
    expect(appContext.inspect).toBe(data);
  });

  it("supports nullable robots and canonical url", () => {
    const data = {
      metadata: {},
      robots: null,
      language: "en-GB",
      canonicalUrl: null,
      navigation: {},
      globalFooter: {},
      structuredData: [],
      assets: {},
      headAssets: {},
      themeColour: {},
      headerBranding: {},
      breadcrumbs: {},
      page: {},
      preload: {},
      metadataLabels: {},
    } as unknown as AppContextData;

    const appContext = new AppContext(data);

    expect(appContext.robots).toBeNull();
    expect(appContext.canonicalUrl).toBeNull();
  });
});
