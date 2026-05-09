// src/app-state/resolve/pages/public/sitemap-xml.resolve.app-state.test.ts

import { appStateResolvePageSitemapXml } from "@app-state/resolve/pages/public/sitemap-xml.resolve.app-state";

describe("appStateResolvePageSitemapXml", () => {
  it("defaults include to true", () => {
    expect(appStateResolvePageSitemapXml()).toEqual({
      include: true,
    });
  });

  it("preserves authored include value", () => {
    expect(
      appStateResolvePageSitemapXml({
        include: false,
      }),
    ).toEqual({
      include: false,
    });
  });
});
