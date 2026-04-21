// tests/src/app-context/resolve/page/page.resolve.app-context.test.ts

import { resolvePageAppContext } from "@app-context/resolve/page/page.resolve.app-context";
import { appContextResolvePageContent } from "@app-context/resolve/page/content/content.page.resolve.app-context";

jest.mock(
  "@app-context/resolve/page/content/content.page.resolve.app-context",
  () => ({
    appContextResolvePageContent: jest.fn(),
  }),
);

describe("resolvePageAppContext", () => {
  const mockedAppContextResolvePageContent = jest.mocked(
    appContextResolvePageContent,
  );

  const context = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves a public page when routing kind is found", () => {
    const page = {
      id: "about",
      kind: "static",
      slug: "/about",
      label: "About",
      metadata: {
        pageTitle: "About | Kevin Ellen",
        metaDescription: "About page",
      },
      content: {
        head: {
          title: "About",
          eyebrow: null,
          intro: null,
        },
        body: [],
        footer: [],
      },
      assets: {
        scripts: [],
        svg: [],
      },
      breadcrumbs: ["home", "about"],
    } as const;

    const resolvedContent = {
      head: {
        title: "Resolved About",
        eyebrow: null,
        intro: null,
      },
      body: [],
      footer: [],
    } as const;

    mockedAppContextResolvePageContent.mockReturnValue(resolvedContent);

    const result = resolvePageAppContext(
      page as never,
      {
        kind: "found",
        publicPageId: "about",
      },
      context,
    );

    expect(result).toEqual({
      id: "about",
      kind: "static",
      slug: "/about",
      label: "About",
      content: resolvedContent,
    });

    expect(mockedAppContextResolvePageContent).toHaveBeenCalledWith(
      page.content,
      context,
    );
    expect("metadata" in result).toBe(false);
    expect("assets" in result).toBe(false);
    expect("breadcrumbs" in result).toBe(false);
  });

  it("resolves an error page when routing is not found", () => {
    const page = {
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
      assets: {
        scripts: [],
        svg: [],
      },
      breadcrumbs: ["home", "error-404"],
    } as const;

    const resolvedContent = {
      head: {
        title: "Resolved 404",
        eyebrow: null,
        intro: null,
      },
      body: [],
      footer: [],
    } as const;

    mockedAppContextResolvePageContent.mockReturnValue(resolvedContent);

    const result = resolvePageAppContext(
      page as never,
      {
        kind: "error",
        status: 404,
      } as never,
      context,
    );

    expect(result).toEqual({
      id: "error-404",
      status: 404,
      metadata: {
        pageTitle: "404 | Not found",
        metaDescription: "The page could not be found.",
      },
      content: resolvedContent,
    });

    expect(mockedAppContextResolvePageContent).toHaveBeenCalledWith(
      page.content,
      context,
    );
    expect("assets" in result).toBe(false);
    expect("breadcrumbs" in result).toBe(false);
  });
});
