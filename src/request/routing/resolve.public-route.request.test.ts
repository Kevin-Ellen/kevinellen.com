// src/request/routing/resolve.public-route.request.test.ts

import { resolvePublicRoute } from "@request/routing/resolve.public-route.request";

const createArticleSection = (modules: unknown[]) => ({
  kind: "articleSection",
  modules,
});

const createListingPage = (overrides: Record<string, unknown> = {}) => ({
  id: "journal-listing",
  kind: "listing",
  slug: "/journal",
  content: {
    content: [
      createArticleSection([
        {
          kind: "journalListing",
          pagination: {
            pageSize: 2,
          },
        },
      ]),
    ],
  },
  ...overrides,
});

const createJournalPage = (id: string) => ({
  id,
  kind: "journal",
  slug: `/journal/${id}`,
  content: {
    content: [],
  },
});

const createStandardPage = (overrides: Record<string, unknown> = {}) => ({
  id: "about",
  kind: "standard",
  slug: "/about",
  content: {
    content: [],
  },
  ...overrides,
});

const createAppState = (pages: unknown[]) =>
  ({
    getPublicPages: pages,
    getPublicPageBySlug: jest.fn((slug: string) =>
      pages.find((page) => {
        if (typeof page === "object" && page !== null && "slug" in page) {
          return page.slug === slug;
        }

        return false;
      }),
    ),
  }) as never;

describe("resolvePublicRoute", () => {
  it("returns found route for a standard public page", () => {
    const page = createStandardPage();
    const appState = createAppState([page]);

    expect(resolvePublicRoute("/about", appState)).toEqual({
      kind: "found",
      publicPageId: "about",
      pagination: null,
    });
  });

  it("returns found route with page 1 pagination for a listing page", () => {
    const page = createListingPage();
    const appState = createAppState([page]);

    expect(resolvePublicRoute("/journal", appState)).toEqual({
      kind: "found",
      publicPageId: "journal-listing",
      pagination: {
        currentPage: 1,
      },
    });
  });

  it("returns 404 when no public page matches", () => {
    const appState = createAppState([]);

    expect(resolvePublicRoute("/journal/page-2", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("returns found route for valid paginated listing page", () => {
    const listingPage = createListingPage();
    const appState = createAppState([
      listingPage,
      createJournalPage("one"),
      createJournalPage("two"),
      createJournalPage("three"),
    ]);

    expect(resolvePublicRoute("/journal/page-2", appState)).toEqual({
      kind: "found",
      publicPageId: "journal-listing",
      pagination: {
        currentPage: 2,
      },
    });
  });

  it("returns 404 for page-1 paginated listing route", () => {
    const listingPage = createListingPage();
    const appState = createAppState([listingPage, createJournalPage("one")]);

    expect(resolvePublicRoute("/journal/page-1", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("returns 404 when paginated base route does not exist", () => {
    const appState = createAppState([]);

    expect(resolvePublicRoute("/journal/page-2", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("returns 404 when paginated base route is not a listing page", () => {
    const page = createStandardPage({
      id: "standard-journal",
      slug: "/journal",
    });

    const appState = createAppState([page]);

    expect(resolvePublicRoute("/journal/page-2", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("returns 404 when listing page has no journal listing module", () => {
    const listingPage = createListingPage({
      content: {
        content: [createArticleSection([{ kind: "paragraph" }])],
      },
    });

    const appState = createAppState([
      listingPage,
      createJournalPage("one"),
      createJournalPage("two"),
      createJournalPage("three"),
    ]);

    expect(resolvePublicRoute("/journal/page-2", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("returns 404 when journal listing module is outside article sections", () => {
    const listingPage = createListingPage({
      content: {
        content: [
          {
            kind: "otherSection",
            modules: [
              {
                kind: "journalListing",
                pagination: {
                  pageSize: 2,
                },
              },
            ],
          },
        ],
      },
    });

    const appState = createAppState([
      listingPage,
      createJournalPage("one"),
      createJournalPage("two"),
      createJournalPage("three"),
    ]);

    expect(resolvePublicRoute("/journal/page-2", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("returns 404 when requested page exceeds total pages", () => {
    const listingPage = createListingPage();
    const appState = createAppState([
      listingPage,
      createJournalPage("one"),
      createJournalPage("two"),
    ]);

    expect(resolvePublicRoute("/journal/page-2", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("allows page 2 when total pages rounds up", () => {
    const listingPage = createListingPage();
    const appState = createAppState([
      listingPage,
      createJournalPage("one"),
      createJournalPage("two"),
      createJournalPage("three"),
    ]);

    expect(resolvePublicRoute("/journal/page-2", appState)).toEqual({
      kind: "found",
      publicPageId: "journal-listing",
      pagination: {
        currentPage: 2,
      },
    });
  });

  it("does not treat page-0 as a paginated route", () => {
    const listingPage = createListingPage();
    const appState = createAppState([listingPage]);

    expect(resolvePublicRoute("/journal/page-0", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("does not treat leading-zero page numbers as paginated routes", () => {
    const listingPage = createListingPage();
    const appState = createAppState([listingPage]);

    expect(resolvePublicRoute("/journal/page-02", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });
});
