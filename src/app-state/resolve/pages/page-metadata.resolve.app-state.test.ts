// src/app-state/resolve/pages/page-metadata.resolve.app-state.test.ts

import { appStateResolvePageMetadata } from "@app-state/resolve/pages/page-metadata.resolve.app-state";

describe("appStateResolvePageMetadata", () => {
  it("adds the site title suffix when missing", () => {
    expect(
      appStateResolvePageMetadata({
        pageTitle: "Journal",
        metaDescription: "Field notes.",
      }),
    ).toEqual({
      pageTitle: "Journal | Kevin Ellen",
      metaDescription: "Field notes.",
    });
  });

  it("does not duplicate the site title suffix", () => {
    expect(
      appStateResolvePageMetadata({
        pageTitle: "Journal | Kevin Ellen",
        metaDescription: "Field notes.",
      }),
    ).toEqual({
      pageTitle: "Journal | Kevin Ellen",
      metaDescription: "Field notes.",
    });
  });

  it("preserves the meta description", () => {
    expect(
      appStateResolvePageMetadata({
        pageTitle: "About",
        metaDescription: "About Kevin Ellen.",
      }),
    ).toEqual({
      pageTitle: "About | Kevin Ellen",
      metaDescription: "About Kevin Ellen.",
    });
  });
});
