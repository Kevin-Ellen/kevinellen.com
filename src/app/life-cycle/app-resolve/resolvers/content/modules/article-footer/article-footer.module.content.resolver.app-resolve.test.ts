// src/app/life-cycle/app-resolve/resolvers/content/modules/article-footer/article-footer.module.content.resolver.app-resolve.test.ts

import { resolveArticleFooterModuleContentAppResolve } from "./article-footer.module.content.resolver.app-resolve";

type Input = Parameters<typeof resolveArticleFooterModuleContentAppResolve>[0];

describe("Article footer module AppResolve resolver", () => {
  const content = {
    kind: "articleFooter",
  } as unknown as Input["content"];

  const publication: Input["publication"] = {
    author: "Kevin Ellen",
    published: "2026-10-15",
    lastUpdated: "2026-10-20",
  };

  it("adds publication metadata", () => {
    const result = resolveArticleFooterModuleContentAppResolve({
      content,
      publication,
    });

    expect(result).toEqual({
      ...content,
      publication,
    });
  });

  it("preserves the publication reference", () => {
    const result = resolveArticleFooterModuleContentAppResolve({
      content,
      publication,
    });

    expect(result.publication).toBe(publication);
  });

  it("supports publication without an update date", () => {
    const withoutUpdate = {
      ...publication,
      lastUpdated: null,
    };

    const result = resolveArticleFooterModuleContentAppResolve({
      content,
      publication: withoutUpdate,
    });

    expect(result.publication.lastUpdated).toBeNull();
  });

  it("returns a new module without modifying the original", () => {
    const frozenContent = Object.freeze(content);

    const result = resolveArticleFooterModuleContentAppResolve({
      content: frozenContent,
      publication,
    });

    expect(result).not.toBe(frozenContent);
    expect(result).toMatchObject(frozenContent);
  });
});
