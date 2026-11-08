// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/editorial-split/editorial-split.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveEditorialSplitModuleContentAppRenderContext } from "./editorial-split.module.body.page.document.content.resolver.app-render-context";

import { resolveComponentContentAppRenderContext } from "../../components/component.body.page.document.content.resolver.app-render-context";

jest.mock(
  "../../components/component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveComponentContentAppRenderContext: jest.fn(),
  }),
);

const mockedComponent = jest.mocked(resolveComponentContentAppRenderContext);

type Content = Parameters<
  typeof resolveEditorialSplitModuleContentAppRenderContext
>[0]["content"];

type Component = Content["components"][number];
type ResolvedComponent = ReturnType<
  typeof resolveComponentContentAppRenderContext
>;

describe("Editorial split module AppRenderContext resolver", () => {
  const createComponent = (kind: Component["kind"]): Component =>
    ({ kind }) as unknown as Component;

  const media = {
    kind: "photo",
    photo: {
      id: "fox-001",
    },
  } as unknown as Content["media"];

  const createContent = (
    components: Component[] = [
      createComponent("paragraph"),
      createComponent("list"),
    ],
  ): Content =>
    ({
      kind: "editorialSplit",
      components,
      media,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedComponent.mockImplementation(
      ({ content }) => ({ kind: content.kind }) as ResolvedComponent,
    );
  });

  it("resolves every editorial component and the media", () => {
    const content = createContent();

    resolveEditorialSplitModuleContentAppRenderContext({ content });

    expect(mockedComponent).toHaveBeenCalledTimes(3);

    expect(mockedComponent).toHaveBeenNthCalledWith(1, {
      content: content.components[0],
    });
    expect(mockedComponent).toHaveBeenNthCalledWith(2, {
      content: content.components[1],
    });
    expect(mockedComponent).toHaveBeenNthCalledWith(3, {
      content: content.media,
    });
  });

  it("preserves component ordering", () => {
    const result = resolveEditorialSplitModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result.components.map((component) => component.kind)).toEqual([
      "paragraph",
      "list",
    ]);
  });

  it("preserves the resolved media reference", () => {
    const resolvedMedia = {
      kind: "photo",
      photo: {
        id: "resolved-fox",
      },
    } as unknown as ResolvedComponent;

    mockedComponent.mockReturnValueOnce({
      kind: "paragraph",
    } as ResolvedComponent);

    mockedComponent.mockReturnValueOnce({
      kind: "list",
    } as ResolvedComponent);

    mockedComponent.mockReturnValueOnce(resolvedMedia);

    const result = resolveEditorialSplitModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result.media).toBe(resolvedMedia);
  });

  it("preserves resolved component references", () => {
    const first = {
      kind: "paragraph",
    } as ResolvedComponent;

    const second = {
      kind: "list",
    } as ResolvedComponent;

    mockedComponent.mockReturnValueOnce(first).mockReturnValueOnce(second);

    const result = resolveEditorialSplitModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result.components[0]).toBe(first);
    expect(result.components[1]).toBe(second);
  });

  it("resolves components before media", () => {
    const calls: string[] = [];

    mockedComponent.mockImplementation(({ content }) => {
      calls.push(content.kind);
      return { kind: content.kind } as ResolvedComponent;
    });

    resolveEditorialSplitModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(calls).toEqual(["paragraph", "list", "photo"]);
  });

  it("supports an empty component collection", () => {
    const result = resolveEditorialSplitModuleContentAppRenderContext({
      content: createContent([]),
    });

    expect(result.components).toEqual([]);
    expect(mockedComponent).toHaveBeenCalledTimes(1);
    expect(mockedComponent).toHaveBeenCalledWith({
      content: media,
    });
  });

  it("propagates component resolution errors", () => {
    const error = new Error("Editorial component failed");

    mockedComponent.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveEditorialSplitModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedComponent).toHaveBeenCalledTimes(1);
  });

  it("propagates media resolution errors", () => {
    const error = new Error("Editorial media failed");

    mockedComponent
      .mockReturnValueOnce({ kind: "paragraph" } as ResolvedComponent)
      .mockReturnValueOnce({ kind: "list" } as ResolvedComponent)
      .mockImplementationOnce(() => {
        throw error;
      });

    expect(() =>
      resolveEditorialSplitModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedComponent).toHaveBeenCalledTimes(3);
  });

  it("creates new module and component collection objects", () => {
    const content = createContent();

    const result = resolveEditorialSplitModuleContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.components).not.toBe(content.components);
    expect(content.media).toBe(media);
  });
});
