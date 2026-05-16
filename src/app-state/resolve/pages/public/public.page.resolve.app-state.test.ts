// src/app-state/resolve/pages/public/public.page.resolve.app-state.test.ts

import { appStateResolvePublicPage } from "@app-state/resolve/pages/public/public.page.resolve.app-state";

import { appStateResolvePageRobots } from "@app-state/resolve/pages/public/robots.resolve.app-state";
import { appStateResolvePageAssets } from "@app-state/resolve/pages/public/assets.resolve.app-state";
import { appStateResolvePageBreadcrumbs } from "@app-state/resolve/pages/public/breadcrumbs.resolve.app-state";
import { appStateResolvePageStructuredData } from "@app-state/resolve/pages/public/structured-data.resolve.app-state";
import { appStateResolvePageContent } from "@app-state/resolve/page-content/page-content.resolve.app-state";
import { appStateResolvePageRobotsTxT } from "@app-state/resolve/pages/public/robots-txt.resolve.app-state";
import { appStateResolvePageSitemapXml } from "@app-state/resolve/pages/public/sitemap-xml.resolve.app-state";

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

describe("appStateResolvePublicPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves a public page through all public page resolvers", () => {
    const page = {
      id: "journal",
      kind: "listing",
      slug: "/journal",
      label: "Journal",
      metadata: {
        pageTitle: "Journal | Kevin Ellen",
        description: "Field notes.",
      },
      robots: { allowIndex: true },
      robotsTxt: { disallow: false },
      sitemapXml: { include: true },
      assets: { scripts: ["journal"], svg: ["arrow"] },
      breadcrumbs: ["home"],
      structuredData: [{ kind: "website" }],
      content: {
        head: {
          title: "Journal",
        },
        content: [],
      },
    };

    const resolvedRobots = { resolved: "robots" };
    const resolvedAssets = { resolved: "assets" };
    const resolvedBreadcrumbs = ["home", "journal"];
    const resolvedStructuredData = [{ resolved: "structuredData" }];
    const resolvedRobotsTxt = { resolved: "robotsTxt" };
    const resolvedSitemapXml = { resolved: "sitemapXml" };
    const resolvedContent = { resolved: "content" };

    jest
      .mocked(appStateResolvePageRobots)
      .mockReturnValue(resolvedRobots as never);
    jest
      .mocked(appStateResolvePageAssets)
      .mockReturnValue(resolvedAssets as never);
    jest
      .mocked(appStateResolvePageBreadcrumbs)
      .mockReturnValue(resolvedBreadcrumbs as never);
    jest
      .mocked(appStateResolvePageStructuredData)
      .mockReturnValue(resolvedStructuredData as never);
    jest
      .mocked(appStateResolvePageRobotsTxT)
      .mockReturnValue(resolvedRobotsTxt as never);
    jest
      .mocked(appStateResolvePageSitemapXml)
      .mockReturnValue(resolvedSitemapXml as never);
    jest
      .mocked(appStateResolvePageContent)
      .mockReturnValue(resolvedContent as never);

    expect(appStateResolvePublicPage(page as never)).toEqual({
      ...page,
      status: null,
      robots: resolvedRobots,
      assets: resolvedAssets,
      breadcrumbs: resolvedBreadcrumbs,
      structuredData: resolvedStructuredData,
      robotsTxt: resolvedRobotsTxt,
      sitemapXml: resolvedSitemapXml,
      content: resolvedContent,
    });

    expect(appStateResolvePageRobots).toHaveBeenCalledWith(page.robots);
    expect(appStateResolvePageAssets).toHaveBeenCalledWith(page.assets);
    expect(appStateResolvePageBreadcrumbs).toHaveBeenCalledWith(
      page.breadcrumbs,
    );
    expect(appStateResolvePageStructuredData).toHaveBeenCalledWith(
      page.structuredData,
    );
    expect(appStateResolvePageRobotsTxT).toHaveBeenCalledWith(page.robotsTxt);
    expect(appStateResolvePageSitemapXml).toHaveBeenCalledWith(page.sitemapXml);
    expect(appStateResolvePageContent).toHaveBeenCalledWith(page.content);
  });
});
