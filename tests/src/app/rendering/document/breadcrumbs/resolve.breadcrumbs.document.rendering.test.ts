// tests/src/app/rendering/document/breadcrumbs/resolve.breadcrumbs.document.rendering.test.ts

import { resolveBreadcrumbs } from "@app/rendering/document/breadcrumbs/resolve.breadcrumbs.document.rendering";

import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";

const createPage = (id: string, label: string, slug: string): PageDefinition =>
  ({
    core: {
      id,
      kind: "static",
      label,
      slug,
      renderMode: "bundled",
    },
    config: {
      robots: {
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
      robotsTxt: {
        disallow: false,
      },
      sitemap: {
        include: true,
      },
    },
    docHead: {
      pageTitle: label,
      metaDescription: `${label} page`,
    },
    pageHead: {
      breadcrumbs: [],
    },
    content: {
      head: {
        eyebrow: label,
        title: `${label} title`,
        intro: `${label} intro`,
      },
      body: [],
      footer: [],
    },
    docFooter: {
      scripts: [],
      svgs: [],
      structuredData: [],
    },
  }) as PageDefinition;

const createTargetPage = (breadcrumbTrail: readonly string[]): PageDefinition =>
  ({
    core: {
      id: "target-page",
      kind: "static",
      label: "Target Page",
      slug: "/target-page",
      renderMode: "bundled",
    },
    config: {
      robots: {
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
      robotsTxt: {
        disallow: false,
      },
      sitemap: {
        include: true,
      },
    },
    docHead: {
      pageTitle: "Target Page",
      metaDescription: "Target page",
    },
    pageHead: {
      breadcrumbs: breadcrumbTrail,
    },
    content: {
      head: {
        eyebrow: "Target",
        title: "Target Page",
        intro: "Target intro",
      },
      body: [],
      footer: [],
    },
    docFooter: {
      scripts: [],
      svgs: [],
      structuredData: [],
    },
  }) as PageDefinition;

const createAppState = (pages: readonly PageDefinition[]): AppState =>
  ({
    pages: {
      all: pages,
      errors: {
        404: pages[0],
        410: pages[0],
        500: pages[0],
      },
    },
  }) as AppState;

describe("resolveBreadcrumbs", () => {
  it("resolves breadcrumb references into breadcrumb items", () => {
    const homePage = createPage("home", "Home", "/");
    const aboutPage = createPage("about", "About", "/about");
    const targetPage = createTargetPage(["home", "about"]);

    const appState = createAppState([homePage, aboutPage, targetPage]);

    const result = resolveBreadcrumbs(appState, targetPage);

    expect(result).toEqual([
      {
        id: "home",
        label: "Home",
        href: "/",
      },
      {
        id: "about",
        label: "About",
        href: "/about",
      },
    ]);
  });

  it("uses the page core label rather than editorial content fields", () => {
    const labelledPage = {
      ...createPage("articles", "Articles", "/articles"),
      content: {
        head: {
          eyebrow: "Eyebrow",
          title: "A much longer editorial title",
          intro: "Intro",
        },
        body: [],
        footer: [],
      },
    } as PageDefinition;

    const targetPage = createTargetPage(["articles"]);
    const appState = createAppState([labelledPage, targetPage]);

    const result = resolveBreadcrumbs(appState, targetPage);

    expect(result).toEqual([
      {
        id: "articles",
        label: "Articles",
        href: "/articles",
      },
    ]);
  });

  it("preserves breadcrumb order", () => {
    const homePage = createPage("home", "Home", "/");
    const journalPage = createPage("journal", "Journal", "/journal");
    const entryPage = createPage("entry", "Entry", "/journal/entry");
    const targetPage = createTargetPage(["home", "journal", "entry"]);

    const appState = createAppState([
      homePage,
      journalPage,
      entryPage,
      targetPage,
    ]);

    const result = resolveBreadcrumbs(appState, targetPage);

    expect(result.map((item) => item.id)).toEqual(["home", "journal", "entry"]);
  });

  it("returns an empty array when the breadcrumb trail is empty", () => {
    const targetPage = createTargetPage([]);
    const appState = createAppState([targetPage]);

    const result = resolveBreadcrumbs(appState, targetPage);

    expect(result).toEqual([]);
  });

  it("throws when a breadcrumb page reference is not registered in AppState", () => {
    const homePage = createPage("home", "Home", "/");
    const targetPage = createTargetPage(["home", "missing-page"]);

    const appState = createAppState([homePage, targetPage]);

    expect(() => resolveBreadcrumbs(appState, targetPage)).toThrow(
      'Invariant violation: breadcrumb page "missing-page" is not registered in AppState.',
    );
  });
});
