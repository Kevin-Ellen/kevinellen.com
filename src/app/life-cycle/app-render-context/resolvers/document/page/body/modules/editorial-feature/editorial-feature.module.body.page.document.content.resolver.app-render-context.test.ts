// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/editorial-feature/editorial-feature.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveEditorialFeatureModuleContentAppRenderContext } from "./editorial-feature.module.body.page.document.content.resolver.app-render-context";

import { resolveComponentContentAppRenderContext } from "../../components/component.body.page.document.content.resolver.app-render-context";
import { resolveEditorialPhotoComponentContentAppRenderContext } from "../../components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context";

jest.mock(
  "../../components/component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveComponentContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "../../components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveEditorialPhotoComponentContentAppRenderContext: jest.fn(),
  }),
);

const mockedComponent = jest.mocked(resolveComponentContentAppRenderContext);
const mockedMedia = jest.mocked(
  resolveEditorialPhotoComponentContentAppRenderContext,
);

type Content = Parameters<
  typeof resolveEditorialFeatureModuleContentAppRenderContext
>[0]["content"];

type Component = Content["components"][number];
type ResolvedComponent = ReturnType<
  typeof resolveComponentContentAppRenderContext
>;
type ResolvedMedia = ReturnType<
  typeof resolveEditorialPhotoComponentContentAppRenderContext
>;

describe("Editorial feature module AppRenderContext resolver", () => {
  const media = {
    kind: "editorialPhoto",
    src: "/media/photo/1200/800/fox",
    alt: "Red fox",
    width: 1200,
    height: 800,
  } as Content["media"];

  const resolvedMedia = {
    ...media,
  } as ResolvedMedia;

  const createComponent = (kind: Component["kind"]): Component =>
    ({ kind }) as unknown as Component;

  const createContent = (
    components: Component[] = [
      createComponent("paragraph"),
      createComponent("list"),
    ],
  ): Content =>
    ({
      kind: "editorialFeature",
      media,
      components,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedMedia.mockReturnValue(resolvedMedia);
    mockedComponent.mockImplementation(
      ({ content }) => ({ kind: content.kind }) as ResolvedComponent,
    );
  });

  it("resolves components in their authored order", () => {
    const content = createContent();

    const result = resolveEditorialFeatureModuleContentAppRenderContext({
      content,
    });

    expect(mockedComponent).toHaveBeenCalledTimes(2);

    content.components.forEach((component, index) => {
      expect(mockedComponent).toHaveBeenNthCalledWith(index + 1, {
        content: component,
      });
    });

    expect(result.components.map((component) => component.kind)).toEqual([
      "paragraph",
      "list",
    ]);
  });

  it("resolves editorial media", () => {
    resolveEditorialFeatureModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(mockedMedia).toHaveBeenCalledTimes(1);
    expect(mockedMedia).toHaveBeenCalledWith({
      content: media,
    });
  });

  it("preserves resolved media and component references", () => {
    const resolvedComponent = {
      kind: "paragraph",
    } as ResolvedComponent;

    mockedComponent.mockReturnValue(resolvedComponent);

    const result = resolveEditorialFeatureModuleContentAppRenderContext({
      content: createContent([createComponent("paragraph")]),
    });

    expect(result.media).toBe(resolvedMedia);
    expect(result.components[0]).toBe(resolvedComponent);
  });

  it("resolves components before media", () => {
    const calls: string[] = [];

    mockedComponent.mockImplementation(({ content }) => {
      calls.push(`component:${content.kind}`);
      return { kind: content.kind } as ResolvedComponent;
    });

    mockedMedia.mockImplementation(() => {
      calls.push("media");
      return resolvedMedia;
    });

    resolveEditorialFeatureModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(calls).toEqual(["component:paragraph", "component:list", "media"]);
  });

  it("supports an empty component collection", () => {
    const result = resolveEditorialFeatureModuleContentAppRenderContext({
      content: createContent([]),
    });

    expect(result.components).toEqual([]);
    expect(result.media).toBe(resolvedMedia);
    expect(mockedComponent).not.toHaveBeenCalled();
  });

  it("does not attempt media resolution if a component throws", () => {
    const error = new Error("Component resolution failed");

    mockedComponent.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveEditorialFeatureModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedMedia).not.toHaveBeenCalled();
  });

  it("propagates media resolution errors", () => {
    const error = new Error("Editorial media failed");

    mockedMedia.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveEditorialFeatureModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedComponent).toHaveBeenCalledTimes(2);
  });

  it("does not mutate the original content", () => {
    const content = createContent();

    const result = resolveEditorialFeatureModuleContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.components).not.toBe(content.components);
    expect(content.media).toBe(media);
  });
});
