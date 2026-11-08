// src/app/life-cycle/app-resolve/resolvers/content/breadcrumbs/breadcrumbs.content.resolver.app-resolve.test.ts

import { resolveContentBreadcrumbsAppResolve } from "./breadcrumbs.content.resolver.app-resolve";

import { resolveLinkAppResolve } from "../../primitives/link/link.primitive.resolver.app-resolve";

jest.mock("../../primitives/link/link.primitive.resolver.app-resolve", () => ({
  resolveLinkAppResolve: jest.fn(),
}));

const mockedResolveLink = jest.mocked(resolveLinkAppResolve);

type Input = Parameters<typeof resolveContentBreadcrumbsAppResolve>[0];
type Breadcrumbs = Input["breadcrumbs"];
type Registry = Input["contentRegistry"];
type ResolvedLink = ReturnType<typeof resolveLinkAppResolve>;

describe("Content breadcrumbs AppResolve resolver", () => {
  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Registry;

  const createBreadcrumbs = (): Breadcrumbs => ["home", "journals", "forest"];

  beforeEach(() => {
    jest.resetAllMocks();

    mockedResolveLink.mockImplementation(
      ({ link }) =>
        ({
          href: `/${link.kind === "internal" ? link.pageId : ""}`,
          label: link.label,
        }) as unknown as ResolvedLink,
    );
  });

  it("returns an empty collection when no breadcrumbs exist", () => {
    const result = resolveContentBreadcrumbsAppResolve({
      breadcrumbs: [],
      contentRegistry,
    });

    expect(result).toEqual([]);
    expect(mockedResolveLink).not.toHaveBeenCalled();
  });

  it("resolves every breadcrumb in its original order", () => {
    const breadcrumbs = createBreadcrumbs();

    const result = resolveContentBreadcrumbsAppResolve({
      breadcrumbs,
      contentRegistry,
    });

    expect(result).toHaveLength(3);

    expect(result.map((link) => link.href)).toEqual([
      "/home",
      "/journals",
      "/forest",
    ]);

    expect(mockedResolveLink).toHaveBeenCalledTimes(3);
  });

  it("creates a fully initialised internal link for each page ID", () => {
    resolveContentBreadcrumbsAppResolve({
      breadcrumbs: ["home"],
      contentRegistry,
    });

    expect(mockedResolveLink).toHaveBeenCalledWith({
      link: {
        kind: "internal",
        pageId: "home",
        label: null,
        ariaLabel: null,
        title: null,
        icon: null,
        target: null,
        rel: null,
        variant: null,
      },
      registry: contentRegistry,
    });
  });

  it("passes every breadcrumb to the same content registry", () => {
    const breadcrumbs = createBreadcrumbs();

    resolveContentBreadcrumbsAppResolve({
      breadcrumbs,
      contentRegistry,
    });

    breadcrumbs.forEach((pageId, index) => {
      expect(mockedResolveLink).toHaveBeenNthCalledWith(index + 1, {
        link: expect.objectContaining({
          kind: "internal",
          pageId,
        }),
        registry: contentRegistry,
      });
    });
  });

  it("preserves duplicate breadcrumb IDs", () => {
    const result = resolveContentBreadcrumbsAppResolve({
      breadcrumbs: ["home", "home"],
      contentRegistry,
    });

    expect(result).toHaveLength(2);
    expect(mockedResolveLink).toHaveBeenCalledTimes(2);
  });

  it("returns the exact resolved link objects", () => {
    const resolvedLink = {
      href: "/journals",
      label: "Journals",
    } as ResolvedLink;

    mockedResolveLink.mockReturnValue(resolvedLink);

    const result = resolveContentBreadcrumbsAppResolve({
      breadcrumbs: ["journals"],
      contentRegistry,
    });

    expect(result[0]).toBe(resolvedLink);
  });

  it("does not mutate the original breadcrumbs", () => {
    const breadcrumbs = Object.freeze(createBreadcrumbs());

    resolveContentBreadcrumbsAppResolve({
      breadcrumbs,
      contentRegistry,
    });

    expect(breadcrumbs).toEqual(["home", "journals", "forest"]);
  });

  it("propagates link resolution failures", () => {
    const error = new Error("Unable to resolve internal link: missing");

    mockedResolveLink.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveContentBreadcrumbsAppResolve({
        breadcrumbs: ["missing"],
        contentRegistry,
      }),
    ).toThrow(error);
  });

  it("stops resolving subsequent breadcrumbs after a failure", () => {
    mockedResolveLink
      .mockReturnValueOnce({
        href: "/home",
        label: "Home",
      } as ResolvedLink)
      .mockImplementationOnce(() => {
        throw new Error("Breadcrumb resolution failed");
      });

    expect(() =>
      resolveContentBreadcrumbsAppResolve({
        breadcrumbs: ["home", "missing", "journals"],
        contentRegistry,
      }),
    ).toThrow("Breadcrumb resolution failed");

    expect(mockedResolveLink).toHaveBeenCalledTimes(2);
  });
});
