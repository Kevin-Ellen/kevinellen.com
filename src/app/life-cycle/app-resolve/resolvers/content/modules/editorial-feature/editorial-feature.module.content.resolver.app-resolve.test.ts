// src/app/life-cycle/app-resolve/resolvers/content/modules/editorial-feature/editorial-feature.module.content.resolver.app-resolve.test.ts

import { resolveEditorialFeatureModuleContentAppResolve } from "./editorial-feature.module.content.resolver.app-resolve";

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

type Input = Parameters<
  typeof resolveEditorialFeatureModuleContentAppResolve
>[0];
type Content = Input["content"];
type Component = Content["components"][number];
type ResolvedComponent = Awaited<
  ReturnType<typeof resolveComponentContentAppResolve>
>;
type ResolvedMedia = ReturnType<
  typeof resolveEditorialPhotoComponentContentAppResolve
>;

describe("Editorial feature module AppResolve resolver", () => {
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
      createComponent("photo"),
    ],
  ): Content =>
    ({
      kind: "editorialFeature",
      components,
      media: {
        kind: "editorialPhoto",
        photoId: "deer-001",
      },
    }) as unknown as Content;

  const resolvedMedia = {
    kind: "editorialPhoto",
    photoId: "deer-001",
  } as unknown as ResolvedMedia;

  const resolve = (content: Content = createContent()) =>
    resolveEditorialFeatureModuleContentAppResolve({
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

  it("resolves all configured components", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(mockedComponent).toHaveBeenCalledTimes(2);

    content.components.forEach((component, index) => {
      expect(mockedComponent).toHaveBeenNthCalledWith(index + 1, {
        content: component,
        contentRegistry,
        getPhoto,
      });
    });

    expect(result.components.map((component) => component.kind)).toEqual([
      "paragraph",
      "photo",
    ]);
  });

  it("resolves media through the editorial-photo resolver", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(mockedEditorialPhoto).toHaveBeenCalledWith({
      content: content.media,
    });

    expect(result.media).toBe(resolvedMedia);
  });

  it("preserves component return references", async () => {
    const resolved = {
      kind: "paragraph",
    } as unknown as ResolvedComponent;

    mockedComponent.mockResolvedValue(resolved);

    const result = await resolve(createContent([createComponent("paragraph")]));

    expect(result.components[0]).toBe(resolved);
  });

  it("supports no components", async () => {
    const result = await resolve(createContent([]));

    expect(result.components).toEqual([]);
    expect(mockedComponent).not.toHaveBeenCalled();
    expect(mockedEditorialPhoto).toHaveBeenCalledTimes(1);
  });

  it("creates new module and component collection references", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(result).not.toBe(content);
    expect(result.components).not.toBe(content.components);
  });

  it("propagates component resolution failures", async () => {
    mockedComponent.mockRejectedValue(new Error("Component resolution failed"));

    await expect(resolve()).rejects.toThrow("Component resolution failed");
  });

  it("propagates editorial media resolution failures", async () => {
    mockedEditorialPhoto.mockImplementation(() => {
      throw new Error("Editorial media resolution failed");
    });

    await expect(resolve()).rejects.toThrow(
      "Editorial media resolution failed",
    );
  });

  it("does not mutate the original module", async () => {
    const content = Object.freeze(createContent());

    await resolve(content);

    expect(content.components).toHaveLength(2);
  });
});
