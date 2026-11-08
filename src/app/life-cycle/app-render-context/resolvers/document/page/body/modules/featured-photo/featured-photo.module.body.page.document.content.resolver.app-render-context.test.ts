// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/featured-photo/featured-photo.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveFeaturedPhotoModuleContentAppRenderContext } from "./featured-photo.module.body.page.document.content.resolver.app-render-context";

import { resolvePhotoAppRenderContext } from "../../../../../primitives/photo/photo.primitive.resolver.app-render-context";

jest.mock(
  "../../../../../primitives/photo/photo.primitive.resolver.app-render-context",
  () => ({
    resolvePhotoAppRenderContext: jest.fn(),
  }),
);

const mockedPhoto = jest.mocked(resolvePhotoAppRenderContext);

type Content = Parameters<
  typeof resolveFeaturedPhotoModuleContentAppRenderContext
>[0]["content"];

type Photo = Content["photo"];
type ResolvedPhoto = ReturnType<typeof resolvePhotoAppRenderContext>;

describe("Featured photo module AppRenderContext resolver", () => {
  const photo = {
    id: "fox-001",
    title: "Red Fox",
  } as unknown as Photo;

  const resolvedPhoto = {
    id: "fox-001",
    title: "Red Fox",
    image: {
      src: "/media/photo/1200/800/fox-001",
    },
  } as unknown as ResolvedPhoto;

  const createContent = (overrides: Partial<Content> = {}): Content =>
    ({
      kind: "featuredPhoto",
      wide: true,
      photo,
      alt: "A fox in Epping Forest",
      commentary: "Photographed at sunrise",
      ...overrides,
    }) as Content;

  beforeEach(() => {
    jest.resetAllMocks();
    mockedPhoto.mockReturnValue(resolvedPhoto);
  });

  it("passes the photo and editorial overrides to the photo resolver", () => {
    const content = createContent();

    resolveFeaturedPhotoModuleContentAppRenderContext({ content });

    expect(mockedPhoto).toHaveBeenCalledTimes(1);
    expect(mockedPhoto).toHaveBeenCalledWith({
      photo,
      alt: "A fox in Epping Forest",
      commentary: "Photographed at sunrise",
    });
  });

  it("returns the expected module structure", () => {
    const result = resolveFeaturedPhotoModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result).toEqual({
      kind: "featuredPhoto",
      wide: true,
      photo: resolvedPhoto,
    });
  });

  it("preserves the exact resolved photo reference", () => {
    const result = resolveFeaturedPhotoModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result.photo).toBe(resolvedPhoto);
  });

  it("preserves the required wide layout", () => {
    const result = resolveFeaturedPhotoModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result.wide).toBe(true);
  });

  it("forwards undefined overrides", () => {
    resolveFeaturedPhotoModuleContentAppRenderContext({
      content: createContent({
        alt: undefined,
        commentary: undefined,
      }),
    });

    expect(mockedPhoto).toHaveBeenCalledWith({
      photo,
      alt: undefined,
      commentary: undefined,
    });
  });

  it("preserves an explicit null commentary override", () => {
    resolveFeaturedPhotoModuleContentAppRenderContext({
      content: createContent({ commentary: null }),
    });

    expect(mockedPhoto).toHaveBeenCalledWith({
      photo,
      alt: "A fox in Epping Forest",
      commentary: null,
    });
  });

  it("does not expose editorial overrides at module level", () => {
    const result = resolveFeaturedPhotoModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result).not.toHaveProperty("alt");
    expect(result).not.toHaveProperty("commentary");
  });

  it("propagates photo resolution errors", () => {
    const error = new Error("Photo rendering failed");

    mockedPhoto.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveFeaturedPhotoModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);
  });

  it("does not mutate the source module", () => {
    const content = Object.freeze(createContent());

    resolveFeaturedPhotoModuleContentAppRenderContext({ content });

    expect(content.photo).toBe(photo);
    expect(content.alt).toBe("A fox in Epping Forest");
  });
});
