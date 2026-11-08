// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/article-footer/article-footer.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveArticleFooterModuleContentAppRenderContext } from "./article-footer.module.body.page.document.content.resolver.app-render-context";

import { resolveDisplayDateAppRenderContext } from "../../../../../primitives/datetime/datetime.primitive.resolver.app-render-context";

jest.mock(
  "../../../../../primitives/datetime/datetime.primitive.resolver.app-render-context",
  () => ({
    resolveDisplayDateAppRenderContext: jest.fn(),
  }),
);

const mockedDate = jest.mocked(resolveDisplayDateAppRenderContext);

type Content = Parameters<
  typeof resolveArticleFooterModuleContentAppRenderContext
>[0]["content"];

type DisplayDate = ReturnType<typeof resolveDisplayDateAppRenderContext>;

describe("Article footer module AppRenderContext resolver", () => {
  const createContent = (lastUpdated: string | null = "2026-10-20"): Content =>
    ({
      kind: "articleFooter",
      publication: {
        author: "Kevin Ellen",
        published: "2026-10-15",
        lastUpdated,
      },
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedDate.mockImplementation(({ iso }) => ({
      iso,
      label: `Formatted: ${iso}`,
    }));
  });

  it("formats published and lastUpdated dates", () => {
    const content = createContent();

    const result = resolveArticleFooterModuleContentAppRenderContext({
      content,
    });

    expect(mockedDate).toHaveBeenCalledTimes(2);
    expect(mockedDate).toHaveBeenNthCalledWith(1, {
      iso: "2026-10-15",
    });
    expect(mockedDate).toHaveBeenNthCalledWith(2, {
      iso: "2026-10-20",
    });

    expect(result.publication).toEqual({
      author: "Kevin Ellen",
      published: {
        iso: "2026-10-15",
        label: "Formatted: 2026-10-15",
      },
      lastUpdated: {
        iso: "2026-10-20",
        label: "Formatted: 2026-10-20",
      },
    });
  });

  it("sets lastUpdated to null when absent", () => {
    const result = resolveArticleFooterModuleContentAppRenderContext({
      content: createContent(null),
    });

    expect(result.publication.lastUpdated).toBeNull();
    expect(mockedDate).toHaveBeenCalledTimes(1);
    expect(mockedDate).toHaveBeenCalledWith({
      iso: "2026-10-15",
    });
  });

  it("preserves the exact resolved date objects", () => {
    const published: DisplayDate = {
      iso: "2026-10-15",
      label: "15 October 2026",
    };

    const updated: DisplayDate = {
      iso: "2026-10-20",
      label: "20 October 2026",
    };

    mockedDate.mockReturnValueOnce(published).mockReturnValueOnce(updated);

    const result = resolveArticleFooterModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result.publication.published).toBe(published);
    expect(result.publication.lastUpdated).toBe(updated);
  });

  it("preserves other module and publication properties", () => {
    const content = createContent();

    const result = resolveArticleFooterModuleContentAppRenderContext({
      content,
    });

    expect(result.kind).toBe(content.kind);
    expect(result.publication.author).toBe(content.publication.author);
  });

  it("creates new module and publication objects", () => {
    const content = createContent();

    const result = resolveArticleFooterModuleContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.publication).not.toBe(content.publication);
  });

  it("does not mutate the source publication", () => {
    const content = createContent();
    const originalPublication = content.publication;

    resolveArticleFooterModuleContentAppRenderContext({ content });

    expect(content.publication).toBe(originalPublication);
    expect(content.publication.published).toBe("2026-10-15");
    expect(content.publication.lastUpdated).toBe("2026-10-20");
  });

  it("propagates date formatting failures", () => {
    const error = new Error("Invalid publication date");

    mockedDate.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveArticleFooterModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);
  });
});
