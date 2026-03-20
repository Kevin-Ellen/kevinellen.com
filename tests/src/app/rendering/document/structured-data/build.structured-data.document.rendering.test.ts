// tests/src/app/rendering/document/structured-data/build.structured-data.document.rendering.test.ts

import { buildStructuredData } from "@app/rendering/document/structured-data/build.structured-data.document.rendering";
import { resolveBreadcrumbs } from "@src/app/rendering/document/breadcrumbs/resolve.breadcrumbs.document.rendering";

import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";
import type { StructuredDataNode } from "@app/config/structuredData.config.types";

jest.mock(
  "@app/rendering/document/breadcrumbs/resolve.breadcrumbs.document.rendering",
  () => ({
    resolveBreadcrumbs: jest.fn(),
  }),
);

describe("buildStructuredData", () => {
  const mockedResolveBreadcrumbs = jest.mocked(resolveBreadcrumbs);

  const createAppState = (siteUrl = "https://kevinellen.com"): AppState =>
    ({
      siteConfig: {
        language: "en-GB",
        siteName: "Kevin Ellen",
        siteUrl,
        socialMedia: {
          gitHub: "https://github.com/Kevin-Ellen",
          instagram: "https://www.instagram.com/photography.mallard",
          linkedIn: "https://www.linkedin.com/in/kevinellen/",
        },
      },
    }) as AppState;

  const createPage = (
    structuredData: readonly StructuredDataNode[] = [],
  ): PageDefinition =>
    ({
      core: {
        id: "home",
        kind: "home",
        label: "Home",
        slug: "/",
        renderMode: "request-composed",
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
        pageTitle: "Home",
        metaDescription: "Home page",
      },
      pageHead: {
        breadcrumbs: ["home"],
      },
      content: {
        head: {
          eyebrow: "Kevin Ellen",
          title: "Home",
          intro: "Intro",
        },
        body: [],
        footer: [],
      },
      docFooter: {
        scripts: [],
        svgs: [],
        structuredData,
      },
    }) as PageDefinition;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns authored structured data unchanged when no breadcrumbs are resolved", () => {
    const authoredNode: StructuredDataNode = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Home",
    };

    mockedResolveBreadcrumbs.mockReturnValue([]);

    const appState = createAppState();
    const page = createPage([authoredNode]);

    const result = buildStructuredData(appState, page);

    expect(result).toEqual([authoredNode]);
  });

  it("appends breadcrumb structured data after authored structured data", () => {
    const authoredNode: StructuredDataNode = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Home",
    };

    mockedResolveBreadcrumbs.mockReturnValue([
      {
        id: "home",
        label: "Home",
        href: "/",
      },
    ]);

    const appState = createAppState();
    const page = createPage([authoredNode]);

    const result = buildStructuredData(appState, page);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(authoredNode);
    expect(result[1]).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://kevinellen.com/",
        },
      ],
    });
  });

  it("builds absolute breadcrumb item URLs from relative hrefs", () => {
    mockedResolveBreadcrumbs.mockReturnValue([
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

    const appState = createAppState("https://kevinellen.com");
    const page = createPage();

    const result = buildStructuredData(appState, page);

    expect(result).toEqual([
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://kevinellen.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Journal",
            item: "https://kevinellen.com/journal",
          },
        ],
      },
    ]);
  });

  it("preserves breadcrumb order in the structured data output", () => {
    mockedResolveBreadcrumbs.mockReturnValue([
      {
        id: "home",
        label: "Home",
        href: "/",
      },
      {
        id: "articles",
        label: "Articles",
        href: "/articles",
      },
      {
        id: "entry",
        label: "Entry",
        href: "/articles/entry",
      },
    ]);

    const appState = createAppState();
    const page = createPage();

    const result = buildStructuredData(appState, page);

    expect(result[0]).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://kevinellen.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Articles",
          item: "https://kevinellen.com/articles",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Entry",
          item: "https://kevinellen.com/articles/entry",
        },
      ],
    });
  });

  it("does not mutate the original authored structured data array", () => {
    const authoredNode: StructuredDataNode = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Home",
    };

    const authoredStructuredData: StructuredDataNode[] = [authoredNode];

    mockedResolveBreadcrumbs.mockReturnValue([
      {
        id: "home",
        label: "Home",
        href: "/",
      },
    ]);

    const appState = createAppState();
    const page = createPage(authoredStructuredData);

    const result = buildStructuredData(appState, page);

    expect(authoredStructuredData).toEqual([authoredNode]);
    expect(result).toHaveLength(2);
  });
});
