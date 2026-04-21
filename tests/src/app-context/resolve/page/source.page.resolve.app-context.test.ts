// tests/src/app-context/resolve/page/source.page.resolve.app-context.test.ts

import { resolvePageSourceAppContext } from "@app-context/resolve/page/source.page.resolve.app-context";

describe("resolvePageSourceAppContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the public page when routing kind is found", () => {
    const publicPage = {
      id: "about",
      kind: "static",
      slug: "/about",
      label: "About",
      content: {
        head: {
          title: "About",
          eyebrow: null,
          intro: null,
        },
        body: [],
        footer: [],
      },
    } as const;

    const appState = {
      getPublicPageById: jest.fn().mockReturnValue(publicPage),
      getErrorPageByStatus: jest.fn(),
    };

    const result = resolvePageSourceAppContext(appState as never, {
      kind: "found",
      publicPageId: "about",
    });

    expect(result).toBe(publicPage);
    expect(appState.getPublicPageById).toHaveBeenCalledWith("about");
    expect(appState.getErrorPageByStatus).not.toHaveBeenCalled();
  });

  it("throws when a found route references a missing public page", () => {
    const appState = {
      getPublicPageById: jest.fn().mockReturnValue(null),
      getErrorPageByStatus: jest.fn(),
    };

    expect(() =>
      resolvePageSourceAppContext(appState as never, {
        kind: "found",
        publicPageId: "about",
      }),
    ).toThrow("Missing public page for routing id 'about'.");

    expect(appState.getPublicPageById).toHaveBeenCalledWith("about");
    expect(appState.getErrorPageByStatus).not.toHaveBeenCalled();
  });

  it("returns the error page when routing is an error result", () => {
    const errorPage = {
      id: "error-404",
      status: 404,
      metadata: {
        pageTitle: "404 | Not found",
        metaDescription: "The page could not be found.",
      },
      content: {
        head: {
          title: "404",
          eyebrow: null,
          intro: null,
        },
        body: [],
        footer: [],
      },
    } as const;

    const appState = {
      getPublicPageById: jest.fn(),
      getErrorPageByStatus: jest.fn().mockReturnValue(errorPage),
    };

    const result = resolvePageSourceAppContext(
      appState as never,
      {
        kind: "error",
        status: 404,
      } as never,
    );

    expect(result).toBe(errorPage);
    expect(appState.getErrorPageByStatus).toHaveBeenCalledWith(404);
    expect(appState.getPublicPageById).not.toHaveBeenCalled();
  });

  it("throws when an error route references a missing error page", () => {
    const appState = {
      getPublicPageById: jest.fn(),
      getErrorPageByStatus: jest.fn().mockReturnValue(null),
    };

    expect(() =>
      resolvePageSourceAppContext(
        appState as never,
        {
          kind: "error",
          status: 404,
        } as never,
      ),
    ).toThrow("Missing error page for status '404'.");

    expect(appState.getErrorPageByStatus).toHaveBeenCalledWith(404);
    expect(appState.getPublicPageById).not.toHaveBeenCalled();
  });
});
