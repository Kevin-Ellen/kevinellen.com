// tests/src/app-state/resolve/pages/public/breadcrumbs.resolve.app-state.test.ts

import { appStateResolvePageBreadcrumbs } from "@app-state/resolve/pages/public/breadcrumbs.resolve.app-state";

describe("appStateResolvePageBreadcrumbs", () => {
  it("defaults breadcrumbs to an empty array when omitted", () => {
    expect(appStateResolvePageBreadcrumbs(undefined)).toEqual([]);
  });

  it("preserves provided breadcrumbs", () => {
    expect(appStateResolvePageBreadcrumbs(["home", "about"])).toEqual([
      "home",
      "about",
    ]);
  });

  it("returns the same breadcrumbs reference when provided", () => {
    const breadcrumbs = ["home", "journal"] as const;

    const result = appStateResolvePageBreadcrumbs(breadcrumbs);

    expect(result).toBe(breadcrumbs);
  });
});
