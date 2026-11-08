// src/app/life-cycle/app-resolve/resolvers/registry/structured-data/structured-data.registry.resolver.app-resolve.test.ts

import type { Graph } from "schema-dts";

import { resolveStructuredDataRegistryAppResolve } from "./structured-data.registry.resolver.app-resolve";

import { resolveGlobalStructuredDataAppResolve } from "../../structured-data/global/global.structured-data.resolver.app-resolve";
import { resolveDerivedStructuredDataAppResolve } from "../../structured-data/derived/derived.structured-data.resolver.app-resolve";
import { resolveAuthoredStructuredDataAppResolve } from "../../structured-data/authored/authored.structured-data.resolver.app-resolve";

jest.mock(
  "../../structured-data/global/global.structured-data.resolver.app-resolve",
  () => ({
    resolveGlobalStructuredDataAppResolve: jest.fn(),
  }),
);

jest.mock(
  "../../structured-data/derived/derived.structured-data.resolver.app-resolve",
  () => ({
    resolveDerivedStructuredDataAppResolve: jest.fn(),
  }),
);

jest.mock(
  "../../structured-data/authored/authored.structured-data.resolver.app-resolve",
  () => ({
    resolveAuthoredStructuredDataAppResolve: jest.fn(),
  }),
);

const mockedGlobal = jest.mocked(resolveGlobalStructuredDataAppResolve);
const mockedDerived = jest.mocked(resolveDerivedStructuredDataAppResolve);
const mockedAuthored = jest.mocked(resolveAuthoredStructuredDataAppResolve);

type Input = Parameters<typeof resolveStructuredDataRegistryAppResolve>[0];

type GraphNode = Graph["@graph"][number];

describe("Structured data registry AppResolve resolver", () => {
  const node = (value: Record<string, unknown>): GraphNode =>
    value as unknown as GraphNode;

  const website = node({
    "@type": "WebSite",
    "@id": "https://kevinellen.com/#website",
    name: "Test Photography",
  });

  const person = node({
    "@type": "Person",
    "@id": "https://kevinellen.com/#person",
    name: "Test Photographer",
  });

  const article = node({
    "@type": "Article",
    "@id": "https://kevinellen.com/journals/forest#article",
    headline: "Forest Journal",
  });

  const input = {
    person: { name: "Test Photographer" },
    site: {
      name: "Test Photography",
      canonicalDomain: "https://kevinellen.com",
    },
    resolvedSite: {
      canonicalDomain: "https://kevinellen.com",
    },
    content: {
      structuredData: {
        "@context": "https://schema.org",
        "@graph": [],
      },
    },
  } as unknown as Input;

  const resolve = () => resolveStructuredDataRegistryAppResolve(input);

  beforeEach(() => {
    jest.resetAllMocks();

    mockedGlobal.mockReturnValue([person, website]);
    mockedDerived.mockReturnValue([article]);
    mockedAuthored.mockReturnValue([]);
  });

  it("merges equivalent string and array entity types", () => {
    mockedAuthored.mockReturnValue([
      node({
        "@type": ["Person"],
        "@id": "https://kevinellen.com/#person",
        description: "Wildlife photographer",
      }),
    ]);

    expect(resolve()[0]).toMatchObject({
      "@type": ["Person"],
      name: "Test Photographer",
      description: "Wildlife photographer",
    });
  });

  it("merges equivalent array and string entity types", () => {
    mockedGlobal.mockReturnValue([
      node({
        "@type": ["Person"],
        "@id": "https://kevinellen.com/#person",
        name: "Test Photographer",
      }),
      website,
    ]);

    mockedAuthored.mockReturnValue([
      node({
        "@type": "Person",
        "@id": "https://kevinellen.com/#person",
        description: "Wildlife photographer",
      }),
    ]);

    expect(resolve()[0]).toMatchObject({
      "@type": "Person",
      name: "Test Photographer",
      description: "Wildlife photographer",
    });
  });

  it("rejects entity types with different array lengths", () => {
    mockedAuthored.mockReturnValue([
      node({
        "@type": ["Person", "Organization"],
        "@id": "https://kevinellen.com/#person",
      }),
    ]);

    expect(resolve).toThrow(
      'Conflicting structured data types for entity "https://kevinellen.com/#person".',
    );
  });

  it("merges equivalent type arrays regardless of ordering", () => {
    mockedGlobal.mockReturnValue([
      node({
        "@type": ["Person", "Organization"],
        "@id": "https://kevinellen.com/#person",
        name: "Test Photographer",
      }),
      website,
    ]);

    mockedAuthored.mockReturnValue([
      node({
        "@type": ["Organization", "Person"],
        "@id": "https://kevinellen.com/#person",
        description: "Wildlife photographer",
      }),
    ]);

    expect(resolve()[0]).toMatchObject({
      "@type": ["Organization", "Person"],
      name: "Test Photographer",
      description: "Wildlife photographer",
    });
  });

  it("passes person and site configuration to the global resolver", () => {
    resolve();

    expect(mockedGlobal).toHaveBeenCalledTimes(1);
    expect(mockedGlobal).toHaveBeenCalledWith({
      person: input.person,
      site: input.site,
    });
  });

  it("passes content and resolved site configuration to the derived resolver", () => {
    resolve();

    expect(mockedDerived).toHaveBeenCalledTimes(1);
    expect(mockedDerived).toHaveBeenCalledWith({
      content: input.content,
      site: input.resolvedSite,
    });
  });

  it("derives the authored graph origin from the global WebSite identifier", () => {
    resolve();

    expect(mockedAuthored).toHaveBeenCalledTimes(1);
    expect(mockedAuthored).toHaveBeenCalledWith({
      structuredData: input.content.structuredData,
      origin: "https://kevinellen.com",
    });
  });

  it("returns global, derived and authored entities in order", () => {
    const authored = node({
      "@type": "ImageObject",
      "@id": "https://kevinellen.com/#image",
    });

    mockedAuthored.mockReturnValue([authored]);

    expect(resolve()).toEqual([person, website, article, authored]);
  });

  it("returns the global graph when the other graphs are empty", () => {
    mockedDerived.mockReturnValue([]);
    mockedAuthored.mockReturnValue([]);

    expect(resolve()).toEqual([person, website]);
  });

  it("merges entities sharing the same identifier", () => {
    const authoredPerson = node({
      "@type": "Person",
      "@id": "https://kevinellen.com/#person",
      description: "Wildlife photographer",
      sameAs: ["https://example.com/profile"],
    });

    mockedAuthored.mockReturnValue([authoredPerson]);

    expect(resolve()).toEqual([
      node({
        "@type": "Person",
        "@id": "https://kevinellen.com/#person",
        name: "Test Photographer",
        description: "Wildlife photographer",
        sameAs: ["https://example.com/profile"],
      }),
      website,
      article,
    ]);
  });

  it("lets later entities override earlier properties with the same ID", () => {
    mockedAuthored.mockReturnValue([
      node({
        "@type": "Person",
        "@id": "https://kevinellen.com/#person",
        name: "Updated Photographer",
      }),
    ]);

    expect(resolve()[0]).toMatchObject({
      "@type": "Person",
      name: "Updated Photographer",
    });
  });

  it("preserves entity ordering when merging duplicates", () => {
    mockedAuthored.mockReturnValue([
      node({
        "@type": "Person",
        "@id": "https://kevinellen.com/#person",
        description: "Updated details",
      }),
    ]);

    const result = resolve();

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      "@type": "Person",
      description: "Updated details",
    });
    expect(result[1]).toEqual(website);
    expect(result[2]).toEqual(article);
  });

  it("retains all entities without identifiers", () => {
    const first = node({
      "@type": "BreadcrumbList",
      name: "First",
    });

    const second = node({
      "@type": "BreadcrumbList",
      name: "Second",
    });

    mockedDerived.mockReturnValue([first]);
    mockedAuthored.mockReturnValue([second]);

    expect(resolve()).toEqual([person, website, first, second]);
  });

  it("appends unidentified entities after identified entities", () => {
    const unidentified = node({
      "@type": "BreadcrumbList",
    });

    mockedGlobal.mockReturnValue([unidentified, person, website]);

    expect(resolve()).toEqual([person, website, article, unidentified]);
  });

  it("rejects conflicting entity types for the same identifier", () => {
    mockedAuthored.mockReturnValue([
      node({
        "@type": "Organization",
        "@id": "https://kevinellen.com/#person",
      }),
    ]);

    expect(resolve).toThrow(
      'Conflicting structured data types for entity "https://kevinellen.com/#person".',
    );
  });

  it("allows duplicate identifiers when the existing type is absent", () => {
    mockedGlobal.mockReturnValue([
      node({
        "@id": "https://kevinellen.com/#person",
        name: "Test Photographer",
      }),
      website,
    ]);

    mockedAuthored.mockReturnValue([
      node({
        "@type": "Person",
        "@id": "https://kevinellen.com/#person",
      }),
    ]);

    expect(resolve()[0]).toMatchObject({
      "@id": "https://kevinellen.com/#person",
      "@type": "Person",
      name: "Test Photographer",
    });
  });

  it("allows duplicate identifiers when the incoming type is absent", () => {
    mockedAuthored.mockReturnValue([
      node({
        "@id": "https://kevinellen.com/#person",
        description: "Additional details",
      }),
    ]);

    expect(resolve()[0]).toMatchObject({
      "@type": "Person",
      name: "Test Photographer",
      description: "Additional details",
    });
  });

  it("allows duplicate identifiers when both types are absent", () => {
    mockedGlobal.mockReturnValue([
      node({
        "@id": "https://kevinellen.com/#person",
        name: "Test Photographer",
      }),
      website,
    ]);

    mockedAuthored.mockReturnValue([
      node({
        "@id": "https://kevinellen.com/#person",
        description: "Additional details",
      }),
    ]);

    expect(resolve()[0]).toEqual(
      node({
        "@id": "https://kevinellen.com/#person",
        name: "Test Photographer",
        description: "Additional details",
      }),
    );
  });

  it("rejects a global graph without a WebSite entity", () => {
    mockedGlobal.mockReturnValue([person]);

    expect(resolve).toThrow(
      "Cannot resolve structured data: WebSite identifier is missing.",
    );

    expect(mockedAuthored).not.toHaveBeenCalled();
  });

  it("rejects a WebSite entity without an identifier", () => {
    mockedGlobal.mockReturnValue([person, node({ "@type": "WebSite" })]);

    expect(resolve).toThrow(
      "Cannot resolve structured data: WebSite identifier is missing.",
    );
  });

  it("rejects a non-string WebSite identifier", () => {
    mockedGlobal.mockReturnValue([
      person,
      node({
        "@type": "WebSite",
        "@id": 123,
      }),
    ]);

    expect(resolve).toThrow(
      "Cannot resolve structured data: WebSite identifier is missing.",
    );
  });

  it("propagates invalid WebSite URL errors", () => {
    mockedGlobal.mockReturnValue([
      person,
      node({
        "@type": "WebSite",
        "@id": "invalid-url",
      }),
    ]);

    expect(resolve).toThrow("Invalid URL");
  });

  it("propagates errors from global resolution", () => {
    const error = new Error("Global resolution failed");

    mockedGlobal.mockImplementation(() => {
      throw error;
    });

    expect(resolve).toThrow(error);
    expect(mockedDerived).not.toHaveBeenCalled();
    expect(mockedAuthored).not.toHaveBeenCalled();
  });

  it("propagates errors from derived resolution", () => {
    const error = new Error("Derived resolution failed");

    mockedDerived.mockImplementation(() => {
      throw error;
    });

    expect(resolve).toThrow(error);
    expect(mockedAuthored).not.toHaveBeenCalled();
  });

  it("propagates errors from authored resolution", () => {
    const error = new Error("Authored resolution failed");

    mockedAuthored.mockImplementation(() => {
      throw error;
    });

    expect(resolve).toThrow(error);
  });

  it("does not mutate the source graph arrays", () => {
    const globalGraph = Object.freeze([person, website]);
    const derivedGraph = Object.freeze([article]);

    mockedGlobal.mockReturnValue(globalGraph);
    mockedDerived.mockReturnValue(derivedGraph);

    const result = resolve();

    expect(globalGraph).toEqual([person, website]);
    expect(derivedGraph).toEqual([article]);
    expect(result).not.toBe(globalGraph);
    expect(result).not.toBe(derivedGraph);
  });
});
