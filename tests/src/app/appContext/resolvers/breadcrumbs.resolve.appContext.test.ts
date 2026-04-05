// tests/src/app/appContext/resolvers/breadcrumbs.resolve.appContext.test.ts

import { resolveBreadcrumbsAppContext } from "@app/appContext/resolvers/breadcrumbs.resolve.appContext";

import type { AppState } from "@app/appState/class.appState";

import { journalListingPage } from "@app/content/pages/public/journal-listing.public.page";
import { notFoundErrorPage } from "@app/content/pages/error/404.error.page";

const createAppState = (
  pages: Record<string, ReturnType<AppState["getPublicPageById"]>>,
): AppState =>
  ({
    getPublicPageById: (id: string) => pages[id] ?? null,
  }) as AppState;

describe("resolveBreadcrumbsAppContext", () => {
  it("returns an empty array for an error page", () => {
    const appState = createAppState({});

    const result = resolveBreadcrumbsAppContext(appState, notFoundErrorPage);

    expect(result).toEqual([]);
  });

  it("returns an empty array when a public page has no breadcrumbs", () => {
    const page = {
      ...journalListingPage,
      breadcrumbs: [],
    };

    const appState = createAppState({
      [page.core.id]: page,
    });

    const result = resolveBreadcrumbsAppContext(appState, page);

    expect(result).toEqual([]);
  });

  it("resolves breadcrumb ids into breadcrumb items", () => {
    const homePage = {
      ...journalListingPage,
      core: {
        ...journalListingPage.core,
        id: "home",
        label: "Home",
        slug: "/",
      },
      breadcrumbs: [],
    };

    const journalPageWithBreadcrumbs = {
      ...journalListingPage,
      breadcrumbs: ["home"] as const,
    };

    const appState = createAppState({
      home: homePage,
      [journalPageWithBreadcrumbs.core.id]: journalPageWithBreadcrumbs,
    });

    const result = resolveBreadcrumbsAppContext(
      appState,
      journalPageWithBreadcrumbs,
    );

    expect(result).toEqual([
      {
        id: "home",
        label: "Home",
        href: "/",
      },
    ]);
  });

  it("throws when a breadcrumb page id cannot be resolved", () => {
    const brokenPage = {
      ...journalListingPage,
      breadcrumbs: ["missing-page"] as const,
    };

    const appState = createAppState({
      [brokenPage.core.id]: brokenPage,
    });

    expect(() => resolveBreadcrumbsAppContext(appState, brokenPage)).toThrow(
      "Breadcrumb page not found for id: missing-page",
    );
  });
});
