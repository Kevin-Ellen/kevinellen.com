// src/app/life-cycle/app-render-context/resolvers/document/page/footer/footer.page.document.resolver.app-render-context.test.ts

import { resolveFooterPageDocumentAppRenderContext } from "./footer.page.document.resolver.app-render-context";

import { resolveLinkAppRenderContext } from "../../../primitives/link/link.primitive.resolver.app-render-context";

jest.mock(
  "../../../primitives/link/link.primitive.resolver.app-render-context",
  () => ({
    resolveLinkAppRenderContext: jest.fn(),
  }),
);

const mockedLink = jest.mocked(resolveLinkAppRenderContext);

type Shell = Parameters<
  typeof resolveFooterPageDocumentAppRenderContext
>[0]["shell"];

type Link = Parameters<typeof resolveLinkAppRenderContext>[0]["link"];
type ResolvedLink = ReturnType<typeof resolveLinkAppRenderContext>;

describe("Page footer AppRenderContext resolver", () => {
  const createLink = (id: string): Link =>
    ({
      href: `/${id}`,
      label: id,
    }) as unknown as Link;

  const primaryFirst = createLink("photography");
  const primarySecond = createLink("journal");
  const primaryThird = createLink("about");

  const conservationFirst = createLink("essex-wildlife-trust");
  const conservationSecond = createLink("rspb");

  const legalFirst = createLink("privacy");
  const legalSecond = createLink("cookies");

  const createShell = (): Shell =>
    ({
      navigation: {
        footer: {
          primary: [
            {
              id: "explore",
              label: "Explore",
              links: [primaryFirst, primarySecond],
            },
            {
              id: "information",
              label: "Information",
              links: [primaryThird],
            },
          ],
          legal: {
            label: "Legal",
            links: [legalFirst, legalSecond],
          },
        },
      },
      footer: {
        conservation: {
          heading: "Conservation",
          conservations: [
            {
              id: "ewt",
              link: conservationFirst,
            },
            {
              id: "rspb",
              link: conservationSecond,
            },
          ],
        },
        colophon: {
          text: "Wildlife photography and field notes",
        },
      },
    }) as unknown as Shell;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedLink.mockImplementation(({ link }) => link);
  });

  it("resolves primary navigation sections in order", () => {
    const shell = createShell();

    const result = resolveFooterPageDocumentAppRenderContext({ shell });

    expect(result.navigation).toHaveLength(2);
    expect(result.navigation[0]).toEqual({
      id: "explore",
      label: "Explore",
      links: [primaryFirst, primarySecond],
    });
    expect(result.navigation[1]).toEqual({
      id: "information",
      label: "Information",
      links: [primaryThird],
    });
  });

  it("forwards every primary navigation link", () => {
    const shell = createShell();

    resolveFooterPageDocumentAppRenderContext({ shell });

    expect(mockedLink).toHaveBeenNthCalledWith(1, {
      link: primaryFirst,
    });
    expect(mockedLink).toHaveBeenNthCalledWith(2, {
      link: primarySecond,
    });
    expect(mockedLink).toHaveBeenNthCalledWith(3, {
      link: primaryThird,
    });
  });

  it("resolves conservation links while preserving item IDs", () => {
    const shell = createShell();

    const result = resolveFooterPageDocumentAppRenderContext({ shell });

    expect(result.conservation).toEqual({
      heading: "Conservation",
      items: [
        {
          id: "ewt",
          link: conservationFirst,
        },
        {
          id: "rspb",
          link: conservationSecond,
        },
      ],
    });

    expect(mockedLink).toHaveBeenNthCalledWith(4, {
      link: conservationFirst,
    });
    expect(mockedLink).toHaveBeenNthCalledWith(5, {
      link: conservationSecond,
    });
  });

  it("resolves legal links in order", () => {
    const shell = createShell();

    const result = resolveFooterPageDocumentAppRenderContext({ shell });

    expect(result.legal).toEqual({
      label: "Legal",
      links: [legalFirst, legalSecond],
    });

    expect(mockedLink).toHaveBeenNthCalledWith(6, {
      link: legalFirst,
    });
    expect(mockedLink).toHaveBeenNthCalledWith(7, {
      link: legalSecond,
    });

    expect(mockedLink).toHaveBeenCalledTimes(7);
  });

  it("preserves the colophon by reference", () => {
    const shell = createShell();

    const result = resolveFooterPageDocumentAppRenderContext({ shell });

    expect(result.colophon).toBe(shell.footer.colophon);
  });

  it("preserves exact resolved link references", () => {
    const first = {
      href: "/resolved-photography",
      label: "Resolved photography",
    } as unknown as ResolvedLink;

    mockedLink.mockReturnValueOnce(first);

    const result = resolveFooterPageDocumentAppRenderContext({
      shell: createShell(),
    });

    expect(result.navigation[0]?.links[0]).toBe(first);
  });

  it("supports empty navigation and conservation collections", () => {
    const shell = createShell();

    const emptyShell = {
      ...shell,
      navigation: {
        ...shell.navigation,
        footer: {
          ...shell.navigation.footer,
          primary: [],
          legal: {
            ...shell.navigation.footer.legal,
            links: [],
          },
        },
      },
      footer: {
        ...shell.footer,
        conservation: {
          ...shell.footer.conservation,
          conservations: [],
        },
      },
    } as Shell;

    const result = resolveFooterPageDocumentAppRenderContext({
      shell: emptyShell,
    });

    expect(result.navigation).toEqual([]);
    expect(result.conservation.items).toEqual([]);
    expect(result.legal.links).toEqual([]);
    expect(mockedLink).not.toHaveBeenCalled();
  });

  it("creates new navigation and conservation structures", () => {
    const shell = createShell();

    const result = resolveFooterPageDocumentAppRenderContext({ shell });

    expect(result.navigation).not.toBe(shell.navigation.footer.primary);
    expect(result.navigation[0]).not.toBe(shell.navigation.footer.primary[0]);

    expect(result.conservation.items).not.toBe(
      shell.footer.conservation.conservations,
    );

    expect(result.legal.links).not.toBe(shell.navigation.footer.legal.links);
  });

  it("propagates link resolution errors", () => {
    const error = new Error("Footer link resolution failed");

    mockedLink.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveFooterPageDocumentAppRenderContext({
        shell: createShell(),
      }),
    ).toThrow(error);

    expect(mockedLink).toHaveBeenCalledTimes(1);
  });

  it("propagates errors from conservation links", () => {
    const error = new Error("Conservation link failed");

    mockedLink
      .mockReturnValueOnce(primaryFirst)
      .mockReturnValueOnce(primarySecond)
      .mockReturnValueOnce(primaryThird)
      .mockImplementationOnce(() => {
        throw error;
      });

    expect(() =>
      resolveFooterPageDocumentAppRenderContext({
        shell: createShell(),
      }),
    ).toThrow(error);

    expect(mockedLink).toHaveBeenCalledTimes(4);
  });

  it("propagates errors from legal links", () => {
    const error = new Error("Legal link failed");

    mockedLink.mockImplementation(({ link }) => {
      if (link === legalFirst) {
        throw error;
      }

      return link;
    });

    expect(() =>
      resolveFooterPageDocumentAppRenderContext({
        shell: createShell(),
      }),
    ).toThrow(error);

    expect(mockedLink).toHaveBeenCalledTimes(6);
  });

  it("does not mutate the original shell collections", () => {
    const shell = createShell();

    const primary = shell.navigation.footer.primary;
    const conservation = shell.footer.conservation.conservations;
    const legal = shell.navigation.footer.legal.links;

    resolveFooterPageDocumentAppRenderContext({ shell });

    expect(shell.navigation.footer.primary).toBe(primary);
    expect(shell.footer.conservation.conservations).toBe(conservation);
    expect(shell.navigation.footer.legal.links).toBe(legal);
  });
});
