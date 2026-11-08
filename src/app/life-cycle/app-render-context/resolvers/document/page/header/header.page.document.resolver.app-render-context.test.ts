// src/app/life-cycle/app-render-context/resolvers/document/page/header/header.page.document.resolver.app-render-context.test.ts

import { resolveHeaderPageDocumentAppRenderContext } from "./header.page.document.resolver.app-render-context";

import { resolveLinkAppRenderContext } from "../../../primitives/link/link.primitive.resolver.app-render-context";

jest.mock(
  "../../../primitives/link/link.primitive.resolver.app-render-context",
  () => ({
    resolveLinkAppRenderContext: jest.fn(),
  }),
);

const mockedLink = jest.mocked(resolveLinkAppRenderContext);

type Shell = Parameters<
  typeof resolveHeaderPageDocumentAppRenderContext
>[0]["shell"];

type Branding = Shell["navigation"]["branding"];
type Link = Parameters<typeof resolveLinkAppRenderContext>[0]["link"];
type ResolvedLink = ReturnType<typeof resolveLinkAppRenderContext>;

describe("Page header AppRenderContext resolver", () => {
  const createLink = (id: string): Link =>
    ({
      href: `/${id}`,
      label: id,
    }) as unknown as Link;

  const primaryFirst = createLink("photography");
  const primarySecond = createLink("journal");
  const socialFirst = createLink("instagram");
  const socialSecond = createLink("linkedin");

  const createBranding = (overrides: Partial<Branding> = {}): Branding =>
    ({
      href: "/",
      icon: {
        id: "logo",
      },
      label: "Kevin Ellen",
      ariaLabel: "Kevin Ellen — Home",
      ...overrides,
    }) as unknown as Branding;

  const createShell = (overrides: Record<string, unknown> = {}): Shell =>
    ({
      navigation: {
        branding: createBranding(),
        primary: [primaryFirst, primarySecond],
        social: [socialFirst, socialSecond],
      },
      pagePresentation: {
        header: {
          variant: "default",
        },
      },
      ...overrides,
    }) as unknown as Shell;

  const withBranding = (overrides: Partial<Branding>): Shell => {
    const shell = createShell();

    return {
      ...shell,
      navigation: {
        ...shell.navigation,
        branding: createBranding(overrides),
      },
    };
  };

  beforeEach(() => {
    jest.resetAllMocks();

    mockedLink.mockImplementation(({ link }) => link);
  });

  it("preserves the configured header appearance", () => {
    const shell = createShell();

    const result = resolveHeaderPageDocumentAppRenderContext({
      shell,
    });

    expect(result.appearance).toBe(shell.pagePresentation.header);
  });

  it("resolves branding using the accessible label", () => {
    const shell = createShell();

    const result = resolveHeaderPageDocumentAppRenderContext({
      shell,
    });

    expect(result.brand).toEqual({
      href: shell.navigation.branding.href,
      logo: shell.navigation.branding.icon,
      label: "Kevin Ellen — Home",
    });
  });

  it("prefers ariaLabel over the visible branding label", () => {
    const result = resolveHeaderPageDocumentAppRenderContext({
      shell: withBranding({
        label: "Visible name",
        ariaLabel: "Accessible home link",
      }),
    });

    expect(result.brand.label).toBe("Accessible home link");
  });

  it("falls back to the visible label when ariaLabel is null", () => {
    const result = resolveHeaderPageDocumentAppRenderContext({
      shell: withBranding({
        ariaLabel: null,
      }),
    });

    expect(result.brand.label).toBe("Kevin Ellen");
  });

  it("falls back to the visible label when ariaLabel is undefined", () => {
    const result = resolveHeaderPageDocumentAppRenderContext({
      shell: withBranding({
        ariaLabel: undefined,
      }),
    });

    expect(result.brand.label).toBe("Kevin Ellen");
  });

  it("rejects branding without an icon", () => {
    const shell = withBranding({
      icon: null,
    });

    expect(() => resolveHeaderPageDocumentAppRenderContext({ shell })).toThrow(
      "Header branding requires an icon",
    );

    expect(mockedLink).not.toHaveBeenCalled();
  });

  it("rejects branding without a label", () => {
    const shell = withBranding({
      label: "",
      ariaLabel: null,
    });

    expect(() => resolveHeaderPageDocumentAppRenderContext({ shell })).toThrow(
      "Header branding requires a label",
    );

    expect(mockedLink).not.toHaveBeenCalled();
  });

  it("rejects an explicitly empty ariaLabel", () => {
    const shell = withBranding({
      label: "Visible name",
      ariaLabel: "",
    });

    expect(() => resolveHeaderPageDocumentAppRenderContext({ shell })).toThrow(
      "Header branding requires a label",
    );
  });

  it("checks the branding icon before the label", () => {
    const shell = withBranding({
      icon: null,
      label: "",
      ariaLabel: null,
    });

    expect(() => resolveHeaderPageDocumentAppRenderContext({ shell })).toThrow(
      "Header branding requires an icon",
    );
  });

  it("resolves primary navigation links in order", () => {
    const shell = createShell();

    const result = resolveHeaderPageDocumentAppRenderContext({
      shell,
    });

    expect(result.navigation.primary.items).toEqual([
      primaryFirst,
      primarySecond,
    ]);

    expect(mockedLink).toHaveBeenNthCalledWith(1, {
      link: primaryFirst,
    });
    expect(mockedLink).toHaveBeenNthCalledWith(2, {
      link: primarySecond,
    });
  });

  it("resolves social navigation links after primary links", () => {
    const shell = createShell();

    const result = resolveHeaderPageDocumentAppRenderContext({
      shell,
    });

    expect(result.navigation.social.items).toEqual([socialFirst, socialSecond]);

    expect(mockedLink).toHaveBeenNthCalledWith(3, {
      link: socialFirst,
    });
    expect(mockedLink).toHaveBeenNthCalledWith(4, {
      link: socialSecond,
    });

    expect(mockedLink).toHaveBeenCalledTimes(4);
  });

  it("preserves exact resolved link references", () => {
    const resolved = {
      href: "/resolved-photography",
      label: "Resolved photography",
    } as unknown as ResolvedLink;

    mockedLink.mockReturnValueOnce(resolved);

    const result = resolveHeaderPageDocumentAppRenderContext({
      shell: createShell(),
    });

    expect(result.navigation.primary.items[0]).toBe(resolved);
  });

  it("supports empty navigation collections", () => {
    const shell = createShell();

    const emptyShell: Shell = {
      ...shell,
      navigation: {
        ...shell.navigation,
        primary: [],
        social: [],
      },
    };

    const result = resolveHeaderPageDocumentAppRenderContext({
      shell: emptyShell,
    });

    expect(result.navigation.primary.items).toEqual([]);
    expect(result.navigation.social.items).toEqual([]);
    expect(mockedLink).not.toHaveBeenCalled();
  });

  it("propagates primary navigation link errors", () => {
    const error = new Error("Primary navigation failed");

    mockedLink.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveHeaderPageDocumentAppRenderContext({
        shell: createShell(),
      }),
    ).toThrow(error);

    expect(mockedLink).toHaveBeenCalledTimes(1);
  });

  it("propagates social navigation link errors", () => {
    const error = new Error("Social navigation failed");

    mockedLink.mockImplementation(({ link }) => {
      if (link === socialFirst) {
        throw error;
      }

      return link;
    });

    expect(() =>
      resolveHeaderPageDocumentAppRenderContext({
        shell: createShell(),
      }),
    ).toThrow(error);

    expect(mockedLink).toHaveBeenCalledTimes(3);
  });

  it("preserves the original shell references", () => {
    const shell = createShell();

    const branding = shell.navigation.branding;
    const primary = shell.navigation.primary;
    const social = shell.navigation.social;

    resolveHeaderPageDocumentAppRenderContext({ shell });

    expect(shell.navigation.branding).toBe(branding);
    expect(shell.navigation.primary).toBe(primary);
    expect(shell.navigation.social).toBe(social);
  });
});
