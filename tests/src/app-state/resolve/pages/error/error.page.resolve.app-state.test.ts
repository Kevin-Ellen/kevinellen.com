// tests/src/app-state/resolve/pages/error/error.page.resolve.app-state.test.ts

import { appStateResolveErrorPage } from "@app-state/resolve/pages/error/error.page.resolve.app-state";
import { appStateResolvePageContent } from "@app-state/resolve/page-content/page-content.resolve.app-state";

import type { AuthoredErrorPageDefinition } from "@shared-types/pages/definitions/error/authored.base.error.definition.page.types";
import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";

describe("appStateResolveErrorPage", () => {
  it("adds deterministic breadcrumbs, assets, and resolved content to an authored error page", () => {
    const page: AuthoredErrorPageDefinition = {
      id: "error-404",
      status: 404,
      metadata: {
        pageTitle: "404 | Not found",
        metaDescription: "The page could not be found.",
      },
      content: {
        head: {
          title: "Page not found",
        },
        body: [],
      },
    };

    const result = appStateResolveErrorPage(page);

    const expected: AppStateErrorPageDefinition = {
      ...page,
      content: appStateResolvePageContent(page.content),
      breadcrumbs: ["home", "error-404"],
      assets: {
        svg: [],
        scripts: [],
      },
    };

    expect(result).toEqual(expected);
  });

  it("uses the page id as the second breadcrumb entry", () => {
    const page: AuthoredErrorPageDefinition = {
      id: "error-500",
      status: 500,
      metadata: {
        pageTitle: "500 | Internal server error",
        metaDescription:
          "Something went wrong while trying to render this page.",
      },
      content: {
        head: {
          title: "Internal server error",
        },
        body: [],
      },
    };

    const result = appStateResolveErrorPage(page);

    expect(result.breadcrumbs).toEqual(["home", "error-500"]);
  });

  it("adds empty default assets for error pages", () => {
    const page: AuthoredErrorPageDefinition = {
      id: "error-410",
      status: 410,
      metadata: {
        pageTitle: "410 | Gone",
        metaDescription: "This page is no longer available.",
      },
      content: {
        head: {
          title: "Gone",
        },
        body: [],
      },
    };

    const result = appStateResolveErrorPage(page);

    expect(result.assets).toEqual({
      svg: [],
      scripts: [],
    });
  });

  it("preserves authored error page fields while resolving content deterministically", () => {
    const page: AuthoredErrorPageDefinition = {
      id: "error-410",
      status: 410,
      metadata: {
        pageTitle: "410 | Gone",
        metaDescription: "This page is no longer available.",
      },
      content: {
        head: {
          title: "Gone",
        },
        body: [],
      },
    };

    const result = appStateResolveErrorPage(page);

    expect(result.id).toBe("error-410");
    expect(result.status).toBe(410);
    expect(result.metadata).toEqual(page.metadata);
    expect(result.content).toEqual(appStateResolvePageContent(page.content));
  });
});
