// src/app/life-cycle/app-init/resolvers/footer/footer.resolver.app-init.test.ts

import { resolveLinkAppInit } from "../../../../../shared/resolvers/content/primitives/link/link.primitive.content.resolver.shared.app-init";
import { resolveFooterConfigAppInit } from "./footer.resolver.app-init";

jest.mock(
  "../../../../../shared/resolvers/content/primitives/link/link.primitive.content.resolver.shared.app-init",
  () => ({
    resolveLinkAppInit: jest.fn(),
  }),
);

const mockedLinkResolver = jest.mocked(resolveLinkAppInit);

type Input = Parameters<typeof resolveFooterConfigAppInit>[0];
type Authored = Input["authored"];
type Conservation = Authored["conservation"]["conservations"][number];
type Link = Conservation["link"];
type ResolvedLink = ReturnType<typeof resolveLinkAppInit>;

describe("Footer config AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const person = { name: "Test Photographer" } as Input["person"];

  const createLink = (href: string): Link => ({
    kind: "external",
    label: "Conservation organisation",
    href,
  });

  const createConservation = (href: string): Conservation =>
    ({
      link: createLink(href),
    }) as Conservation;

  const createAuthored = (
    conservations: readonly Conservation[] = [],
  ): Authored =>
    ({
      conservation: {
        conservations,
      },
      colophon: {
        rights: "All rights reserved",
      },
    }) as Authored;

  const resolve = (authored: Authored) =>
    resolveFooterConfigAppInit({
      authored,
      svgAssets,
      person,
    });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-11-04T12:00:00Z"));

    mockedLinkResolver.mockImplementation(
      ({ authored }) => ({ ...authored }) as ResolvedLink,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("handles an empty conservation collection", () => {
    const result = resolve(createAuthored());

    expect(result.conservation.conservations).toEqual([]);
    expect(mockedLinkResolver).not.toHaveBeenCalled();
  });

  it("resolves conservation links in order", () => {
    const conservations = [
      createConservation("https://example.com/first"),
      createConservation("https://example.com/second"),
    ];

    const result = resolve(createAuthored(conservations));

    expect(mockedLinkResolver).toHaveBeenCalledTimes(2);

    conservations.forEach((item, index) => {
      expect(mockedLinkResolver).toHaveBeenNthCalledWith(index + 1, {
        authored: item.link,
        svgAssets,
        socialProfiles: {},
      });
    });

    expect(result.conservation.conservations).toHaveLength(2);
  });

  it("preserves the resolved link reference", () => {
    const resolvedLink = {
      kind: "external",
      label: "Resolved",
      href: "https://example.com",
    } as ResolvedLink;

    mockedLinkResolver.mockReturnValue(resolvedLink);

    const result = resolve(
      createAuthored([createConservation("https://example.com")]),
    );

    expect(result.conservation.conservations[0]?.link).toBe(resolvedLink);
  });

  it("preserves other conservation properties", () => {
    const item = {
      ...createConservation("https://example.com"),
      description: "Protecting natural habitats",
    };

    const authored = {
      ...createAuthored([item]),
      conservation: {
        heading: "Conservation",
        conservations: [item],
      },
    } as Authored;

    const result = resolve(authored);

    expect(result.conservation).toMatchObject({
      heading: "Conservation",
      conservations: [
        {
          description: "Protecting natural habitats",
        },
      ],
    });
  });

  it("injects the current year", () => {
    expect(resolve(createAuthored()).colophon.year).toBe(2026);

    jest.setSystemTime(new Date("2027-01-01T12:00:00Z"));

    expect(resolve(createAuthored()).colophon.year).toBe(2027);
  });

  it("uses the resolved person's name", () => {
    expect(resolve(createAuthored()).colophon.name).toBe("Test Photographer");
  });

  it("preserves other authored colophon properties", () => {
    const authored: Authored = {
      ...createAuthored(),
      colophon: {
        rights: "All rights reserved",
      },
    };

    expect(resolve(authored).colophon).toMatchObject({
      rights: "All rights reserved",
      year: 2026,
      name: "Test Photographer",
    });
  });

  it("does not mutate the authored configuration", () => {
    const authored = createAuthored([
      createConservation("https://example.com"),
    ]);

    const original = {
      ...authored,
      conservation: {
        ...authored.conservation,
        conservations: [...authored.conservation.conservations],
      },
      colophon: { ...authored.colophon },
    };

    resolve(authored);

    expect(authored).toEqual(original);
  });

  it("propagates link resolution failures", () => {
    const error = new Error("Invalid conservation link");

    mockedLinkResolver.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolve(createAuthored([createConservation("https://example.com")])),
    ).toThrow(error);
  });
});
