// tests/src/app-state/resolve/pages/public/sitemap-xml.resolve.app-state.test.ts

import { appStateResolvePageSitemapXml } from "@app-state/resolve/pages/public/sitemap-xml.resolve.app-state";

describe("appStateResolvePageSitemapXml", () => {
  it("returns default included=true when no input is provided", () => {
    const result = appStateResolvePageSitemapXml(undefined);

    expect(result).toEqual({
      include: true,
    });
  });

  it("returns included=true when authored value is true", () => {
    const result = appStateResolvePageSitemapXml({
      include: true,
    });

    expect(result).toEqual({
      include: true,
    });
  });

  it("returns included=false when authored value is false", () => {
    const result = appStateResolvePageSitemapXml({
      include: false,
    });

    expect(result).toEqual({
      include: false,
    });
  });
});
