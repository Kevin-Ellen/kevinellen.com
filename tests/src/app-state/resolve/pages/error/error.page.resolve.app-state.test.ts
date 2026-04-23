// tests/src/app-state/resolve/pages/error/error.page.resolve.app-state.test.ts

import { appStateResolveErrorPage } from "@app-state/resolve/pages/error/error.page.resolve.app-state";
import { appStateResolvePageContent } from "@app-state/resolve/page-content/page-content.resolve.app-state";

import type { AuthoredErrorPageDefinition } from "@shared-types/page-definitions/authored.error.page-definition.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

describe("appStateResolveErrorPage", () => {
  it("adds deterministic breadcrumbs, assets, null public fields, and resolved content to an authored error page", () => {
    const page: AuthoredErrorPageDefinition = {
      id: "error-404",
      status: 404,
      label: "404 | Not found",
      metadata: {
        pageTitle: "404 | Not found",
        metaDescription: "The page could not be found.",
      },
      content: {
        header: {
          title: "Page not found",
        },
        content: [],
      },
    };

    const result = appStateResolveErrorPage(page);

    const expected: AppStatePageDefinition = {
      ...page,
      kind: null,
      slug: null,
      robots: null,
      robotsTxt: null,
      sitemapXml: null,
      structuredData: [],
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
      label: "500 | Internal server error",
      metadata: {
        pageTitle: "500 | Internal server error",
        metaDescription:
          "Something went wrong while trying to render this page.",
      },
      content: {
        header: {
          title: "Internal server error",
        },
        content: [],
      },
    };

    const result = appStateResolveErrorPage(page);

    expect(result.breadcrumbs).toEqual(["home", "error-500"]);
  });

  it("adds empty default assets for error pages", () => {
    const page: AuthoredErrorPageDefinition = {
      id: "error-410",
      status: 410,
      label: "410 | Gone",
      metadata: {
        pageTitle: "410 | Gone",
        metaDescription: "This page is no longer available.",
      },
      content: {
        header: {
          title: "Gone",
        },
        content: [],
      },
    };

    const result = appStateResolveErrorPage(page);

    expect(result.assets).toEqual({
      svg: [],
      scripts: [],
    });
  });

  it("sets unified public-only fields to null or empty values for error pages", () => {
    const page: AuthoredErrorPageDefinition = {
      id: "error-410",
      status: 410,
      label: "410 | Gone",
      metadata: {
        pageTitle: "410 | Gone",
        metaDescription: "This page is no longer available.",
      },
      content: {
        header: {
          title: "Gone",
        },
        content: [],
      },
    };

    const result = appStateResolveErrorPage(page);

    expect(result.kind).toBeNull();
    expect(result.slug).toBeNull();
    expect(result.robots).toBeNull();
    expect(result.robotsTxt).toBeNull();
    expect(result.sitemapXml).toBeNull();
    expect(result.structuredData).toEqual([]);
  });

  it("preserves authored error page fields while resolving content deterministically", () => {
    const page: AuthoredErrorPageDefinition = {
      id: "error-410",
      status: 410,
      label: "410 | Gone",
      metadata: {
        pageTitle: "410 | Gone",
        metaDescription: "This page is no longer available.",
      },
      content: {
        header: {
          title: "Gone",
        },
        content: [],
      },
    };

    const result = appStateResolveErrorPage(page);

    expect(result.id).toBe("error-410");
    expect(result.status).toBe(410);
    expect(result.label).toBe("410 | Gone");
    expect(result.metadata).toEqual(page.metadata);
    expect(result.content).toEqual(appStateResolvePageContent(page.content));
  });
});
