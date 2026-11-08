// src/shared/resolvers/content/inline/text/text.inline.content.resolver.shared.app-init.test.ts

import type { TextInlineContentAuthored } from "../../../../../content-schema/content/inline/text.inline.content.content-schema.authored.type";

import { resolveTextInlineContentAppInit } from "./text.inline.content.resolver.shared.app-init";

describe("Text inline content AppInit resolver", () => {
  const createAuthored = (
    overrides: Record<string, unknown> = {},
  ): TextInlineContentAuthored =>
    ({
      kind: "text",
      value: "Wildlife photography",
      ...overrides,
    }) as unknown as TextInlineContentAuthored;

  it("returns the authored text unchanged", () => {
    const authored = createAuthored();

    expect(resolveTextInlineContentAppInit(authored)).toEqual(authored);
  });

  it("preserves the original object reference", () => {
    const authored = createAuthored();

    const result = resolveTextInlineContentAppInit(authored);

    expect(result).toBe(authored);
  });

  it("preserves additional text properties", () => {
    const authored = createAuthored({
      value: "Epping Forest",
      emphasis: "strong",
    });

    const result = resolveTextInlineContentAppInit(authored);

    expect(result).toEqual(authored);
  });

  it("does not mutate the authored text", () => {
    const authored = createAuthored();
    const original = { ...authored };

    resolveTextInlineContentAppInit(authored);

    expect(authored).toEqual(original);
  });

  it("accepts frozen authored text", () => {
    const authored = Object.freeze(createAuthored());

    expect(resolveTextInlineContentAppInit(authored)).toBe(authored);
  });

  it("returns the same reference across repeated calls", () => {
    const authored = createAuthored();

    const first = resolveTextInlineContentAppInit(authored);
    const second = resolveTextInlineContentAppInit(authored);

    expect(first).toBe(second);
  });
});
