// src/shared/resolvers/content/modules/article-footer/article-footer.module.content.resolver.shared.app-init.test.ts

import type { ArticleFooterModuleContentAuthored } from "../../../../../content-schema/content/modules/article-footer.module.content.content-schema.authored.type";

import { resolveArticleFooterModuleContentAppInit } from "./article-footer.module.content.resolver.shared.app-init";

describe("Article footer module AppInit resolver", () => {
  type Authored = ArticleFooterModuleContentAuthored;

  const createAuthored = (overrides: Record<string, unknown> = {}): Authored =>
    ({
      kind: "articleFooter",
      ...overrides,
    }) as unknown as Authored;

  it("preserves all authored properties", () => {
    const authored = createAuthored({
      title: "Further reading",
      description: "Explore more field notes",
    });

    expect(resolveArticleFooterModuleContentAppInit({ authored })).toEqual(
      authored,
    );
  });

  it("returns a new module object", () => {
    const authored = createAuthored();

    const result = resolveArticleFooterModuleContentAppInit({
      authored,
    });

    expect(result).not.toBe(authored);
  });

  it("preserves nested property references", () => {
    const metadata = {
      category: "journal",
    };

    const authored = {
      ...createAuthored(),
      metadata,
    };

    const result = resolveArticleFooterModuleContentAppInit({
      authored,
    });

    expect(
      (
        result as typeof result & {
          metadata: typeof metadata;
        }
      ).metadata,
    ).toBe(metadata);
  });

  it("does not mutate the authored module", () => {
    const authored = createAuthored();
    const original = { ...authored };

    resolveArticleFooterModuleContentAppInit({ authored });

    expect(authored).toEqual(original);
  });

  it("supports frozen authored modules", () => {
    const authored = Object.freeze(createAuthored());

    const result = resolveArticleFooterModuleContentAppInit({
      authored,
    });

    expect(result).toEqual(authored);
    expect(result).not.toBe(authored);
  });

  it("returns a fresh object on repeated resolution", () => {
    const authored = createAuthored();

    const first = resolveArticleFooterModuleContentAppInit({
      authored,
    });

    const second = resolveArticleFooterModuleContentAppInit({
      authored,
    });

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });
});
