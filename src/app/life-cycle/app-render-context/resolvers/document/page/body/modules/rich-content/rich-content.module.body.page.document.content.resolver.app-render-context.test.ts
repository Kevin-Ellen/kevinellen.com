// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/rich-content/rich-content.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveRichContentModuleContentAppRenderContext } from "./rich-content.module.body.page.document.content.resolver.app-render-context";

import { resolveComponentContentAppRenderContext } from "../../components/component.body.page.document.content.resolver.app-render-context";

jest.mock(
  "../../components/component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveComponentContentAppRenderContext: jest.fn(),
  }),
);

const mockedComponent = jest.mocked(resolveComponentContentAppRenderContext);

type Content = Parameters<
  typeof resolveRichContentModuleContentAppRenderContext
>[0]["content"];

type Component = Content["components"][number];

type ResolvedComponent = ReturnType<
  typeof resolveComponentContentAppRenderContext
>;

describe("Rich content module AppRenderContext resolver", () => {
  const createComponent = (kind: Component["kind"]): Component =>
    ({
      kind,
    }) as unknown as Component;

  const createContent = (
    components: Component[] = [
      createComponent("paragraph"),
      createComponent("list"),
      createComponent("photo"),
    ],
  ): Content =>
    ({
      kind: "richContent",
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

    resolveRichContentModuleContentAppRenderContext({ content });

    expect(mockedComponent).toHaveBeenCalledTimes(3);

    content.components.forEach((component, index) => {
      expect(mockedComponent).toHaveBeenNthCalledWith(index + 1, {
        content: component,
      });
    });
  });

  it("preserves the resolved components and their order", () => {
    const first = {
      kind: "paragraph",
    } as unknown as ResolvedComponent;

    const second = {
      kind: "list",
    } as unknown as ResolvedComponent;

    const third = {
      kind: "photo",
    } as unknown as ResolvedComponent;

    mockedComponent
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second)
      .mockReturnValueOnce(third);

    const result = resolveRichContentModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result.components).toEqual([first, second, third]);
    expect(result.components[0]).toBe(first);
    expect(result.components[1]).toBe(second);
    expect(result.components[2]).toBe(third);
  });

  it("supports an empty component collection", () => {
    const result = resolveRichContentModuleContentAppRenderContext({
      content: createContent([]),
    });

    expect(result.components).toEqual([]);
    expect(mockedComponent).not.toHaveBeenCalled();
  });

  it("preserves other module properties", () => {
    const content = createContent();

    const result = resolveRichContentModuleContentAppRenderContext({
      content,
    });

    expect(result).toEqual({
      ...content,
      components: result.components,
    });
  });

  it("creates a new module and components array", () => {
    const content = createContent();

    const result = resolveRichContentModuleContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.components).not.toBe(content.components);
  });

  it("propagates component resolution errors", () => {
    const error = new Error("Rich content component failed");

    mockedComponent.mockImplementationOnce(() => {
      throw error;
    });

    expect(() =>
      resolveRichContentModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedComponent).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the source component collection", () => {
    const content = createContent();
    const originalComponents = content.components;

    resolveRichContentModuleContentAppRenderContext({ content });

    expect(content.components).toBe(originalComponents);
  });
});
