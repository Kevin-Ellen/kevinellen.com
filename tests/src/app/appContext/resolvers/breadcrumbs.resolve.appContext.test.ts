// tests/src/app/appContext/resolvers/breadcrumbs.resolve.appContext.test.ts

import { resolveBreadcrumbsAppContext } from "@app/appContext/resolvers/breadcrumbs.resolve.appContext";
import { createAppState } from "@app/appState/create.appState";

describe("resolveBreadcrumbsAppContext", () => {
  const appState = createAppState();

  it("resolves breadcrumb ids into breadcrumb objects", () => {
    const result = resolveBreadcrumbsAppContext(["home", "journal"], appState);

    expect(result).toEqual([
      {
        id: "home",
        label: "Home",
        href: "/",
      },
      {
        id: "journal",
        label: "Journal",
        href: "/journal",
      },
    ]);
  });

  it("preserves breadcrumb order", () => {
    const result = resolveBreadcrumbsAppContext(["journal", "home"], appState);

    expect(result).toEqual([
      {
        id: "journal",
        label: "Journal",
        href: "/journal",
      },
      {
        id: "home",
        label: "Home",
        href: "/",
      },
    ]);
  });

  it("returns an empty array when breadcrumb trail is empty", () => {
    const result = resolveBreadcrumbsAppContext([], appState);

    expect(result).toEqual([]);
  });

  it("throws when a breadcrumb page id does not exist", () => {
    expect(() =>
      resolveBreadcrumbsAppContext(["home", "does-not-exist"], appState),
    ).toThrow("Missing breadcrumb page for id: does-not-exist");
  });
});
