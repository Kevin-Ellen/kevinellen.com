// src/shared/resolvers/content/components/photo/photo.component.content.resolver.shared.app-init.test.ts

import type { PhotoComponentContentAuthored } from "../../../../../content-schema/content/components/photo.component.content.content-schema.authored.type";

import { resolvePhotoComponentContentAppInit } from "./photo.component.content.resolver.shared.app-init";

type Authored = Parameters<
  typeof resolvePhotoComponentContentAppInit
>[0]["authored"];

describe("Photo component AppInit resolver", () => {
  const createAuthored = (
    overrides: Record<string, unknown> = {},
  ): PhotoComponentContentAuthored =>
    ({
      kind: "photo",
      photoId: "forest-fox",
      ...overrides,
    }) as unknown as PhotoComponentContentAuthored;

  const resolve = (authored: Authored) =>
    resolvePhotoComponentContentAppInit({ authored });

  it("preserves all authored properties", () => {
    const authored = createAuthored({
      photoId: "forest-fox",
      caption: "A fox in Epping Forest",
    });

    expect(resolve(authored)).toEqual(authored);
  });

  it("returns a new component object", () => {
    const authored = createAuthored();

    expect(resolve(authored)).not.toBe(authored);
  });

  it("preserves nested references", () => {
    const metadata = {
      photographer: "Kevin Ellen",
      location: "Epping Forest",
    };

    const authored = createAuthored({ metadata });

    const result = resolve(authored) as unknown as {
      metadata: typeof metadata;
    };

    expect(result.metadata).toBe(metadata);
  });

  it("does not mutate the authored component", () => {
    const authored = createAuthored({
      photoId: "wood-pigeon",
    });

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

  it("returns a fresh object on every invocation", () => {
    const authored = createAuthored();

    const first = resolve(authored);
    const second = resolve(authored);

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });
});
