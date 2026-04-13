// tests/src/app-state/class.app-test.test.ts

import { AppState } from "@app-state/class.app-state";

describe("AppState", () => {
  it("stores the provided AppState data", () => {
    const data = {
      siteConfig: { siteName: "Kevin Ellen" },
      webManifest: {},
      system: {},
      assets: {},
      globalFooter: {},
      social: {},
      metadataLabels: {},
      navigation: {},
      structuredData: {},
      pages: {},
    } as never;

    const appState = new AppState(data);

    expect(appState.inspect).toEqual(data);
  });

  it("exposes the same AppState data reference through inspect", () => {
    const data = {
      siteConfig: { siteName: "Kevin Ellen" },
      webManifest: {},
      system: {},
      assets: {},
      globalFooter: {},
      social: {},
      metadataLabels: {},
      navigation: {},
      structuredData: {},
      pages: {},
    } as never;

    const appState = new AppState(data);

    expect(appState.inspect).toBe(data);
  });
});
