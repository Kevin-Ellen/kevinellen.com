// tests/src/app-state/resolve/page-content/site/global-footer.resolve.app-state.test.ts

import { appStateResolveGlobalFooter } from "@app-state/resolve/page-content/global-footer.resolve.app-state";
import { appStateGlobalFooterAuthored } from "@app-state/config/global-footer/authored.global-footer.app-state";

import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";
import type { AppStateGlobalFooter } from "@shared-types/page-content/site/global-footer/app-state.global-footer.page-content.types";

describe("appStateResolveGlobalFooter", () => {
  it("preserves the authored global footer and adds a runtime colophon", () => {
    const siteConfig = {
      siteName: "Kevin Ellen",
    } as Pick<AppStateSiteConfig, "siteName"> as AppStateSiteConfig;

    const currentYear = new Date().getFullYear();

    const result = appStateResolveGlobalFooter(siteConfig);

    const expected: AppStateGlobalFooter = {
      ...appStateGlobalFooterAuthored,
      colophon: {
        kind: "colophon",
        copyrightName: "Kevin Ellen",
        copyrightYear: currentYear,
        allRightsReserved: true,
      },
    };

    expect(result).toEqual(expected);
  });

  it("uses the site config siteName as the copyright name", () => {
    const siteConfig = {
      siteName: "Photography Duck",
    } as Pick<AppStateSiteConfig, "siteName"> as AppStateSiteConfig;

    const result = appStateResolveGlobalFooter(siteConfig);

    expect(result.colophon.copyrightName).toBe("Photography Duck");
  });

  it("uses the current year in the colophon", () => {
    const siteConfig = {
      siteName: "Kevin Ellen",
    } as Pick<AppStateSiteConfig, "siteName"> as AppStateSiteConfig;

    const result = appStateResolveGlobalFooter(siteConfig);

    expect(result.colophon.copyrightYear).toBe(new Date().getFullYear());
  });

  it("always sets allRightsReserved to true", () => {
    const siteConfig = {
      siteName: "Kevin Ellen",
    } as Pick<AppStateSiteConfig, "siteName"> as AppStateSiteConfig;

    const result = appStateResolveGlobalFooter(siteConfig);

    expect(result.colophon).toEqual({
      kind: "colophon",
      copyrightName: "Kevin Ellen",
      copyrightYear: new Date().getFullYear(),
      allRightsReserved: true,
    });
  });
});
