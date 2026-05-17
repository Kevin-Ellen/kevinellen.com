// src/app-state/resolve/pages/public/breadcrumbs.resolve.app-state.test.ts

import { appStateResolvePageBreadcrumbs } from "@app-state/resolve/pages/public/breadcrumbs.resolve.app-state";

describe("appStateResolvePageBreadcrumbs", () => {
  it("defaults missing breadcrumbs to an empty array", () => {
    expect(appStateResolvePageBreadcrumbs(undefined)).toEqual([]);
  });

  it("preserves authored breadcrumbs", () => {
    const breadcrumbs = ["home", "journal"] as never;

    expect(appStateResolvePageBreadcrumbs(breadcrumbs)).toBe(breadcrumbs);
  });
});
