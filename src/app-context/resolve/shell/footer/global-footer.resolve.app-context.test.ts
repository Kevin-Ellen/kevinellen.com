// src/app-context/resolve/shell/footer/global-footer.resolve.app-context.test.ts

import type { AppStateGlobalFooter } from "@shared-types/page-content/site/global-footer/app-state.global-footer.types";

import { appContextResolveGlobalFooter } from "@app-context/resolve/shell/footer/global-footer.resolve.app-context";

describe("appContextResolveGlobalFooter", () => {
  it("returns the global footer unchanged", () => {
    const globalFooter: AppStateGlobalFooter = {
      affiliations: {
        kind: "affiliations",
        title: "Affiliations",
        description: "Groups and organisations I support.",
        items: [
          {
            id: "rspb",
            label: "RSPB",
            href: "https://www.rspb.org.uk/",
            svgId: "logo-rspb",
          },
        ],
      },
      colophon: {
        kind: "colophon",
        copyrightName: "Kevin Ellen",
        copyrightYear: 2026,
        allRightsReserved: true,
      },
    };

    const result = appContextResolveGlobalFooter(globalFooter);

    expect(result).toEqual(globalFooter);
    expect(result).toBe(globalFooter);
  });
});
