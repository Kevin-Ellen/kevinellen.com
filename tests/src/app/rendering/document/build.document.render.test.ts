// tests/src/app/rendering/document/build.document.render.test.ts

import { buildDocumentRender } from "@app/rendering/document/build.document";

import { buildAssets } from "@app/rendering/document/assets/build.assets.document.rendering";
import { buildCanonicalUrl } from "@app/rendering/document/canonical/build.canonical.document.rendering";
import { resolveBreadcrumbs } from "@app/rendering/document/breadcrumbs/resolve.breadcrumbs.document.rendering";
import { buildStructuredData } from "@app/rendering/document/structured-data/build.structured-data.document.rendering";

import type { AppState } from "@app/appState/appState";
import type { StructuredDataNode } from "@app/config/structuredData.config.types";
import type { PageDefinition } from "@app/pages/page.definition";

jest.mock(
  "@app/rendering/document/assets/build.assets.document.rendering",
  () => ({
    buildAssets: jest.fn(),
  }),
);

jest.mock(
  "@app/rendering/document/canonical/build.canonical.document.rendering",
  () => ({
    buildCanonicalUrl: jest.fn(),
  }),
);

jest.mock(
  "@app/rendering/document/breadcrumbs/resolve.breadcrumbs.document.rendering",
  () => ({
    resolveBreadcrumbs: jest.fn(),
  }),
);

jest.mock(
  "@app/rendering/document/structured-data/build.structured-data.document.rendering",
  () => ({
    buildStructuredData: jest.fn(),
  }),
);

describe("buildDocumentRender", () => {
  const mockedBuildAssets = jest.mocked(buildAssets);
  const mockedBuildCanonicalUrl = jest.mocked(buildCanonicalUrl);
  const mockedResolveBreadcrumbs = jest.mocked(resolveBreadcrumbs);
  const mockedBuildStructuredData = jest.mocked(buildStructuredData);

  const createAppState = (): AppState =>
    ({
      siteConfig: {
        language: "en-GB",
        siteName: "Kevin Ellen",
        siteUrl: "https://kevinellen.com",
        socialMedia: {
          gitHub: "https://github.com/Kevin-Ellen",
          instagram: "https://www.instagram.com/photography.mallard",
          linkedIn: "https://www.linkedin.com/in/kevinellen/",
        },
      },
    }) as AppState;

  const createPage = (): PageDefinition =>
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
        pageTitle: "Kevin Ellen",
        metaDescription:
          "Nature photography, journal writing, and technical architecture.",
      },
      pageHead: {
        breadcrumbs: ["home"],
      },
      content: {
        head: {
          eyebrow: "Kevin Ellen",
          title: "Nature, writing, and technical architecture",
          intro:
            "A personal platform for nature photography, field notes, articles, and transparent technical thinking.",
        },
        body: ["Body block"],
        footer: ["Footer block"],
      },
      docFooter: {
        scripts: [],
        svgs: [],
        structuredData: [],
      },
      robots: {
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
    }) as PageDefinition;

  const createMockStructuredData = (): readonly StructuredDataNode[] =>
    [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [],
      },
    ] satisfies readonly StructuredDataNode[];

  beforeEach(() => {
    jest.clearAllMocks();

    mockedBuildCanonicalUrl.mockReturnValue("https://kevinellen.com/");
    mockedResolveBreadcrumbs.mockReturnValue([
      {
        id: "home",
        label: "Home",
        href: "/",
      },
    ]);
    mockedBuildAssets.mockReturnValue({
      scripts: [
        {
          id: "header-condense",
          kind: "inline",
          content: "console.log('header');",
          location: "footer",
        },
      ],
      svgs: [
        {
          id: "icon-home",
          path: '<symbol id="icon-home"></symbol>',
        },
      ],
    });
    mockedBuildStructuredData.mockReturnValue(createMockStructuredData());
  });

  it("builds the full document render object from app state, page, and nonce", () => {
    const appState = createAppState();
    const page = createPage();

    const result = buildDocumentRender(appState, page, "test-nonce");

    expect(result).toEqual({
      security: {
        nonce: "test-nonce",
      },
      site: {
        language: "en-GB",
        siteName: "Kevin Ellen",
        siteUrl: "https://kevinellen.com",
        socialMedia: {
          gitHub: "https://github.com/Kevin-Ellen",
          instagram: "https://www.instagram.com/photography.mallard",
          linkedIn: "https://www.linkedin.com/in/kevinellen/",
        },
      },
      page: {
        id: "home",
        kind: "home",
        slug: "/",
        renderMode: "request-composed",
      },
      seo: {
        pageTitle: "Kevin Ellen",
        metaDescription:
          "Nature photography, journal writing, and technical architecture.",
        canonicalUrl: "https://kevinellen.com/",
      },
      pageHead: {
        breadcrumbs: [
          {
            id: "home",
            label: "Home",
            href: "/",
          },
        ],
      },
      content: {
        head: {
          eyebrow: "Kevin Ellen",
          title: "Nature, writing, and technical architecture",
          intro:
            "A personal platform for nature photography, field notes, articles, and transparent technical thinking.",
        },
        body: ["Body block"],
        footer: ["Footer block"],
      },
      assets: {
        scripts: [
          {
            id: "header-condense",
            kind: "inline",
            content: "console.log('header');",
            location: "footer",
          },
        ],
        svgs: [
          {
            id: "icon-home",
            path: '<symbol id="icon-home"></symbol>',
          },
        ],
      },
      structuredData: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [],
        },
      ],
      robots: {
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
    });
  });

  it("passes app state and page to the canonical builder", () => {
    const appState = createAppState();
    const page = createPage();

    buildDocumentRender(appState, page, "test-nonce");

    expect(mockedBuildCanonicalUrl).toHaveBeenCalledTimes(1);
    expect(mockedBuildCanonicalUrl).toHaveBeenCalledWith(appState, page);
  });

  it("passes app state and page to the breadcrumb resolver", () => {
    const appState = createAppState();
    const page = createPage();

    buildDocumentRender(appState, page, "test-nonce");

    expect(mockedResolveBreadcrumbs).toHaveBeenCalledTimes(1);
    expect(mockedResolveBreadcrumbs).toHaveBeenCalledWith(appState, page);
  });

  it("passes app state and page to the asset builder", () => {
    const appState = createAppState();
    const page = createPage();

    buildDocumentRender(appState, page, "test-nonce");

    expect(mockedBuildAssets).toHaveBeenCalledTimes(1);
    expect(mockedBuildAssets).toHaveBeenCalledWith(appState, page);
  });

  it("passes app state and page to the structured data builder", () => {
    const appState = createAppState();
    const page = createPage();

    buildDocumentRender(appState, page, "test-nonce");

    expect(mockedBuildStructuredData).toHaveBeenCalledTimes(1);
    expect(mockedBuildStructuredData).toHaveBeenCalledWith(appState, page);
  });

  it("returns a frozen root object", () => {
    const appState = createAppState();
    const page = createPage();

    const result = buildDocumentRender(appState, page, "test-nonce");

    expect(Object.isFrozen(result)).toBe(true);
  });

  it("returns frozen nested objects and arrays used by the render contract", () => {
    const appState = createAppState();
    const page = createPage();

    const result = buildDocumentRender(appState, page, "test-nonce");

    expect(Object.isFrozen(result.security)).toBe(true);
    expect(Object.isFrozen(result.site)).toBe(true);
    expect(Object.isFrozen(result.page)).toBe(true);
    expect(Object.isFrozen(result.seo)).toBe(true);
    expect(Object.isFrozen(result.pageHead)).toBe(true);
    expect(Object.isFrozen(result.pageHead.breadcrumbs)).toBe(true);
    expect(Object.isFrozen(result.content)).toBe(true);
    expect(Object.isFrozen(result.content.head)).toBe(true);
    expect(Object.isFrozen(result.content.body)).toBe(true);
    expect(Object.isFrozen(result.content.footer)).toBe(true);
    expect(Object.isFrozen(result.assets)).toBe(true);
    expect(Object.isFrozen(result.assets.scripts)).toBe(true);
    expect(Object.isFrozen(result.assets.svgs)).toBe(true);
    expect(Object.isFrozen(result.structuredData)).toBe(true);
  });

  it("returns copied arrays rather than reusing mocked helper arrays directly", () => {
    const appState = createAppState();
    const page = createPage();

    const breadcrumbs = [
      {
        id: "home",
        label: "Home",
        href: "/",
      },
    ];

    const scripts = [
      {
        id: "header-condense",
        kind: "inline" as const,
        content: "console.log('header');",
        location: "footer" as const,
      },
    ];

    const svgs = [
      {
        id: "icon-home",
        path: '<symbol id="icon-home"></symbol>',
      },
    ];

    const structuredData = createMockStructuredData();

    mockedResolveBreadcrumbs.mockReturnValue(breadcrumbs);
    mockedBuildAssets.mockReturnValue({
      scripts,
      svgs,
    });
    mockedBuildStructuredData.mockReturnValue(structuredData);

    const result = buildDocumentRender(appState, page, "test-nonce");

    expect(result.pageHead.breadcrumbs).not.toBe(breadcrumbs);
    expect(result.assets.scripts).not.toBe(scripts);
    expect(result.assets.svgs).not.toBe(svgs);
    expect(result.structuredData).not.toBe(structuredData);
    expect(result.content.body).not.toBe(page.content.body);
    expect(result.content.footer).not.toBe(page.content.footer);
  });

  it("returns the same document render output for the same inputs", () => {
    const appState = createAppState();
    const page = createPage();
    const nonce = "stable-nonce";

    const first = buildDocumentRender(appState, page, nonce);
    const second = buildDocumentRender(appState, page, nonce);

    expect(second).toEqual(first);
  });

  it("only changes the security nonce when the nonce input changes", () => {
    const appState = createAppState();
    const page = createPage();

    const first = buildDocumentRender(appState, page, "nonce-a");
    const second = buildDocumentRender(appState, page, "nonce-b");

    expect(first.security.nonce).toBe("nonce-a");
    expect(second.security.nonce).toBe("nonce-b");

    expect({
      ...first,
      security: { nonce: "same" },
    }).toEqual({
      ...second,
      security: { nonce: "same" },
    });
  });

  it("is insulated from later mutation of page content source arrays", () => {
    const appState = createAppState();
    const page = createPage();

    const result = buildDocumentRender(appState, page, "test-nonce");

    (page.content.body as string[]).push("Injected body");
    (page.content.footer as string[]).push("Injected footer");

    expect(result.content.body).toEqual(["Body block"]);
    expect(result.content.footer).toEqual(["Footer block"]);
  });

  it("does not allow mutation of the built breadcrumb array", () => {
    const appState = createAppState();
    const page = createPage();

    const result = buildDocumentRender(appState, page, "test-nonce");

    try {
      (
        result.pageHead.breadcrumbs as Array<{
          id: string;
          label: string;
          href: string;
        }>
      ).push({
        id: "mutated",
        label: "Mutated",
        href: "/mutated",
      });
    } catch {
      // Expected when mutating frozen arrays under strict mode.
    }

    expect(result.pageHead.breadcrumbs).toEqual([
      {
        id: "home",
        label: "Home",
        href: "/",
      },
    ]);
  });
});
