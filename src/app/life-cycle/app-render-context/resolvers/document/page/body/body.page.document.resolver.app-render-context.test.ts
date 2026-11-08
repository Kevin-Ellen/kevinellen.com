// src/app/life-cycle/app-render-context/resolvers/document/page/body/body.page.document.resolver.app-render-context.test.ts

import { resolveContentBodyAppRenderContext } from "./body.page.document.resolver.app-render-context";

import { resolveContentModuleAppRenderContext } from "./modules/module.content.resolver.app-render-context";
import { resolveContentBodyFooterAppRenderContext } from "./footer/footer.body.page.document.resolver.app-render-context";

jest.mock("./modules/module.content.resolver.app-render-context", () => ({
  resolveContentModuleAppRenderContext: jest.fn(),
}));

jest.mock(
  "./footer/footer.body.page.document.resolver.app-render-context",
  () => ({
    resolveContentBodyFooterAppRenderContext: jest.fn(),
  }),
);

const mockedModule = jest.mocked(resolveContentModuleAppRenderContext);
const mockedFooter = jest.mocked(resolveContentBodyFooterAppRenderContext);

type Input = Parameters<typeof resolveContentBodyAppRenderContext>[0];
type Content = Input["content"];
type Module = Content["modules"][number];

type ResolvedModule = ReturnType<typeof resolveContentModuleAppRenderContext>;
type ResolvedFooter = ReturnType<
  typeof resolveContentBodyFooterAppRenderContext
>;

describe("Content body AppRenderContext resolver", () => {
  const createModule = (kind: Module["kind"]): Module =>
    ({ kind }) as unknown as Module;

  const createContent = (
    modules: Module[] = [createModule("hero"), createModule("richContent")],
    footer: Content["footer"] = [
      { kind: "articleFooter" },
    ] as unknown as Content["footer"],
  ): Content => ({
    modules,
    footer,
  });

  const resolvedFooter = [
    { kind: "articleFooter" },
  ] as unknown as ResolvedFooter;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedModule.mockImplementation(
      ({ content }) => ({ kind: content.kind }) as unknown as ResolvedModule,
    );

    mockedFooter.mockReturnValue(resolvedFooter);
  });

  it("resolves every body module in order", () => {
    const content = createContent();

    const result = resolveContentBodyAppRenderContext({ content });

    expect(mockedModule).toHaveBeenCalledTimes(2);

    expect(mockedModule).toHaveBeenNthCalledWith(1, {
      content: content.modules[0],
    });

    expect(mockedModule).toHaveBeenNthCalledWith(2, {
      content: content.modules[1],
    });

    expect(result.modules.map((module) => module.kind)).toEqual([
      "hero",
      "richContent",
    ]);
  });

  it("forwards the footer collection to its resolver", () => {
    const content = createContent();

    resolveContentBodyAppRenderContext({ content });

    expect(mockedFooter).toHaveBeenCalledTimes(1);
    expect(mockedFooter).toHaveBeenCalledWith({
      content: content.footer,
    });
  });

  it("preserves exact resolved module and footer references", () => {
    const first = {
      kind: "hero",
    } as unknown as ResolvedModule;

    const second = {
      kind: "richContent",
    } as unknown as ResolvedModule;

    mockedModule.mockReturnValueOnce(first).mockReturnValueOnce(second);

    const result = resolveContentBodyAppRenderContext({
      content: createContent(),
    });

    expect(result.modules[0]).toBe(first);
    expect(result.modules[1]).toBe(second);
    expect(result.footer).toBe(resolvedFooter);
  });

  it("resolves modules before the footer", () => {
    const calls: string[] = [];

    mockedModule.mockImplementation(({ content }) => {
      calls.push(`module:${content.kind}`);
      return { kind: content.kind } as unknown as ResolvedModule;
    });

    mockedFooter.mockImplementation(() => {
      calls.push("footer");
      return resolvedFooter;
    });

    resolveContentBodyAppRenderContext({
      content: createContent(),
    });

    expect(calls).toEqual(["module:hero", "module:richContent", "footer"]);
  });

  it("supports an empty body and footer", () => {
    mockedFooter.mockReturnValue([]);

    const result = resolveContentBodyAppRenderContext({
      content: createContent([], []),
    });

    expect(result).toEqual({
      modules: [],
      footer: [],
    });

    expect(mockedModule).not.toHaveBeenCalled();
    expect(mockedFooter).toHaveBeenCalledWith({
      content: [],
    });
  });

  it("returns new body and module collection objects", () => {
    const content = createContent();

    const result = resolveContentBodyAppRenderContext({ content });

    expect(result).not.toBe(content);
    expect(result.modules).not.toBe(content.modules);
  });

  it("does not resolve the footer if a module fails", () => {
    const error = new Error("Body module failed");

    mockedModule.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveContentBodyAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedFooter).not.toHaveBeenCalled();
  });

  it("propagates footer resolution errors", () => {
    const error = new Error("Body footer failed");

    mockedFooter.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveContentBodyAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedModule).toHaveBeenCalledTimes(2);
  });

  it("preserves the original body references", () => {
    const content = Object.freeze(createContent());
    const originalModules = content.modules;
    const originalFooter = content.footer;

    resolveContentBodyAppRenderContext({ content });

    expect(content.modules).toBe(originalModules);
    expect(content.footer).toBe(originalFooter);
  });
});
