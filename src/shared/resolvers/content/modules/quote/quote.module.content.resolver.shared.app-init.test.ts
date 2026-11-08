// src/shared/resolvers/content/modules/quote/quote.module.content.resolver.shared.app-init.test.ts

import { resolveQuoteModuleAppInit } from "./quote.module.content.resolver.shared.app-init";

type Authored = Parameters<typeof resolveQuoteModuleAppInit>[0]["authored"];

describe("Quote module AppInit resolver", () => {
  const createAuthored = (overrides: Partial<Authored> = {}): Authored =>
    ({
      kind: "quote",
      ...overrides,
    }) as unknown as Authored;

  const resolve = (authored: Authored) =>
    resolveQuoteModuleAppInit({ authored });

  it("normalises an omitted attribution to null", () => {
    expect(resolve(createAuthored()).attribution).toBeNull();
  });

  it("normalises an undefined attribution to null", () => {
    expect(
      resolve(createAuthored({ attribution: undefined })).attribution,
    ).toBeNull();
  });

  it("preserves a provided attribution", () => {
    const attribution = "Field observations";

    expect(resolve(createAuthored({ attribution })).attribution).toBe(
      attribution,
    );
  });

  it("preserves an empty attribution", () => {
    expect(resolve(createAuthored({ attribution: "" })).attribution).toBe("");
  });

  it("preserves other authored properties", () => {
    const authored = {
      ...createAuthored(),
      customProperty: "preserved",
    };

    expect(resolve(authored)).toMatchObject({
      kind: "quote",
      customProperty: "preserved",
    });
  });

  it("does not mutate the authored module", () => {
    const authored = createAuthored();
    const original = { ...authored };

    resolve(authored);

    expect(authored).toEqual(original);
  });

  it("returns a new module object", () => {
    const authored = createAuthored();

    expect(resolve(authored)).not.toBe(authored);
  });

  it("returns a fresh object on repeated resolution", () => {
    const authored = createAuthored();

    const first = resolve(authored);
    const second = resolve(authored);

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });
});
