// src/app/life-cycle/app-init/resolvers/navigation/navigation.resolver.app-init.test.ts

import { resolveLinkAppInit } from "../../../../../shared/resolvers/content/primitives/link/link.primitive.content.resolver.shared.app-init";
import { resolveNavigationConfigAppInit } from "./navigation.resolver.app-init";

jest.mock(
  "../../../../../shared/resolvers/content/primitives/link/link.primitive.content.resolver.shared.app-init",
  () => ({
    resolveLinkAppInit: jest.fn(),
  }),
);

const mockedLinkResolver = jest.mocked(resolveLinkAppInit);

type Input = Parameters<typeof resolveNavigationConfigAppInit>[0];
type Authored = Input["authored"];
type Link = Authored["primary"][number];
type ResolvedLink = ReturnType<typeof resolveLinkAppInit>;

describe("Navigation config AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];

  const createLink = (label: string): Link => ({
    kind: "internal",
    label,
    pageId: label.toLowerCase(),
  });

  const createAuthored = (): Authored =>
    ({
      branding: createLink("Home"),
      primary: [createLink("Photography"), createLink("Journals")],
      social: [createLink("Instagram")],
      footer: {
        primary: [
          {
            heading: "Explore",
            links: [createLink("About"), createLink("Topics")],
          },
        ],
        legal: {
          heading: "Legal",
          links: [createLink("Privacy")],
        },
      },
    }) as unknown as Authored;

  const resolve = (authored: Authored) =>
    resolveNavigationConfigAppInit({
      authored,
      svgAssets,
      socialProfiles,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedLinkResolver.mockImplementation(
      ({ authored }) => ({ ...authored }) as ResolvedLink,
    );
  });

  it("resolves branding first", () => {
    const authored = createAuthored();

    resolve(authored);

    expect(mockedLinkResolver).toHaveBeenNthCalledWith(1, {
      authored: authored.branding,
      svgAssets,
      socialProfiles,
    });
  });

  it("resolves all navigation links in the expected order", () => {
    const authored = createAuthored();

    resolve(authored);

    const expectedLinks = [
      authored.branding,
      ...authored.primary,
      ...authored.social,
      ...authored.footer.primary.flatMap((section) => section.links),
      ...authored.footer.legal.links,
    ];

    expect(mockedLinkResolver).toHaveBeenCalledTimes(expectedLinks.length);

    expectedLinks.forEach((link, index) => {
      expect(mockedLinkResolver).toHaveBeenNthCalledWith(index + 1, {
        authored: link,
        svgAssets,
        socialProfiles,
      });
    });
  });

  it("preserves resolved links in their respective collections", () => {
    const authored = createAuthored();

    const result = resolve(authored);

    expect(result.branding).toEqual(authored.branding);
    expect(result.primary).toEqual(authored.primary);
    expect(result.social).toEqual(authored.social);

    expect(result.footer.primary[0]?.links).toEqual(
      authored.footer.primary[0]?.links,
    );

    expect(result.footer.legal.links).toEqual(authored.footer.legal.links);
  });

  it("preserves the resolved branding reference", () => {
    const resolvedLink = {
      kind: "external",
      label: "Resolved branding",
      href: "https://example.com",
    } as ResolvedLink;

    mockedLinkResolver.mockReturnValueOnce(resolvedLink);

    const result = resolve(createAuthored());

    expect(result.branding).toBe(resolvedLink);
  });

  it("preserves primary footer section properties", () => {
    const authored = createAuthored();

    const result = resolve(authored);

    expect(result.footer.primary[0]).toMatchObject({
      heading: "Explore",
    });
  });

  it("preserves legal section properties", () => {
    const authored = createAuthored();

    const result = resolve(authored);

    expect(result.footer.legal).toMatchObject({
      heading: "Legal",
    });
  });

  it("handles empty navigation collections", () => {
    const authored = createAuthored();

    const emptyAuthored: Authored = {
      ...authored,
      primary: [],
      social: [],
      footer: {
        primary: [],
        legal: {
          ...authored.footer.legal,
          links: [],
        },
      },
    };

    const result = resolve(emptyAuthored);

    expect(result.primary).toEqual([]);
    expect(result.social).toEqual([]);
    expect(result.footer.primary).toEqual([]);
    expect(result.footer.legal.links).toEqual([]);

    expect(mockedLinkResolver).toHaveBeenCalledTimes(1);
  });

  it("handles an empty footer section's links", () => {
    const authored = createAuthored();

    const input: Authored = {
      ...authored,
      footer: {
        ...authored.footer,
        primary: authored.footer.primary.map((section) => ({
          ...section,
          links: [],
        })),
      },
    };

    const result = resolve(input);

    expect(result.footer.primary[0]?.links).toEqual([]);
  });

  it("creates new navigation and collection objects", () => {
    const authored = createAuthored();

    const result = resolve(authored);

    expect(result).not.toBe(authored);
    expect(result.primary).not.toBe(authored.primary);
    expect(result.social).not.toBe(authored.social);
    expect(result.footer).not.toBe(authored.footer);
    expect(result.footer.primary).not.toBe(authored.footer.primary);
    expect(result.footer.legal).not.toBe(authored.footer.legal);
  });

  it("does not mutate authored navigation", () => {
    const authored = createAuthored();
    const snapshot = structuredClone(authored);

    resolve(authored);

    expect(authored).toEqual(snapshot);
  });

  it("propagates link resolution errors", () => {
    const error = new Error("Link resolution failed");

    mockedLinkResolver.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve(createAuthored())).toThrow(error);

    expect(mockedLinkResolver).toHaveBeenCalledTimes(1);
  });

  it("stops resolving when a footer link fails", () => {
    const authored = createAuthored();

    const footerLink = authored.footer.primary[0]?.links[0];

    mockedLinkResolver.mockImplementation(({ authored: link }) => {
      if (link === footerLink) {
        throw new Error("Footer link failed");
      }

      return { ...link } as ResolvedLink;
    });

    expect(() => resolve(authored)).toThrow("Footer link failed");

    expect(mockedLinkResolver).not.toHaveBeenCalledWith({
      authored: authored.footer.legal.links[0],
      svgAssets,
      socialProfiles,
    });
  });
});
