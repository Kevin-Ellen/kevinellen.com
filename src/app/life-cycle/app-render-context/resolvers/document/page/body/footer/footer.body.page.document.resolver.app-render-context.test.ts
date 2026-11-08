// src/app/life-cycle/app-render-context/resolvers/document/page/body/footer/footer.body.page.document.resolver.app-render-context.test.ts

import { resolveContentBodyFooterAppRenderContext } from "./footer.body.page.document.resolver.app-render-context";

import { resolveContentModuleAppRenderContext } from "../modules/module.content.resolver.app-render-context";

jest.mock("../modules/module.content.resolver.app-render-context", () => ({
  resolveContentModuleAppRenderContext: jest.fn(),
}));

const mockedModule = jest.mocked(resolveContentModuleAppRenderContext);

type Content = Parameters<
  typeof resolveContentBodyFooterAppRenderContext
>[0]["content"];

type FooterModule = Content[number];

type ResolvedModule = ReturnType<typeof resolveContentModuleAppRenderContext>;

describe("Content body footer AppRenderContext resolver", () => {
  const createModule = (id: string): FooterModule =>
    ({
      kind: "articleFooter",
      id,
    }) as unknown as FooterModule;

  const createContent = (): Content => [
    createModule("first"),
    createModule("second"),
  ];

  beforeEach(() => {
    jest.resetAllMocks();

    mockedModule.mockImplementation(
      ({ content }) => ({ ...content }) as ResolvedModule,
    );
  });

  it("resolves every footer module in order", () => {
    const content = createContent();

    const result = resolveContentBodyFooterAppRenderContext({
      content,
    });

    expect(mockedModule).toHaveBeenCalledTimes(2);

    content.forEach((module, index) => {
      expect(mockedModule).toHaveBeenNthCalledWith(index + 1, {
        content: module,
      });
    });

    expect(result).toHaveLength(2);
  });

  it("preserves resolved module references", () => {
    const first = {
      kind: "articleFooter",
      id: "resolved-first",
    } as unknown as ResolvedModule;

    const second = {
      kind: "articleFooter",
      id: "resolved-second",
    } as unknown as ResolvedModule;

    mockedModule.mockReturnValueOnce(first).mockReturnValueOnce(second);

    const result = resolveContentBodyFooterAppRenderContext({
      content: createContent(),
    });

    expect(result[0]).toBe(first);
    expect(result[1]).toBe(second);
  });

  it("supports an empty footer", () => {
    const result = resolveContentBodyFooterAppRenderContext({
      content: [],
    });

    expect(result).toEqual([]);
    expect(mockedModule).not.toHaveBeenCalled();
  });

  it("returns a new footer collection", () => {
    const content = createContent();

    const result = resolveContentBodyFooterAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
  });

  it("propagates child resolver errors", () => {
    const error = new Error("Footer module failed");

    mockedModule.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveContentBodyFooterAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedModule).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the original footer collection", () => {
    const content = Object.freeze(createContent());
    const originalFirst = content[0];

    resolveContentBodyFooterAppRenderContext({ content });

    expect(content[0]).toBe(originalFirst);
    expect(content).toHaveLength(2);
  });
});
