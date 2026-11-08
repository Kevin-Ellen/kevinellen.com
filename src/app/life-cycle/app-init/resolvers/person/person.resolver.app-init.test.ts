// src/app/life-cycle/app-init/resolvers/person/person.resolver.app-init.test.ts

import { resolvePersonConfigAppInit } from "./person.resolver.app-init";

type Input = Parameters<typeof resolvePersonConfigAppInit>[0];
type Authored = Input["authored"];

describe("Person config AppInit resolver", () => {
  const canonicalDomain = "https://kevinellen.com";

  const createAuthored = (overrides: Partial<Authored> = {}): Authored =>
    ({
      name: "Test Photographer",
      ...overrides,
    }) as Authored;

  const resolve = (authored: Authored, domain = canonicalDomain) =>
    resolvePersonConfigAppInit({
      authored,
      canonicalDomain: domain,
    });

  it("injects the canonical domain as the website", () => {
    const result = resolve(createAuthored());

    expect(result.website).toBe(canonicalDomain);
  });

  it("overrides an existing website value", () => {
    const authored = {
      ...createAuthored(),
      website: "https://old.example.com",
    };

    const result = resolve(authored);

    expect(result.website).toBe("https://kevinellen.com");
    expect(authored.website).toBe("https://old.example.com");
  });

  it("uses the supplied canonical domain for each invocation", () => {
    const authored = createAuthored();

    expect(resolve(authored, "https://example.com").website).toBe(
      "https://example.com",
    );
  });

  it("preserves the person's name", () => {
    const result = resolve(createAuthored());

    expect(result.name).toBe("Test Photographer");
  });

  it("preserves unrelated authored properties", () => {
    const socialProfiles = {
      instagram: "https://instagram.com/example",
    };

    const authored = {
      ...createAuthored(),
      socialProfiles,
    };

    const result = resolve(authored);

    expect(result.socialProfiles).toBe(socialProfiles);
  });

  it("does not mutate authored configuration", () => {
    const authored = createAuthored();
    const original = { ...authored };

    resolve(authored);

    expect(authored).toEqual(original);
  });

  it("returns a new resolved object", () => {
    const authored = createAuthored();

    const result = resolve(authored);

    expect(result).not.toBe(authored);
  });

  it("supports frozen authored configuration", () => {
    const authored = Object.freeze(createAuthored());

    const result = resolve(authored);

    expect(result.website).toBe(canonicalDomain);
  });
});
