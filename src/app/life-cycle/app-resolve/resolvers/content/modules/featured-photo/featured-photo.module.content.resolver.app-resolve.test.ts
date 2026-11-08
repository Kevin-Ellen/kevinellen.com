// src/app/life-cycle/app-resolve/resolvers/content/modules/featured-photo/featured-photo.module.content.resolver.app-resolve.test.ts

import { resolveFeaturedPhotoModuleContentAppResolve } from "./featured-photo.module.content.resolver.app-resolve";
import { resolvePhotoMetadataAppResolve } from "../../../primitives/photo-metadata/photo-metadata.primitive.resolver.app-resolve";

jest.mock(
  "../../../primitives/photo-metadata/photo-metadata.primitive.resolver.app-resolve",
  () => ({
    resolvePhotoMetadataAppResolve: jest.fn(),
  }),
);

const mockedPhotoMetadata = jest.mocked(resolvePhotoMetadataAppResolve);

type Input = Parameters<typeof resolveFeaturedPhotoModuleContentAppResolve>[0];
type Content = Input["content"];
type Photo = Awaited<ReturnType<typeof resolvePhotoMetadataAppResolve>>;

describe("Featured-photo module AppResolve resolver", () => {
  const getPhoto = jest.fn<
    ReturnType<Input["getPhoto"]>,
    Parameters<Input["getPhoto"]>
  >();

  const photo = {
    id: "fox-001",
    alt: "Original alt",
    commentary: "Original commentary",
  } as unknown as Photo;

  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      kind: "featuredPhoto",
      photoId: "fox-001",
      alt: null,
      commentary: null,
      ...overrides,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();
    mockedPhotoMetadata.mockResolvedValue(photo);
  });

  it("resolves the configured photo using the supplied getter", async () => {
    const content = createContent();

    await resolveFeaturedPhotoModuleContentAppResolve({ content, getPhoto });

    expect(mockedPhotoMetadata).toHaveBeenCalledTimes(1);
    expect(mockedPhotoMetadata).toHaveBeenCalledWith({
      photoId: "fox-001",
      getPhoto,
    });
  });

  it("falls back to published alt and commentary", async () => {
    const result = await resolveFeaturedPhotoModuleContentAppResolve({
      content: createContent(),
      getPhoto,
    });

    expect(result.alt).toBe("Original alt");
    expect(result.commentary).toBe("Original commentary");
  });

  it("prefers authored alt and commentary", async () => {
    const result = await resolveFeaturedPhotoModuleContentAppResolve({
      content: createContent({
        alt: "A fox at sunrise",
        commentary: "Photographed in Epping Forest",
      }),
      getPhoto,
    });

    expect(result.alt).toBe("A fox at sunrise");
    expect(result.commentary).toBe("Photographed in Epping Forest");
  });

  it("supports overriding only one field", async () => {
    const result = await resolveFeaturedPhotoModuleContentAppResolve({
      content: createContent({ alt: "Custom alt" }),
      getPhoto,
    });

    expect(result.alt).toBe("Custom alt");
    expect(result.commentary).toBe("Original commentary");
  });

  it("preserves deliberately empty strings", async () => {
    const result = await resolveFeaturedPhotoModuleContentAppResolve({
      content: createContent({ alt: "", commentary: "" }),
      getPhoto,
    });

    expect(result.alt).toBe("");
    expect(result.commentary).toBe("");
  });

  it("preserves the resolved photo reference", async () => {
    const content = createContent({ alt: "Custom alt" });

    const result = await resolveFeaturedPhotoModuleContentAppResolve({
      content,
      getPhoto,
    });

    expect(result.photo).toBe(photo);
    expect(photo.alt).toBe("Original alt");
    expect(result).not.toBe(content);
  });

  it("propagates metadata resolution errors", async () => {
    const error = new Error("Photo unavailable");
    mockedPhotoMetadata.mockRejectedValue(error);

    await expect(
      resolveFeaturedPhotoModuleContentAppResolve({
        content: createContent(),
        getPhoto,
      }),
    ).rejects.toThrow(error);
  });
});
