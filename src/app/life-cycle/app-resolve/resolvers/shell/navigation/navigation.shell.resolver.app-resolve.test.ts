// src/app/life-cycle/app-resolve/resolvers/shell/navigation/navigation.shell.resolver.app-resolve.test.ts

import { resolveNavigationShellAppResolve } from "./navigation.shell.resolver.app-resolve";
import { resolveLinkAppResolve } from "../../primitives/link/link.primitive.resolver.app-resolve";

jest.mock("../../primitives/link/link.primitive.resolver.app-resolve", () => ({
  resolveLinkAppResolve: jest.fn(),
}));

const mockedResolveLink = jest.mocked(resolveLinkAppResolve);

type Input = Parameters<typeof resolveNavigationShellAppResolve>[0];
type Navigation = Input["navigation"];
type Link = Navigation["branding"];

describe("Navigation shell AppResolve resolver", () => {
  const registry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["registry"];

  const createLink = (pageId: string): Link =>
    ({
      kind: "internal",
      pageId,
      label: pageId,
    }) as unknown as Link;

  const createNavigation = (): Navigation =>
    ({
      branding: createLink("home"),
      primary: [createLink("journals"), createLink("photography")],
      social: [createLink("instagram")],
      footer: {
        primary: [
          {
            title: "Explore",
            links: [createLink("about"), createLink("contact")],
          },
          {
            title: "More",
            links: [createLink("topics")],
          },
        ],
        legal: {
          title: "Legal",
          links: [createLink("privacy"), createLink("licensing")],
        },
      },
    }) as unknown as Navigation;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedResolveLink.mockImplementation(({ link }) => ({
      ...link,
      href: "/resolved",
    }));
  });

  it("resolves branding with the content registry", () => {
    const navigation = createNavigation();

    const result = resolveNavigationShellAppResolve({
      navigation,
      registry,
    });

    expect(mockedResolveLink).toHaveBeenNthCalledWith(1, {
      link: navigation.branding,
      registry,
    });

    expect(result.branding).toMatchObject({
      href: "/resolved",
    });
  });

  it("resolves primary navigation links in order", () => {
    const navigation = createNavigation();

    const result = resolveNavigationShellAppResolve({
      navigation,
      registry,
    });

    expect(result.primary).toHaveLength(2);

    expect(mockedResolveLink).toHaveBeenNthCalledWith(2, {
      link: navigation.primary[0],
      registry,
    });

    expect(mockedResolveLink).toHaveBeenNthCalledWith(3, {
      link: navigation.primary[1],
      registry,
    });
  });

  it("resolves social links", () => {
    const navigation = createNavigation();

    const result = resolveNavigationShellAppResolve({
      navigation,
      registry,
    });

    expect(result.social).toHaveLength(1);
    expect(result.social[0]).toMatchObject({
      href: "/resolved",
    });

    expect(mockedResolveLink).toHaveBeenNthCalledWith(4, {
      link: navigation.social[0],
      registry,
    });
  });

  it("resolves every footer section link", () => {
    const navigation = createNavigation();

    const result = resolveNavigationShellAppResolve({
      navigation,
      registry,
    });

    expect(result.footer.primary).toHaveLength(2);
    expect(result.footer.primary[0]?.links).toHaveLength(2);
    expect(result.footer.primary[1]?.links).toHaveLength(1);

    expect(mockedResolveLink).toHaveBeenNthCalledWith(5, {
      link: navigation.footer.primary[0]?.links[0],
      registry,
    });

    expect(mockedResolveLink).toHaveBeenNthCalledWith(6, {
      link: navigation.footer.primary[0]?.links[1],
      registry,
    });

    expect(mockedResolveLink).toHaveBeenNthCalledWith(7, {
      link: navigation.footer.primary[1]?.links[0],
      registry,
    });
  });

  it("preserves footer section metadata", () => {
    const navigation = createNavigation();

    const result = resolveNavigationShellAppResolve({
      navigation,
      registry,
    });

    expect(result.footer.primary).toMatchObject([
      { title: "Explore" },
      { title: "More" },
    ]);
  });

  it("resolves legal footer links", () => {
    const navigation = createNavigation();

    const result = resolveNavigationShellAppResolve({
      navigation,
      registry,
    });

    expect(result.footer.legal.links).toHaveLength(2);

    expect(mockedResolveLink).toHaveBeenNthCalledWith(8, {
      link: navigation.footer.legal.links[0],
      registry,
    });

    expect(mockedResolveLink).toHaveBeenNthCalledWith(9, {
      link: navigation.footer.legal.links[1],
      registry,
    });

    expect(result.footer.legal).toMatchObject({
      title: "Legal",
    });
  });

  it("resolves each configured link exactly once", () => {
    const navigation = createNavigation();

    resolveNavigationShellAppResolve({ navigation, registry });

    expect(mockedResolveLink).toHaveBeenCalledTimes(9);
  });

  it("supports empty navigation collections", () => {
    const navigation = createNavigation();

    const emptyNavigation = {
      ...navigation,
      primary: [],
      social: [],
      footer: {
        primary: [],
        legal: {
          ...navigation.footer.legal,
          links: [],
        },
      },
    } as Navigation;

    const result = resolveNavigationShellAppResolve({
      navigation: emptyNavigation,
      registry,
    });

    expect(result.primary).toEqual([]);
    expect(result.social).toEqual([]);
    expect(result.footer.primary).toEqual([]);
    expect(result.footer.legal.links).toEqual([]);

    // Branding is always resolved.
    expect(mockedResolveLink).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the original navigation", () => {
    const navigation = createNavigation();
    const originalPrimary = navigation.primary;
    const originalFooter = navigation.footer;

    resolveNavigationShellAppResolve({ navigation, registry });

    expect(navigation.primary).toBe(originalPrimary);
    expect(navigation.footer).toBe(originalFooter);
  });

  it("propagates link resolution errors", () => {
    const error = new Error("Link resolution failed");

    mockedResolveLink.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveNavigationShellAppResolve({
        navigation: createNavigation(),
        registry,
      }),
    ).toThrow(error);
  });
});
