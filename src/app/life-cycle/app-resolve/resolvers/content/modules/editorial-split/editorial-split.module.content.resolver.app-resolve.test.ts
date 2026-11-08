// src/app/life-cycle/app-resolve/resolvers/content/modules/editorial-split/editorial-split.module.content.resolver.app-resolve.test.ts

import { resolveEditorialSplitModuleContentAppResolve } from "./editorial-split.module.content.resolver.app-resolve";

import { resolveComponentContentAppResolve } from "../../components/component.content.resolver.app-resolve";

jest.mock("../../components/component.content.resolver.app-resolve", () => ({
  resolveComponentContentAppResolve: jest.fn(),
}));

const mockedComponent = jest.mocked(resolveComponentContentAppResolve);

type Input = Parameters<typeof resolveEditorialSplitModuleContentAppResolve>[0];

type Content = Input["content"];
type Component = Content["components"][number];
type ResolvedComponent = Awaited<
  ReturnType<typeof resolveComponentContentAppResolve>
>;
type ResolvedMedia = Awaited<
  ReturnType<typeof resolveEditorialSplitModuleContentAppResolve>
>["media"];

describe("Editorial split module AppResolve resolver", () => {
  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["contentRegistry"];

  const getPhoto = jest.fn<
    ReturnType<Input["getPhoto"]>,
    Parameters<Input["getPhoto"]>
  >();

  const createComponent = (kind: Component["kind"]): Component =>
    ({ kind }) as unknown as Component;

  const createContent = (
    components: readonly Component[] = [
      createComponent("paragraph"),
      createComponent("richList"),
    ],
  ): Content =>
    ({
      kind: "editorialSplit",
      components,
      media: {
        kind: "photo",
        photoId: "forest-001",
      },
    }) as unknown as Content;

  const resolve = (content: Content = createContent()) =>
    resolveEditorialSplitModuleContentAppResolve({
      content,
      contentRegistry,
      getPhoto,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedComponent.mockImplementation(
      async ({ content }) => ({ kind: content.kind }) as ResolvedComponent,
    );
  });

  it("resolves all components in their original order", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(mockedComponent).toHaveBeenCalledTimes(3);

    expect(result.components.map((component) => component.kind)).toEqual([
      "paragraph",
      "richList",
    ]);
  });

  it("forwards dependencies when resolving components", async () => {
    const content = createContent();

    await resolve(content);

    content.components.forEach((component, index) => {
      expect(mockedComponent).toHaveBeenNthCalledWith(index + 1, {
        content: component,
        contentRegistry,
        getPhoto,
      });
    });
  });

  it("resolves media using the component resolver", async () => {
    const content = createContent();

    await resolve(content);

    expect(mockedComponent).toHaveBeenNthCalledWith(3, {
      content: content.media,
      contentRegistry,
      getPhoto,
    });
  });

  it("preserves the resolved media reference", async () => {
    const media = {
      kind: "photo",
      photo: {
        id: "forest-001",
      },
    } as unknown as ResolvedMedia;

    mockedComponent
      .mockResolvedValueOnce({ kind: "paragraph" } as ResolvedComponent)
      .mockResolvedValueOnce({ kind: "richList" } as ResolvedComponent)
      .mockResolvedValueOnce(media);

    const result = await resolve();

    expect(result.media).toBe(media);
  });

  it("preserves returned component references", async () => {
    const component = {
      kind: "paragraph",
    } as ResolvedComponent;

    mockedComponent.mockResolvedValue(component);

    const result = await resolve(createContent([createComponent("paragraph")]));

    expect(result.components[0]).toBe(component);
  });

  it("supports an empty component collection", async () => {
    const result = await resolve(createContent([]));

    expect(result.components).toEqual([]);
    expect(mockedComponent).toHaveBeenCalledTimes(1);

    expect(mockedComponent).toHaveBeenCalledWith({
      content: createContent([]).media,
      contentRegistry,
      getPhoto,
    });
  });

  it("creates new module and component collection references", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(result).not.toBe(content);
    expect(result.components).not.toBe(content.components);
  });

  it("preserves the original module properties", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(result.kind).toBe("editorialSplit");
  });

  it("does not mutate the original module", async () => {
    const content = Object.freeze(createContent());

    await resolve(content);

    expect(content.components).toHaveLength(2);
    expect(content.media.kind).toBe("photo");
  });

  it("propagates component resolution errors", async () => {
    const error = new Error("Component resolution failed");

    mockedComponent.mockRejectedValue(error);

    await expect(resolve()).rejects.toThrow(error);
  });

  it("propagates media resolution errors", async () => {
    const error = new Error("Media resolution failed");

    mockedComponent
      .mockResolvedValueOnce({ kind: "paragraph" } as ResolvedComponent)
      .mockResolvedValueOnce({ kind: "richList" } as ResolvedComponent)
      .mockRejectedValueOnce(error);

    await expect(resolve()).rejects.toThrow(error);
  });
});
