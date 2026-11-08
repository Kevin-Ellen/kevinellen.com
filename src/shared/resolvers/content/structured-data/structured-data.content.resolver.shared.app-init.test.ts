// src/shared/resolvers/content/structured-data/structured-data.content.resolver.shared.app-init.test.ts

import type { StructuredDataContentAuthored } from "../../../../content-schema/content/structured-data.content.content-schema.authored.type";

import { resolveStructuredDataAppInit } from "./structured-data.content.resolver.shared.app-init";

describe("Structured data AppInit resolver", () => {
  const createAuthored = (
    graph: StructuredDataContentAuthored["@graph"] = [],
  ): StructuredDataContentAuthored => ({
    "@graph": graph,
  });

  it("does not retain unrelated authored properties", () => {
    const authored = {
      "@graph": [],
      customProperty: "not part of resolved output",
    };

    const result = resolveStructuredDataAppInit(authored);

    expect(result).not.toHaveProperty("customProperty");
    expect(Object.keys(result).sort()).toEqual(["@context", "@graph"]);
  });

  it("returns the Schema.org context", () => {
    const result = resolveStructuredDataAppInit(createAuthored());

    expect(result["@context"]).toBe("https://schema.org");
  });

  it("resolves an empty graph", () => {
    const result = resolveStructuredDataAppInit(createAuthored());

    expect(result).toEqual({
      "@context": "https://schema.org",
      "@graph": [],
    });
  });

  it("preserves a single structured data entity", () => {
    const entity = {
      "@type": "Person",
      "@id": "https://kevinellen.com/#person",
      name: "Kevin Ellen",
    };

    const result = resolveStructuredDataAppInit(createAuthored([entity]));

    expect(result["@graph"]).toEqual([entity]);
  });

  it("preserves multiple graph entities in order", () => {
    const graph = [
      {
        "@type": "Person",
        name: "Kevin Ellen",
      },
      {
        "@type": "WebSite",
        name: "Kevin Ellen Photography",
      },
      {
        "@type": "WebPage",
        name: "About",
      },
    ];

    const result = resolveStructuredDataAppInit(createAuthored(graph));

    expect(result["@graph"]).toEqual(graph);
  });

  it("preserves the original graph reference", () => {
    const graph = [
      {
        "@type": "Photograph",
        name: "Red fox",
      },
    ];

    const result = resolveStructuredDataAppInit(createAuthored(graph));

    expect(result["@graph"]).toBe(graph);
  });

  it("preserves nested entity references", () => {
    const author = {
      "@type": "Person",
      name: "Kevin Ellen",
    };

    const graph = [
      {
        "@type": "Photograph",
        creator: author,
      },
    ];

    const result = resolveStructuredDataAppInit(createAuthored(graph));

    expect(result["@graph"][0]).toBe(graph[0]);
  });

  it("does not mutate authored structured data", () => {
    const graph = [
      {
        "@type": "Person",
        name: "Kevin Ellen",
      },
    ];

    const authored = createAuthored(graph);
    const original = { ...authored };

    resolveStructuredDataAppInit(authored);

    expect(authored).toEqual(original);
    expect(authored["@graph"]).toBe(graph);
  });

  it("returns a new wrapper object", () => {
    const authored = createAuthored();

    const result = resolveStructuredDataAppInit(authored);

    expect(result).not.toBe(authored);
  });

  it("returns a fresh wrapper on repeated resolution", () => {
    const authored = createAuthored();

    const first = resolveStructuredDataAppInit(authored);
    const second = resolveStructuredDataAppInit(authored);

    expect(first).toEqual(second);
    expect(first).not.toBe(second);

    expect(first["@graph"]).toBe(second["@graph"]);
  });

  it("does not retain unrelated authored properties", () => {
    const authored = {
      "@graph": [],
      customProperty: "not part of resolved output",
    } as unknown as StructuredDataContentAuthored;

    const result = resolveStructuredDataAppInit(authored);

    expect(result).not.toHaveProperty("customProperty");
    expect(Object.keys(result).sort()).toEqual(["@context", "@graph"]);
  });
});
