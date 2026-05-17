// src/app-state/resolve/pages/error/error.page.resolve.app-state.test.ts

import { appStateResolveErrorPage } from "@app-state/resolve/pages/error/error.page.resolve.app-state";

import { appStateResolvePageContent } from "@app-state/resolve/page-content/page-content.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/page-content.resolve.app-state",
  () => ({
    appStateResolvePageContent: jest.fn(),
  }),
);

describe("appStateResolveErrorPage", () => {
  const mockedAppStateResolvePageContent = jest.mocked(
    appStateResolvePageContent,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves an authored error page into an app-state page definition", () => {
    const content = {
      head: {
        title: "Not found",
      },
      content: [],
    };

    const resolvedContent = {
      head: {
        title: "Not found",
        eyebrow: null,
        intro: null,
        showInBody: true,
      },
      content: [],
      footer: [],
    };

    mockedAppStateResolvePageContent.mockReturnValue(resolvedContent as never);

    expect(
      appStateResolveErrorPage({
        id: "not-found",
        status: 404,
        label: "Not found",
        metadata: {
          pageTitle: "Not found",
          metaDescription: "This page could not be found.",
        },
        content,
      } as never),
    ).toEqual({
      id: "not-found",
      status: 404,
      label: "Not found",

      kind: null,
      slug: null,

      metadata: {
        pageTitle: "Not found | Kevin Ellen",
        metaDescription: "This page could not be found.",
      },
      socialPreview: null,

      robots: null,
      robotsTxt: null,
      sitemapXml: null,
      structuredData: [],

      content: resolvedContent,
      breadcrumbs: ["home", "not-found"],

      assets: {
        svg: [],
        scripts: [],
      },
    });

    expect(mockedAppStateResolvePageContent).toHaveBeenCalledWith(content);
  });
});
