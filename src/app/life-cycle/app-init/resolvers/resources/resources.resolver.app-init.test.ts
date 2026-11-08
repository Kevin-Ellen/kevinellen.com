// src/app/life-cycle/app-init/resolvers/resources/resources.resolver.app-init.test.ts

import { resolveResourcesConfigAppInit } from "./resources.resolver.app-init";

type Input = Parameters<typeof resolveResourcesConfigAppInit>[0];
type Authored = Input["authored"];
type Preload = Authored["preloads"][number];

describe("Resources config AppInit resolver", () => {
  const createPreload = (overrides: Partial<Preload> = {}): Preload => ({
    href: "/assets/fonts/site.woff2",
    as: "font",
    ...overrides,
  });

  const createAuthored = (preloads: Authored["preloads"] = []): Authored => ({
    preloads,
  });

  const resolve = (authored: Authored) =>
    resolveResourcesConfigAppInit({ authored });

  it("returns an empty preloads array", () => {
    expect(resolve(createAuthored()).preloads).toEqual([]);
  });

  it("normalises an omitted type to null", () => {
    const result = resolve(createAuthored([createPreload()]));

    expect(result.preloads[0]?.type).toBeNull();
  });

  it("normalises an omitted crossorigin to null", () => {
    const result = resolve(createAuthored([createPreload()]));

    expect(result.preloads[0]?.crossorigin).toBeNull();
  });

  it("normalises explicitly undefined optional values", () => {
    const result = resolve(
      createAuthored([
        createPreload({
          type: undefined,
          crossorigin: undefined,
        }),
      ]),
    );

    expect(result.preloads[0]).toMatchObject({
      type: null,
      crossorigin: null,
    });
  });

  it("preserves an explicitly authored type", () => {
    const result = resolve(
      createAuthored([
        createPreload({
          type: "font/woff2",
        }),
      ]),
    );

    expect(result.preloads[0]?.type).toBe("font/woff2");
  });

  it("preserves an explicitly authored crossorigin value", () => {
    const preload = createPreload();

    const authoredValue = "anonymous" as NonNullable<Preload["crossorigin"]>;

    const result = resolve(
      createAuthored([
        {
          ...preload,
          crossorigin: authoredValue,
        },
      ]),
    );

    expect(result.preloads[0]?.crossorigin).toBe(authoredValue);
  });

  it("preserves explicit type and crossorigin together", () => {
    const crossorigin = "anonymous" as NonNullable<Preload["crossorigin"]>;

    const result = resolve(
      createAuthored([
        createPreload({
          type: "font/woff2",
          crossorigin,
        }),
      ]),
    );

    expect(result.preloads[0]).toMatchObject({
      type: "font/woff2",
      crossorigin,
    });
  });

  it("resolves multiple preloads in authored order", () => {
    const preloads = [
      createPreload({
        href: "/assets/fonts/first.woff2",
      }),
      createPreload({
        href: "/assets/fonts/second.woff2",
      }),
    ];

    const result = resolve(createAuthored(preloads));

    expect(result.preloads).toHaveLength(2);
    expect(result.preloads[0]?.href).toBe("/assets/fonts/first.woff2");
    expect(result.preloads[1]?.href).toBe("/assets/fonts/second.woff2");
  });

  it("preserves unrelated preload properties", () => {
    const preload = {
      ...createPreload(),
      customProperty: "preserved",
    };

    const result = resolve(createAuthored([preload]));

    expect(result.preloads[0]).toMatchObject({
      customProperty: "preserved",
    });
  });

  it("does not mutate authored preloads", () => {
    const preload = createPreload();
    const authored = createAuthored([preload]);

    const original = {
      ...preload,
    };

    resolve(authored);

    expect(preload).toEqual(original);
    expect(authored.preloads[0]).toBe(preload);
  });

  it("creates new preload objects and arrays", () => {
    const authored = createAuthored([createPreload()]);

    const result = resolve(authored);

    expect(result).not.toBe(authored);
    expect(result.preloads).not.toBe(authored.preloads);
    expect(result.preloads[0]).not.toBe(authored.preloads[0]);
  });

  it("supports frozen authored preloads", () => {
    const preload = Object.freeze(createPreload());

    const authored = Object.freeze(createAuthored(Object.freeze([preload])));

    const result = resolve(authored);

    expect(result.preloads[0]?.href).toBe("/assets/fonts/site.woff2");
  });
});
