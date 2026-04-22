// tests/src/app-state/resolve/pages/public/public.page.resolve.app-state.test.ts

jest.mock("@app-state/resolve/pages/public/robots.resolve.app-state", () => ({
  appStateResolvePageRobots: jest.fn(),
}));

jest.mock("@app-state/resolve/pages/public/assets.resolve.app-state", () => ({
  appStateResolvePageAssets: jest.fn(),
}));

jest.mock(
  "@app-state/resolve/pages/public/breadcrumbs.resolve.app-state",
  () => ({
    appStateResolvePageBreadcrumbs: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/pages/public/structured-data.resolve.app-state",
  () => ({
    appStateResolvePageStructuredData: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/page-content.resolve.app-state",
  () => ({
    appStateResolvePageContent: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/pages/public/robots-txt.resolve.app-state",
  () => ({
    appStateResolvePageRobotsTxT: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/pages/public/sitemap-xml.resolve.app-state",
  () => ({
    appStateResolvePageSitemapXml: jest.fn(),
  }),
);

import { appStateResolvePageRobots } from "@app-state/resolve/pages/public/robots.resolve.app-state";
import { appStateResolvePageAssets } from "@app-state/resolve/pages/public/assets.resolve.app-state";
import { appStateResolvePageBreadcrumbs } from "@app-state/resolve/pages/public/breadcrumbs.resolve.app-state";
import { appStateResolvePageStructuredData } from "@app-state/resolve/pages/public/structured-data.resolve.app-state";
import { appStateResolvePageContent } from "@app-state/resolve/page-content/page-content.resolve.app-state";
import { appStateResolvePageRobotsTxT } from "@app-state/resolve/pages/public/robots-txt.resolve.app-state";
import { appStateResolvePageSitemapXml } from "@app-state/resolve/pages/public/sitemap-xml.resolve.app-state";

import { appStateResolvePublicPage } from "@app-state/resolve/pages/public/public.page.resolve.app-state";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

const mockedAppStateResolvePageRobots =
  appStateResolvePageRobots as jest.MockedFunction<
    typeof appStateResolvePageRobots
  >;

const mockedAppStateResolvePageAssets =
  appStateResolvePageAssets as jest.MockedFunction<
    typeof appStateResolvePageAssets
  >;

const mockedAppStateResolvePageBreadcrumbs =
  appStateResolvePageBreadcrumbs as jest.MockedFunction<
    typeof appStateResolvePageBreadcrumbs
  >;

const mockedAppStateResolvePageStructuredData =
  appStateResolvePageStructuredData as jest.MockedFunction<
    typeof appStateResolvePageStructuredData
  >;

const mockedAppStateResolvePageContent =
  appStateResolvePageContent as jest.MockedFunction<
    typeof appStateResolvePageContent
  >;

const mockedAppStateResolvePageRobotsTxT =
  appStateResolvePageRobotsTxT as jest.MockedFunction<
    typeof appStateResolvePageRobotsTxT
  >;

const mockedAppStateResolvePageSitemapXml =
  appStateResolvePageSitemapXml as jest.MockedFunction<
    typeof appStateResolvePageSitemapXml
  >;

describe("appStateResolvePublicPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("composes a public page through the public page sub-resolvers", () => {
    const page: AuthoredPublicPageDefinition = {
      id: "about",
      kind: "static",
      slug: "/about",
      label: "About",
      metadata: {
        pageTitle: "About",
        metaDescription: "About Kevin",
      },
      robots: {
        allowIndex: false,
      },
      robotsTxt: {
        disallow: false,
      },
      sitemapXml: {
        include: true,
      },
      assets: {
        scripts: [{ id: "header-condense" }] as never[],
        svg: [{ id: "icon-home" }] as never[],
      },
      breadcrumbs: ["home"],
      structuredData: [{ "@type": "AboutPage" }] as never[],
      content: {
        head: {
          title: "About",
        },
        body: [],
      },
    };

    mockedAppStateResolvePageRobots.mockReturnValue({
      allowIndex: false,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    });

    mockedAppStateResolvePageAssets.mockReturnValue({
      scripts: [{ id: "header-condense" }] as never[],
      svg: [{ id: "icon-home" }] as never[],
    });

    mockedAppStateResolvePageBreadcrumbs.mockReturnValue(["home"]);

    mockedAppStateResolvePageStructuredData.mockReturnValue([
      { "@type": "AboutPage" },
    ] as never[]);

    mockedAppStateResolvePageContent.mockReturnValue({
      head: {
        title: "About",
        eyebrow: null,
        intro: null,
      },
      body: [],
      footer: [],
    });

    mockedAppStateResolvePageRobotsTxT.mockReturnValue({
      disallow: false,
    });

    mockedAppStateResolvePageSitemapXml.mockReturnValue({
      include: true,
    });

    const result = appStateResolvePublicPage(page);

    expect(mockedAppStateResolvePageRobots).toHaveBeenCalledWith(page.robots);
    expect(mockedAppStateResolvePageAssets).toHaveBeenCalledWith(page.assets);
    expect(mockedAppStateResolvePageBreadcrumbs).toHaveBeenCalledWith(
      page.breadcrumbs,
    );
    expect(mockedAppStateResolvePageStructuredData).toHaveBeenCalledWith(
      page.structuredData,
    );
    expect(mockedAppStateResolvePageContent).toHaveBeenCalledWith(page.content);
    expect(mockedAppStateResolvePageRobotsTxT).toHaveBeenCalledWith(
      page.robotsTxt,
    );
    expect(mockedAppStateResolvePageSitemapXml).toHaveBeenCalledWith(
      page.sitemapXml,
    );

    const expected: AppStatePageDefinition = {
      ...page,
      status: null,
      robots: {
        allowIndex: false,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
      assets: {
        scripts: [{ id: "header-condense" }] as never[],
        svg: [{ id: "icon-home" }] as never[],
      },
      breadcrumbs: ["home"],
      structuredData: [{ "@type": "AboutPage" }] as never[],
      content: {
        head: {
          title: "About",
          eyebrow: null,
          intro: null,
        },
        body: [],
        footer: [],
      },
      robotsTxt: { disallow: false },
      sitemapXml: { include: true },
    };

    expect(result).toEqual(expected);
  });

  it("preserves authored page identity fields", () => {
    const page: AuthoredPublicPageDefinition = {
      id: "journal",
      kind: "journal",
      slug: "/journal",
      label: "Journal",
      metadata: {
        pageTitle: "Journal",
        metaDescription: "Field notes and journal entries.",
      },
      content: {
        head: {
          title: "Journal",
        },
        body: [],
      },
    };

    mockedAppStateResolvePageRobots.mockReturnValue({
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    });

    mockedAppStateResolvePageAssets.mockReturnValue({
      scripts: [],
      svg: [],
    });

    mockedAppStateResolvePageBreadcrumbs.mockReturnValue([]);

    mockedAppStateResolvePageStructuredData.mockReturnValue([]);

    mockedAppStateResolvePageContent.mockReturnValue({
      head: {
        title: "Journal",
        eyebrow: null,
        intro: null,
      },
      body: [],
      footer: [],
    });

    mockedAppStateResolvePageRobotsTxT.mockReturnValue({
      disallow: false,
    });

    mockedAppStateResolvePageSitemapXml.mockReturnValue({
      include: true,
    });

    const result = appStateResolvePublicPage(page);

    expect(result.id).toBe("journal");
    expect(result.kind).toBe("journal");
    expect(result.slug).toBe("/journal");
    expect(result.label).toBe("Journal");
    expect(result.status).toBeNull();
    expect(result.metadata).toEqual(page.metadata);
  });
});
