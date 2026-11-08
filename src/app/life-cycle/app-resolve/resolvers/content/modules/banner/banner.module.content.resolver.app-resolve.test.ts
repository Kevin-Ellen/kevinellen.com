// src/app/life-cycle/app-resolve/resolvers/content/modules/banner/banner.module.content.resolver.app-resolve.test.ts

import { resolveBannerModuleContentAppResolve } from "./banner.module.content.resolver.app-resolve";

import { resolveComponentContentAppResolve } from "../../components/component.content.resolver.app-resolve";
import { resolveEditorialPhotoComponentContentAppResolve } from "../../components/editorial-photo/editorial-photo.component.content.resolver.app-resolve";

jest.mock("../../components/component.content.resolver.app-resolve", () => ({
  resolveComponentContentAppResolve: jest.fn(),
}));

jest.mock(
  "../../components/editorial-photo/editorial-photo.component.content.resolver.app-resolve",
  () => ({
    resolveEditorialPhotoComponentContentAppResolve: jest.fn(),
  }),
);

const mockedComponent = jest.mocked(resolveComponentContentAppResolve);
const mockedEditorialPhoto = jest.mocked(
  resolveEditorialPhotoComponentContentAppResolve,
);

type Input = Parameters<typeof resolveBannerModuleContentAppResolve>[0];
type Content = Input["content"];
type Component = Content["components"][number];
type ResolvedComponent = Awaited<
  ReturnType<typeof resolveComponentContentAppResolve>
>;
type ResolvedMedia = ReturnType<
  typeof resolveEditorialPhotoComponentContentAppResolve
>;

describe("Banner module AppResolve resolver", () => {
  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["contentRegistry"];

  const getPhoto = jest.fn<
    ReturnType<Input["getPhoto"]>,
    Parameters<Input["getPhoto"]>
  >();

  const createComponent = (kind: string): Component =>
    ({ kind }) as unknown as Component;

  const createContent = (
    components: readonly Component[] = [
      createComponent("paragraph"),
      createComponent("richList"),
    ],
  ): Content =>
    ({
      kind: "banner",
      media: { kind: "editorialPhoto", photoId: "forest-001" },
      components,
    }) as unknown as Content;

  const resolvedMedia = {
    kind: "editorialPhoto",
    photoId: "forest-001",
  } as unknown as ResolvedMedia;

  const resolve = (content: Content = createContent()) =>
    resolveBannerModuleContentAppResolve({
      content,
      contentRegistry,
      getPhoto,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedEditorialPhoto.mockReturnValue(resolvedMedia);

    mockedComponent.mockImplementation(
      async ({ content }) => ({ kind: content.kind }) as ResolvedComponent,
    );
  });

  it("resolves the banner media through the editorial-photo resolver", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(mockedEditorialPhoto).toHaveBeenCalledTimes(1);
    expect(mockedEditorialPhoto).toHaveBeenCalledWith({
      content: content.media,
    });

    expect(result.media).toBe(resolvedMedia);
  });

  it("resolves each component in order", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(mockedComponent).toHaveBeenCalledTimes(2);
    expect(result.components.map((component) => component.kind)).toEqual([
      "paragraph",
      "richList",
    ]);

    content.components.forEach((component, index) => {
      expect(mockedComponent).toHaveBeenNthCalledWith(index + 1, {
        content: component,
        contentRegistry,
        getPhoto,
      });
    });
  });

  it("preserves returned component references", async () => {
    const resolved = {
      kind: "paragraph",
    } as unknown as ResolvedComponent;

    mockedComponent.mockResolvedValue(resolved);

    const result = await resolve(createContent([createComponent("paragraph")]));

    expect(result.components[0]).toBe(resolved);
  });

  it("supports an empty component collection", async () => {
    const result = await resolve(createContent([]));

    expect(result.components).toEqual([]);
    expect(mockedComponent).not.toHaveBeenCalled();
    expect(mockedEditorialPhoto).toHaveBeenCalledTimes(1);
  });

  it("creates a new module and components collection", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(result).not.toBe(content);
    expect(result.components).not.toBe(content.components);
  });

  it("propagates editorial-photo resolution failures", async () => {
    const error = new Error("Invalid editorial media");

    mockedEditorialPhoto.mockImplementation(() => {
      throw error;
    });

    await expect(resolve()).rejects.toThrow(error);
  });

  it("propagates component resolution failures", async () => {
    const error = new Error("Component resolution failed");

    mockedComponent.mockRejectedValue(error);

    await expect(resolve()).rejects.toThrow(error);
  });

  it("does not mutate source content", async () => {
    const content = Object.freeze(createContent());

    await resolve(content);

    expect(content.components).toHaveLength(2);
  });
});
