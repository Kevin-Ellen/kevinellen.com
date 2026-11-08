// src/app/life-cycle/app-resolve/resolvers/structured-data/authored/authored.structured-data.resolver.app-resolve.test.ts

import { resolveAuthoredStructuredDataAppResolve } from "./authored.structured-data.resolver.app-resolve";

type Input = Parameters<typeof resolveAuthoredStructuredDataAppResolve>[0];

type StructuredData = NonNullable<Input["structuredData"]>;

describe("Authored structured data AppResolve resolver", () => {
  const origin = "https://kevinellen.com";

  const createStructuredData = (graph: unknown[]): StructuredData =>
    ({
      "@context": "https://schema.org",
      "@graph": graph,
    }) as unknown as StructuredData;

  const resolve = (graph: unknown[], base = origin) =>
    resolveAuthoredStructuredDataAppResolve({
      structuredData: createStructuredData(graph),
      origin: base,
    });

  it("returns an empty graph when structured data is absent", () => {
    expect(
      resolveAuthoredStructuredDataAppResolve({
        structuredData: null,
        origin,
      }),
    ).toEqual([]);
  });

  it("returns an empty authored graph", () => {
    expect(resolve([])).toEqual([]);
  });

  it.each(["@id", "url", "sameAs", "image", "contentUrl", "thumbnailUrl"])(
    "resolves root-relative URLs for %s",
    (property) => {
      const result = resolve([
        {
          "@type": "Thing",
          [property]: "/assets/example",
        },
      ]);

      expect(result).toEqual([
        {
          "@type": "Thing",
          [property]: "https://kevinellen.com/assets/example",
        },
      ]);
    },
  );

  it("resolves nested objects recursively", () => {
    const result = resolve([
      {
        "@type": "Article",
        author: {
          "@type": "Person",
          "@id": "/#person",
          image: {
            "@type": "ImageObject",
            contentUrl: "/images/portrait.jpg",
          },
        },
      },
    ]);

    expect(result).toEqual([
      {
        "@type": "Article",
        author: {
          "@type": "Person",
          "@id": "https://kevinellen.com/#person",
          image: {
            "@type": "ImageObject",
            contentUrl: "https://kevinellen.com/images/portrait.jpg",
          },
        },
      },
    ]);
  });

  it("resolves URL arrays without changing their order", () => {
    const result = resolve([
      {
        "@type": "Person",
        sameAs: ["/profile/one", "https://example.com/profile", "/profile/two"],
      },
    ]);

    expect(result).toEqual([
      {
        "@type": "Person",
        sameAs: [
          "https://kevinellen.com/profile/one",
          "https://example.com/profile",
          "https://kevinellen.com/profile/two",
        ],
      },
    ]);
  });

  it("resolves deeply nested URL arrays", () => {
    const result = resolve([
      {
        "@type": "ImageGallery",
        hasPart: [
          {
            "@type": "ImageObject",
            thumbnailUrl: "/thumbs/first.jpg",
          },
          {
            "@type": "ImageObject",
            thumbnailUrl: "/thumbs/second.jpg",
          },
        ],
      },
    ]);

    expect(result).toEqual([
      {
        "@type": "ImageGallery",
        hasPart: [
          {
            "@type": "ImageObject",
            thumbnailUrl: "https://kevinellen.com/thumbs/first.jpg",
          },
          {
            "@type": "ImageObject",
            thumbnailUrl: "https://kevinellen.com/thumbs/second.jpg",
          },
        ],
      },
    ]);
  });

  it("preserves unrelated strings beginning with a slash", () => {
    const result = resolve([
      {
        "@type": "Thing",
        name: "/Not a URL property",
        description: "/A descriptive value",
        customProperty: "/unchanged",
      },
    ]);

    expect(result).toEqual([
      {
        "@type": "Thing",
        name: "/Not a URL property",
        description: "/A descriptive value",
        customProperty: "/unchanged",
      },
    ]);
  });

  it("preserves absolute and non-root-relative URLs", () => {
    const result = resolve([
      {
        "@type": "Thing",
        url: "https://example.com/page",
        sameAs: "profile/example",
        image: "data:image/svg+xml,example",
      },
    ]);

    expect(result).toEqual([
      {
        "@type": "Thing",
        url: "https://example.com/page",
        sameAs: "profile/example",
        image: "data:image/svg+xml,example",
      },
    ]);
  });

  it("preserves null, numeric and boolean values", () => {
    const result = resolve([
      {
        "@type": "Thing",
        url: null,
        position: 2,
        isAccessibleForFree: true,
      },
    ]);

    expect(result).toEqual([
      {
        "@type": "Thing",
        url: null,
        position: 2,
        isAccessibleForFree: true,
      },
    ]);
  });

  it("preserves root-relative URL query strings and fragments", () => {
    const result = resolve([
      {
        "@id": "/journals/fox?view=full#photographs",
      },
    ]);

    expect(result).toEqual([
      {
        "@id": "https://kevinellen.com/journals/fox?view=full#photographs",
      },
    ]);
  });

  it("uses the provided origin", () => {
    const result = resolve(
      [{ url: "/about" }],
      "https://staging.kevinellen.com",
    );

    expect(result).toEqual([
      {
        url: "https://staging.kevinellen.com/about",
      },
    ]);
  });

  it("does not mutate the authored graph", () => {
    const item = Object.freeze({
      "@type": "Thing",
      url: "/about",
    });

    const graph = Object.freeze([item]);

    const result = resolveAuthoredStructuredDataAppResolve({
      structuredData: createStructuredData([...graph]),
      origin,
    });

    expect(item.url).toBe("/about");
    expect(result).not.toBe(graph);
    expect(result).toEqual([
      {
        "@type": "Thing",
        url: "https://kevinellen.com/about",
      },
    ]);
  });

  it("propagates invalid origin errors for populated structured data", () => {
    expect(() => resolve([{ url: "/about" }], "invalid-origin")).toThrow(
      "Invalid URL",
    );
  });
});
