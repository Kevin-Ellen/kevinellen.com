// src/app/life-cycle/app-resolve/resolvers/structured-data/global/website/website.global.structured-data.resolver.app-resolve.test.ts

import { resolveWebsiteAppResolve } from "./website.global.structured-data.resolver.app-resolve";

type Input = Parameters<typeof resolveWebsiteAppResolve>[0];

describe("Website structured data AppResolve resolver", () => {
  const createInput = (overrides: Partial<Input> = {}): Input => ({
    name: "Test Photography",
    description: "Wildlife and nature photography",
    canonicalDomain: "https://kevinellen.com",
    language: "en-GB",
    ...overrides,
  });

  const resolve = (overrides: Partial<Input> = {}) =>
    resolveWebsiteAppResolve(createInput(overrides));

  it("creates a WebSite schema entity", () => {
    expect(resolve()).toMatchObject({
      "@type": "WebSite",
    });
  });

  it("constructs the website identifier from the canonical domain", () => {
    expect(resolve()).toMatchObject({
      "@id": "https://kevinellen.com/#website",
    });
  });

  it("preserves the canonical website URL", () => {
    expect(resolve()).toMatchObject({
      url: "https://kevinellen.com",
    });
  });

  it("maps the name and description", () => {
    expect(
      resolve({
        name: "Example Website",
        description: "Example description",
      }),
    ).toMatchObject({
      name: "Example Website",
      description: "Example description",
    });
  });

  it("maps the configured language", () => {
    expect(
      resolve({
        language: "nl-NL",
      }),
    ).toMatchObject({
      inLanguage: "nl-NL",
    });
  });

  it("references the global Person entity as publisher", () => {
    expect(resolve()).toMatchObject({
      publisher: {
        "@id": "https://kevinellen.com/#person",
      },
    });
  });

  it("uses the supplied domain for all entity references", () => {
    expect(
      resolve({
        canonicalDomain: "https://staging.kevinellen.com",
      }),
    ).toMatchObject({
      "@id": "https://staging.kevinellen.com/#website",
      url: "https://staging.kevinellen.com",
      publisher: {
        "@id": "https://staging.kevinellen.com/#person",
      },
    });
  });

  it("normalises a trailing slash in entity identifiers", () => {
    expect(
      resolve({
        canonicalDomain: "https://kevinellen.com/",
      }),
    ).toMatchObject({
      "@id": "https://kevinellen.com/#website",
      publisher: {
        "@id": "https://kevinellen.com/#person",
      },
    });
  });

  it("returns the expected complete WebSite entity", () => {
    expect(resolve()).toEqual({
      "@type": "WebSite",
      "@id": "https://kevinellen.com/#website",
      url: "https://kevinellen.com",
      name: "Test Photography",
      description: "Wildlife and nature photography",
      inLanguage: "en-GB",
      publisher: {
        "@id": "https://kevinellen.com/#person",
      },
    });
  });

  it("does not mutate the supplied configuration", () => {
    const input = Object.freeze(createInput());

    const result = resolveWebsiteAppResolve(input);

    expect(result).toMatchObject({
      url: input.canonicalDomain,
      name: input.name,
      description: input.description,
      inLanguage: input.language,
    });
  });

  it("propagates invalid canonical URL errors", () => {
    expect(() =>
      resolve({
        canonicalDomain: "invalid-domain",
      }),
    ).toThrow("Invalid URL");
  });
});
