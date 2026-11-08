// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/banner/banner.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveBannerModuleContentAppRenderContext } from "./banner.module.body.page.document.content.resolver.app-render-context";

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
  typeof resolveBannerModuleContentAppRenderContext
>[0]["content"];

type Component = Content["components"][number];
type ResolvedComponent = ReturnType<
  typeof resolveComponentContentAppRenderContext
>;
type ResolvedMedia = ReturnType<
  typeof resolveEditorialPhotoComponentContentAppRenderContext
>;

describe("Banner module AppRenderContext resolver", () => {
  const media = {
    kind: "editorialPhoto",
    src: "/media/photo/1200/800/forest",
    alt: "Woodland",
    width: 1200,
    height: 800,
  } as Content["media"];

  const resolvedMedia = {
    ...media,
    description: "Epping Forest",
  } as ResolvedMedia;

  const createComponent = (kind: Component["kind"]): Component =>
    ({ kind }) as unknown as Component;

  const createContent = (
    components: Component[] = [
      createComponent("paragraph"),
      createComponent("photo"),
    ],
  ): Content =>
    ({
      kind: "banner",
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

  it("resolves banner media", () => {
    const content = createContent();

    resolveBannerModuleContentAppRenderContext({ content });

    expect(mockedMedia).toHaveBeenCalledTimes(1);
    expect(mockedMedia).toHaveBeenCalledWith({
      content: media,
    });
  });

  it("resolves all components in order", () => {
    const content = createContent();

    const result = resolveBannerModuleContentAppRenderContext({
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
      "photo",
    ]);
  });

  it("preserves resolved media and component references", () => {
    const resolvedComponent = {
      kind: "paragraph",
    } as ResolvedComponent;

    mockedComponent.mockReturnValue(resolvedComponent);

    const result = resolveBannerModuleContentAppRenderContext({
      content: createContent([createComponent("paragraph")]),
    });

    expect(result.media).toBe(resolvedMedia);
    expect(result.components[0]).toBe(resolvedComponent);
  });

  it("resolves media before components", () => {
    const calls: string[] = [];

    mockedMedia.mockImplementation(() => {
      calls.push("media");
      return resolvedMedia;
    });

    mockedComponent.mockImplementation(({ content }) => {
      calls.push(`component:${content.kind}`);
      return { kind: content.kind } as ResolvedComponent;
    });

    resolveBannerModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(calls).toEqual(["media", "component:paragraph", "component:photo"]);
  });

  it("supports a banner without components", () => {
    const result = resolveBannerModuleContentAppRenderContext({
      content: createContent([]),
    });

    expect(result.components).toEqual([]);
    expect(result.media).toBe(resolvedMedia);
    expect(mockedComponent).not.toHaveBeenCalled();
  });

  it("propagates media resolution errors", () => {
    const error = new Error("Banner media failed");

    mockedMedia.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveBannerModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedComponent).not.toHaveBeenCalled();
  });

  it("propagates component resolution errors", () => {
    const error = new Error("Banner component failed");

    mockedComponent.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveBannerModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedMedia).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the original content", () => {
    const content = createContent();

    const result = resolveBannerModuleContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.components).not.toBe(content.components);
    expect(content.media).toBe(media);
  });
});
