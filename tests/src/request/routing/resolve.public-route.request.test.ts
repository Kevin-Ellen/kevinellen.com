// tests/src/request/routing/resolve.public-route.request.test.ts

import { resolvePublicRoute } from "@request/routing/resolve.public-route.request";

import type { AppState } from "@app-state/class.app-state";

describe("resolvePublicRoute", () => {
  it("returns found when a public page matches the pathname", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue({
        id: "home",
        kind: "static",
        slug: "/",
      }),
    } as unknown as AppState;

    const result = resolvePublicRoute("/", appState);

    expect(appState.getPublicPageBySlug).toHaveBeenCalledWith("/");
    expect(result).toEqual({
      kind: "found",
      publicPageId: "home",
      pagination: null,
    });
  });

  it("returns error 404 when no public page matches the pathname", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue(null),
    } as unknown as AppState;

    const result = resolvePublicRoute("/missing", appState);

    expect(appState.getPublicPageBySlug).toHaveBeenCalledWith("/missing");
    expect(result).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("returns found with page 1 pagination for listing root pages", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue({
        id: "journal",
        kind: "listing",
        slug: "/journal",
      }),
    } as unknown as AppState;

    const result = resolvePublicRoute("/journal", appState);

    expect(result).toEqual({
      kind: "found",
      publicPageId: "journal",
      pagination: {
        currentPage: 1,
      },
    });
  });

  it("returns found for a valid paginated listing route", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue({
        id: "journal",
        kind: "listing",
        slug: "/journal",
        content: {
          content: [
            {
              kind: "articleSection",
              modules: [
                {
                  kind: "journalListing",
                  pagination: {
                    pageSize: 1,
                  },
                },
              ],
            },
          ],
        },
      }),
      getPublicPages: [{ kind: "journal" }, { kind: "journal" }],
    } as unknown as AppState;

    const result = resolvePublicRoute("/journal/page-2", appState);

    expect(result).toEqual({
      kind: "found",
      publicPageId: "journal",
      pagination: {
        currentPage: 2,
      },
    });
  });

  it("returns 404 for page-1 because the root listing is canonical", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue({
        id: "journal",
        kind: "listing",
        slug: "/journal",
      }),
    } as unknown as AppState;

    expect(resolvePublicRoute("/journal/page-1", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("returns 404 for paginated routes beyond the available page count", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue({
        id: "journal",
        kind: "listing",
        slug: "/journal",
        content: {
          content: [
            {
              kind: "articleSection",
              modules: [
                {
                  kind: "journalListing",
                  pagination: {
                    pageSize: 1,
                  },
                },
              ],
            },
          ],
        },
      }),
      getPublicPages: [{ kind: "journal" }],
    } as unknown as AppState;

    expect(resolvePublicRoute("/journal/page-2", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("returns 404 when a paginated route points at a non-listing page", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue({
        id: "about",
        kind: "static",
        slug: "/about",
      }),
    } as unknown as AppState;

    expect(resolvePublicRoute("/about/page-2", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("returns 404 when a paginated listing has no journal listing module", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue({
        id: "journal",
        kind: "listing",
        slug: "/journal",
        content: {
          content: [
            {
              kind: "articleSection",
              modules: [],
            },
          ],
        },
      }),
      getPublicPages: [{ kind: "journal" }, { kind: "journal" }],
    } as unknown as AppState;

    expect(resolvePublicRoute("/journal/page-2", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("returns 404 when listing page has no articleSection blocks", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue({
        id: "journal",
        kind: "listing",
        slug: "/journal",
        content: {
          content: [
            {
              kind: "somethingElse",
            },
          ],
        },
      }),
      getPublicPages: [{ kind: "journal" }, { kind: "journal" }],
    } as unknown as AppState;

    expect(resolvePublicRoute("/journal/page-2", appState)).toEqual({
      kind: "error",
      status: 404,
    });
  });

  it("resolves pageSize from the first valid journalListing module", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue({
        id: "journal",
        kind: "listing",
        slug: "/journal",
        content: {
          content: [
            { kind: "somethingElse" },
            {
              kind: "articleSection",
              modules: [
                {
                  kind: "journalListing",
                  pagination: { pageSize: 2 },
                },
              ],
            },
          ],
        },
      }),
      getPublicPages: [
        { kind: "journal" },
        { kind: "journal" },
        { kind: "journal" },
      ],
    } as unknown as AppState;

    const result = resolvePublicRoute("/journal/page-2", appState);

    expect(result).toEqual({
      kind: "found",
      publicPageId: "journal",
      pagination: { currentPage: 2 },
    });
  });
});
