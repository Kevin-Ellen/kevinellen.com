// src/shared/resolvers/content/components/editorial-photo/editorial-photo.component.content.resolver.shared.app-init.test.ts

import type { EditorialPhotoComponentContentAuthored } from "../../../../../content-schema/content/components/editorial-photo.component.content.content-schema.authored.type";

import { resolveEditorialPhotoComponentContentAppInit } from "./editorial-photo.component.content.resolver.shared.app-init";

type Input = Parameters<typeof resolveEditorialPhotoComponentContentAppInit>[0];

describe("Editorial photo component AppInit resolver", () => {
  const createAuthored = (
    overrides: Record<string, unknown> = {},
  ): EditorialPhotoComponentContentAuthored =>
    ({
      kind: "editorialPhoto",
      photoId: "forest-fox",
      ...overrides,
    }) as unknown as EditorialPhotoComponentContentAuthored;

  const resolve = (authored: Input["authored"]) =>
    resolveEditorialPhotoComponentContentAppInit({
      authored,
    });

  it("preserves all authored properties", () => {
    const authored = createAuthored({
      photoId: "forest-fox",
      caption: "A fox in Epping Forest",
    });

    expect(resolve(authored)).toEqual(authored);
  });

  it("returns a new component object", () => {
    const authored = createAuthored();

    const result = resolve(authored);

    expect(result).not.toBe(authored);
  });

  it("preserves nested object references", () => {
    const metadata = {
      attribution: "Kevin Ellen",
    };

    const authored = createAuthored({ metadata });

    const result = resolve(authored);

    expect((result as unknown as { metadata: typeof metadata }).metadata).toBe(
      metadata,
    );
  });

  it("does not mutate the authored component", () => {
    const authored = createAuthored();

    const original = { ...authored };

    resolve(authored);

    expect(authored).toEqual(original);
  });

  it("supports frozen authored components", () => {
    const authored = Object.freeze(createAuthored());

    const result = resolve(authored);

    expect(result).toEqual(authored);
    expect(result).not.toBe(authored);
  });

  it("returns a fresh object on each invocation", () => {
    const authored = createAuthored();

    const first = resolve(authored);
    const second = resolve(authored);

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });
});
