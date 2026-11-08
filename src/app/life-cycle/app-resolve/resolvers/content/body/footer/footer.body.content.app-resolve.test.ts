// src/app/life-cycle/app-resolve/resolvers/content/body/footer/footer.body.content.app-resolve.test.ts

import { resolveContentBodyFooterAppResolve } from "./footer.body.content.app-resolve";
import { resolveArticleFooterModuleContentAppResolve } from "../../modules/article-footer/article-footer.module.content.resolver.app-resolve";

jest.mock(
  "../../modules/article-footer/article-footer.module.content.resolver.app-resolve",
  () => ({
    resolveArticleFooterModuleContentAppResolve: jest.fn(),
  }),
);

const mockedArticleFooter = jest.mocked(
  resolveArticleFooterModuleContentAppResolve,
);

type Input = Parameters<typeof resolveContentBodyFooterAppResolve>[0];
type Footer = Input["content"];
type FooterModule = Footer[number];
type ResolvedFooterModule = ReturnType<
  typeof resolveArticleFooterModuleContentAppResolve
>;

describe("Content body footer AppResolve resolver", () => {
  const publication: Input["publication"] = {
    author: "Kevin Ellen",
    published: "2026-10-15",
    lastUpdated: "2026-10-20",
  };

  const createModule = (id: string): FooterModule =>
    ({
      kind: "articleFooter",
      id,
    }) as unknown as FooterModule;

  const createFooter = (): Footer => [
    createModule("first"),
    createModule("second"),
  ];

  beforeEach(() => {
    jest.resetAllMocks();

    mockedArticleFooter.mockImplementation(({ content }) => ({
      ...content,
      publication,
    }));
  });

  it("resolves every article footer module in order", async () => {
    const content = createFooter();

    const result = await resolveContentBodyFooterAppResolve({
      content,
      publication,
    });

    expect(mockedArticleFooter).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);

    content.forEach((module, index) => {
      expect(mockedArticleFooter).toHaveBeenNthCalledWith(index + 1, {
        content: module,
        publication,
      });
    });

    expect(result.map((module) => module.kind)).toEqual([
      "articleFooter",
      "articleFooter",
    ]);
  });

  it("preserves resolved module references", async () => {
    const resolved = {
      kind: "articleFooter",
      publication,
    } as unknown as ResolvedFooterModule;

    mockedArticleFooter.mockReturnValue(resolved);

    const result = await resolveContentBodyFooterAppResolve({
      content: [createModule("first")],
      publication,
    });

    expect(result[0]).toBe(resolved);
  });

  it("supports an empty footer", async () => {
    const result = await resolveContentBodyFooterAppResolve({
      content: [],
      publication,
    });

    expect(result).toEqual([]);
    expect(mockedArticleFooter).not.toHaveBeenCalled();
  });

  it("forwards null lastUpdated publication metadata", async () => {
    const withoutUpdate = {
      ...publication,
      lastUpdated: null,
    };

    const content = [createModule("first")];

    await resolveContentBodyFooterAppResolve({
      content,
      publication: withoutUpdate,
    });

    expect(mockedArticleFooter).toHaveBeenCalledWith({
      content: content[0],
      publication: withoutUpdate,
    });
  });

  it("rejects unsupported footer module kinds", async () => {
    const invalid = {
      kind: "hero",
    } as unknown as FooterModule;

    await expect(
      resolveContentBodyFooterAppResolve({
        content: [invalid],
        publication,
      }),
    ).rejects.toThrow("Unsupported footer module: hero");

    expect(mockedArticleFooter).not.toHaveBeenCalled();
  });

  it("stops processing when an invalid module is encountered", async () => {
    const valid = createModule("first");
    const invalid = {
      kind: "quote",
    } as unknown as FooterModule;

    await expect(
      resolveContentBodyFooterAppResolve({
        content: [valid, invalid, createModule("third")],
        publication,
      }),
    ).rejects.toThrow("Unsupported footer module: quote");

    expect(mockedArticleFooter).toHaveBeenCalledTimes(1);
    expect(mockedArticleFooter).toHaveBeenCalledWith({
      content: valid,
      publication,
    });
  });

  it("propagates article footer resolution failures", async () => {
    const error = new Error("Article footer resolution failed");

    mockedArticleFooter.mockImplementation(() => {
      throw error;
    });

    await expect(
      resolveContentBodyFooterAppResolve({
        content: createFooter(),
        publication,
      }),
    ).rejects.toThrow(error);
  });

  it("does not mutate the original footer collection", async () => {
    const content = Object.freeze(createFooter());
    const first = content[0];

    const result = await resolveContentBodyFooterAppResolve({
      content,
      publication,
    });

    expect(content[0]).toBe(first);
    expect(result).not.toBe(content);
  });
});
