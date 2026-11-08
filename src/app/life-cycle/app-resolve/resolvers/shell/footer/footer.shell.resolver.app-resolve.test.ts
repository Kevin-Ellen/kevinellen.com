// src/app/life-cycle/app-resolve/resolvers/shell/footer/footer.shell.resolver.app-resolve.test.ts

import { resolveFooterShellAppResolve } from "./footer.shell.resolver.app-resolve";
import { resolveLinkAppResolve } from "../../primitives/link/link.primitive.resolver.app-resolve";

jest.mock("../../primitives/link/link.primitive.resolver.app-resolve", () => ({
  resolveLinkAppResolve: jest.fn(),
}));

const mockedResolveLink = jest.mocked(resolveLinkAppResolve);

type Input = Parameters<typeof resolveFooterShellAppResolve>[0];
type Footer = Input["footer"];
type Conservation = Footer["conservation"];
type Entry = Conservation["conservations"][number];
type Link = Entry["link"];

describe("Footer shell AppResolve resolver", () => {
  const registry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["registry"];

  const createLink = (id: string): Link =>
    ({
      kind: "internal",
      pageId: id,
      label: id,
    }) as unknown as Link;

  const createEntry = (id: string): Entry => ({
    id,
    link: createLink(id),
  });

  const createFooter = (
    conservations: readonly Entry[] = [
      createEntry("first"),
      createEntry("second"),
    ],
  ): Footer =>
    ({
      conservation: {
        title: "Conservation",
        conservations,
      },
      colophon: {
        rights: "All rights reserved",
      },
    }) as unknown as Footer;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedResolveLink.mockImplementation(({ link }) => ({
      ...link,
      href: "/resolved",
    }));
  });

  it("resolves every conservation link", () => {
    const footer = createFooter();
    const result = resolveFooterShellAppResolve({ footer, registry });

    expect(mockedResolveLink).toHaveBeenCalledTimes(2);

    footer.conservation.conservations.forEach((entry, index) => {
      expect(mockedResolveLink).toHaveBeenNthCalledWith(index + 1, {
        link: entry.link,
        registry,
      });
    });

    expect(result.conservation.conservations).toMatchObject([
      { link: { href: "/resolved" } },
      { link: { href: "/resolved" } },
    ]);
  });

  it("preserves conservation entry properties", () => {
    const footer = createFooter();

    const result = resolveFooterShellAppResolve({ footer, registry });

    result.conservation.conservations.forEach((entry, index) => {
      const original = footer.conservation.conservations[index];

      expect(entry).toMatchObject({
        id: original?.id,
      });
    });
  });

  it("preserves the conservation configuration", () => {
    const footer = createFooter();

    const result = resolveFooterShellAppResolve({ footer, registry });

    expect(result.conservation).toMatchObject({
      title: "Conservation",
    });

    expect(result.conservation).not.toBe(footer.conservation);
  });

  it("preserves the original colophon reference", () => {
    const footer = createFooter();

    const result = resolveFooterShellAppResolve({ footer, registry });

    expect(result.colophon).toBe(footer.colophon);
  });

  it("supports an empty conservation collection", () => {
    const footer = createFooter([]);

    const result = resolveFooterShellAppResolve({ footer, registry });

    expect(result.conservation.conservations).toEqual([]);
    expect(mockedResolveLink).not.toHaveBeenCalled();
  });

  it("does not mutate the original conservation entries", () => {
    const footer = createFooter();

    const originalLink = footer.conservation.conservations[0]?.link;

    resolveFooterShellAppResolve({ footer, registry });

    expect(footer.conservation.conservations[0]?.link).toBe(originalLink);
  });

  it("propagates link resolution failures", () => {
    const error = new Error("Link resolution failed");

    mockedResolveLink.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveFooterShellAppResolve({
        footer: createFooter(),
        registry,
      }),
    ).toThrow(error);
  });
});
