// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/final-words/final-words.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveFinalWordsModuleContentAppRenderContext } from "./final-words.module.body.page.document.content.resolver.app-render-context";

import { resolveComponentContentAppRenderContext } from "../../components/component.body.page.document.content.resolver.app-render-context";

jest.mock(
  "../../components/component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveComponentContentAppRenderContext: jest.fn(),
  }),
);

const mockedComponent = jest.mocked(resolveComponentContentAppRenderContext);

type Content = Parameters<
  typeof resolveFinalWordsModuleContentAppRenderContext
>[0]["content"];

type Component = Content["components"][number];
type ResolvedComponent = ReturnType<
  typeof resolveComponentContentAppRenderContext
>;

describe("Final words module AppRenderContext resolver", () => {
  const createComponent = (kind: Component["kind"]): Component =>
    ({ kind }) as unknown as Component;

  const createContent = (
    components: Component[] = [
      createComponent("paragraph"),
      createComponent("list"),
    ],
  ): Content =>
    ({
      kind: "finalWords",
      components,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedComponent.mockImplementation(
      ({ content }) => ({ kind: content.kind }) as unknown as ResolvedComponent,
    );
  });

  it("resolves every component in order", () => {
    const content = createContent();

    const result = resolveFinalWordsModuleContentAppRenderContext({
      content,
    });

    expect(mockedComponent).toHaveBeenCalledTimes(2);
    expect(mockedComponent).toHaveBeenNthCalledWith(1, {
      content: content.components[0],
    });
    expect(mockedComponent).toHaveBeenNthCalledWith(2, {
      content: content.components[1],
    });

    expect(result.components.map((component) => component.kind)).toEqual([
      "paragraph",
      "list",
    ]);
  });

  it("preserves the exact resolved component references", () => {
    const first = {
      kind: "paragraph",
    } as unknown as ResolvedComponent;

    const second = {
      kind: "list",
    } as unknown as ResolvedComponent;

    mockedComponent.mockReturnValueOnce(first).mockReturnValueOnce(second);

    const result = resolveFinalWordsModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result.components[0]).toBe(first);
    expect(result.components[1]).toBe(second);
  });

  it("supports an empty component collection", () => {
    const result = resolveFinalWordsModuleContentAppRenderContext({
      content: createContent([]),
    });

    expect(result.components).toEqual([]);
    expect(mockedComponent).not.toHaveBeenCalled();
  });

  it("preserves other module properties", () => {
    const content = createContent();

    const result = resolveFinalWordsModuleContentAppRenderContext({
      content,
    });

    expect(result).toEqual({
      ...content,
      components: result.components,
    });
  });

  it("creates a new module and component collection", () => {
    const content = createContent();

    const result = resolveFinalWordsModuleContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.components).not.toBe(content.components);
  });

  it("propagates component resolver errors", () => {
    const error = new Error("Component failed");

    mockedComponent.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveFinalWordsModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);
  });

  it("does not mutate the source collection", () => {
    const content = createContent();
    const originalComponents = content.components;

    resolveFinalWordsModuleContentAppRenderContext({ content });

    expect(content.components).toBe(originalComponents);
  });
});
