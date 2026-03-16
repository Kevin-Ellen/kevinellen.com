// tests/src/app/renderers/document.renderer.test.ts

import documentRenderer from "@app/renderers/document.renderer";

import renderDocHead from "@app/renderers/partials/docHead.partial";
import renderPageHead from "@app/renderers/partials/pageHead.partial";
import renderPageFooter from "@app/renderers/partials/pageFooter.partial";
import renderDocFooter from "@app/renderers/partials/docFooter.partial";

import buildBreadcrumbStructuredData from "@app/builders/structuredData.builder";

import type { AppPage, DocFooter } from "@types-src/appPage.types";
import type { SiteConfig } from "@types-src/siteConfig.types";

jest.mock("@generated/styles.css?raw", () => ({
  __esModule: true,
  default: "body{color:red;}",
}));

jest.mock("@app/renderers/partials/docHead.partial", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@app/renderers/partials/pageHead.partial", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@app/renderers/partials/pageFooter.partial", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@app/renderers/partials/docFooter.partial", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@app/builders/structuredData.builder", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockRenderDocHead = renderDocHead as jest.MockedFunction<
  typeof renderDocHead
>;
const mockRenderPageHead = renderPageHead as jest.MockedFunction<
  typeof renderPageHead
>;
const mockRenderPageFooter = renderPageFooter as jest.MockedFunction<
  typeof renderPageFooter
>;
const mockRenderDocFooter = renderDocFooter as jest.MockedFunction<
  typeof renderDocFooter
>;
const mockBuildBreadcrumbStructuredData =
  buildBreadcrumbStructuredData as jest.MockedFunction<
    typeof buildBreadcrumbStructuredData
  >;

describe("documentRenderer", () => {
  const siteDocFooter: DocFooter = {
    scripts: [
      {
        kind: "external",
        location: "head",
        src: "https://example.com/head.js",
        defer: true,
      },
      {
        kind: "inline",
        location: "footer",
        content: "console.log('site footer');",
      },
    ],
    inlineSvgSprite: ['<symbol id="site-icon"></symbol>'],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Kevin Ellen",
      },
    ],
  };

  const pageDocFooter: DocFooter = {
    scripts: [
      {
        kind: "inline",
        location: "head",
        content: "console.log('page head');",
      },
    ],
    inlineSvgSprite: ['<symbol id="page-icon"></symbol>'],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "About",
      },
    ],
  };

  const siteConfig = {
    language: "en-GB",
    siteUrl: "https://kevinellen.com",
    docFooter: siteDocFooter,
  } as SiteConfig;

  const page: AppPage = {
    definition: {
      id: "about",
      kind: "static",
      slug: "/about",
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
      pageTitle: "About Kevin Ellen",
      metaDescription: "About page",
    },
    pageHead: {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
      ],
    },
    content: {
      head: {
        title: "About",
        intro: "About intro",
        eyebrow: "About eyebrow",
      },
      body: ["<section>Page content</section>"],
      footer: ["<p>Page footer content</p>"],
    },
    docFooter: pageDocFooter,
    status: 200,
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [],
  };

  beforeEach(() => {
    jest.resetAllMocks();

    mockBuildBreadcrumbStructuredData.mockReturnValue(
      breadcrumbStructuredData as never,
    );

    mockRenderDocHead.mockReturnValue({
      html: "<head-fragment>",
      inlineAssets: [
        {
          kind: "style",
          content: "body{color:red;}",
        },
        {
          kind: "script",
          content: "console.log('page head');",
        },
      ],
    });

    mockRenderPageHead.mockReturnValue("<page-head>");
    mockRenderPageFooter.mockReturnValue("<page-footer>");

    mockRenderDocFooter.mockReturnValue({
      html: "<doc-footer>",
      inlineAssets: [
        {
          kind: "script",
          content:
            '{"@context":"https://schema.org","@type":"WebSite","name":"Kevin Ellen"}',
        },
      ],
    });
  });

  it("builds breadcrumb structured data from page breadcrumbs and site URL", () => {
    documentRenderer(siteConfig, page);

    expect(mockBuildBreadcrumbStructuredData).toHaveBeenCalledWith(
      page.pageHead.breadcrumbs,
      siteConfig.siteUrl,
    );
  });

  it("passes merged scripts into renderDocHead", () => {
    documentRenderer(siteConfig, page);

    expect(mockRenderDocHead).toHaveBeenCalledWith(
      siteConfig,
      page.docHead,
      "body{color:red;}",
      [...siteDocFooter.scripts, ...pageDocFooter.scripts],
    );
  });

  it("passes merged footer content including breadcrumb structured data into renderDocFooter", () => {
    documentRenderer(siteConfig, page);

    expect(mockRenderDocFooter).toHaveBeenCalledWith({
      scripts: [...siteDocFooter.scripts, ...pageDocFooter.scripts],
      inlineSvgSprite: [
        ...siteDocFooter.inlineSvgSprite,
        ...pageDocFooter.inlineSvgSprite,
      ],
      structuredData: [
        ...siteDocFooter.structuredData,
        ...pageDocFooter.structuredData,
        breadcrumbStructuredData,
      ],
    });
  });

  it("renders page content between page head and page footer", () => {
    const result = documentRenderer(siteConfig, page);

    expect(mockRenderPageHead).toHaveBeenCalledWith(page.pageHead);
    expect(mockRenderPageFooter).toHaveBeenCalled();
    expect(result.html).toBe(
      "<head-fragment><page-head><main><section>Page content</section></main><page-footer><doc-footer>",
    );
  });

  it("merges inline assets from head and footer fragments", () => {
    const result = documentRenderer(siteConfig, page);

    expect(result.inlineAssets).toEqual([
      {
        kind: "style",
        content: "body{color:red;}",
      },
      {
        kind: "script",
        content: "console.log('page head');",
      },
      {
        kind: "script",
        content:
          '{"@context":"https://schema.org","@type":"WebSite","name":"Kevin Ellen"}',
      },
    ]);
  });
});
