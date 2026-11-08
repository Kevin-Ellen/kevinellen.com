// src/app/life-cycle/app-resolve/resolvers/content/components/photo/photo.component.content.resolver.app-resolve.test.ts

import { resolvePhotoComponentContentAppResolve } from "./photo.component.content.resolver.app-resolve";

import { resolvePhotoMetadataAppResolve } from "../../../primitives/photo-metadata/photo-metadata.primitive.resolver.app-resolve";

jest.mock(
  "../../../primitives/photo-metadata/photo-metadata.primitive.resolver.app-resolve",
  () => ({
    resolvePhotoMetadataAppResolve: jest.fn(),
  }),
);

const mockedPhotoMetadata = jest.mocked(resolvePhotoMetadataAppResolve);

type Input = Parameters<typeof resolvePhotoComponentContentAppResolve>[0];

type Content = Input["content"];
type Photo = Awaited<ReturnType<typeof resolvePhotoMetadataAppResolve>>;

describe("Photo component AppResolve resolver", () => {
  const getPhoto = jest.fn<
    ReturnType<Input["getPhoto"]>,
    Parameters<Input["getPhoto"]>
  >();

  const photo = {
    id: "fox-001",
    title: "Red Fox",
    alt: "Original photo description",
    commentary: "Original photo commentary",
    width: 6000,
    height: 4000,
    dimensions: {
      width: 1400,
      height: 933,
    },
  } as Photo;

  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      kind: "photo",
      photoId: "fox-001",
      alt: undefined,
      commentary: undefined,
      ...overrides,
    }) as unknown as Content;

  const resolve = (content: Content = createContent()) =>
    resolvePhotoComponentContentAppResolve({
      content,
      getPhoto,
    });

  beforeEach(() => {
    jest.resetAllMocks();
    mockedPhotoMetadata.mockResolvedValue(photo);
  });

  it("requests metadata using the configured photo ID and getter", async () => {
    const content = createContent();

    await resolve(content);

    expect(mockedPhotoMetadata).toHaveBeenCalledTimes(1);
    expect(mockedPhotoMetadata).toHaveBeenCalledWith({
      photoId: "fox-001",
      getPhoto,
    });
  });

  it("uses a different photo ID when supplied", async () => {
    await resolve(createContent({ photoId: "deer-002" }));

    expect(mockedPhotoMetadata).toHaveBeenCalledWith({
      photoId: "deer-002",
      getPhoto,
    });
  });

  it("uses the published alt text when no override exists", async () => {
    const result = await resolve();

    expect(result.photo.alt).toBe("Original photo description");
  });

  it("uses the published commentary when no override exists", async () => {
    const result = await resolve();

    expect(result.photo.commentary).toBe("Original photo commentary");
  });

  it("prefers component-authored alt text", async () => {
    const result = await resolve(
      createContent({
        alt: "A fox walking between autumn leaves",
      }),
    );

    expect(result.photo.alt).toBe("A fox walking between autumn leaves");
    expect(result.photo.commentary).toBe("Original photo commentary");
  });

  it("prefers component-authored commentary", async () => {
    const result = await resolve(
      createContent({
        commentary: "Photographed at sunrise",
      }),
    );

    expect(result.photo.commentary).toBe("Photographed at sunrise");
    expect(result.photo.alt).toBe("Original photo description");
  });

  it("supports overriding both editorial fields", async () => {
    const result = await resolve(
      createContent({
        alt: "Custom alt text",
        commentary: "Custom commentary",
      }),
    );

    expect(result.photo).toMatchObject({
      alt: "Custom alt text",
      commentary: "Custom commentary",
    });
  });

  it("preserves explicitly empty overrides", async () => {
    const result = await resolve(
      createContent({
        alt: "",
        commentary: "",
      }),
    );

    expect(result.photo.alt).toBe("");
    expect(result.photo.commentary).toBe("");
  });

  it("preserves the resolved photo metadata", async () => {
    const result = await resolve();

    expect(result.photo).toMatchObject({
      id: "fox-001",
      title: "Red Fox",
      width: 6000,
      height: 4000,
      dimensions: {
        width: 1400,
        height: 933,
      },
    });
  });

  it("preserves surrounding component properties", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(result).toEqual({
      ...content,
      photo,
    });
  });

  it("returns new component and photo objects", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(result).not.toBe(content);
    expect(result.photo).not.toBe(photo);
  });

  it("does not mutate published metadata", async () => {
    const frozenPhoto = Object.freeze({ ...photo });

    mockedPhotoMetadata.mockResolvedValue(frozenPhoto);

    const result = await resolve(createContent({ alt: "Custom alt" }));

    expect(result.photo.alt).toBe("Custom alt");
    expect(frozenPhoto.alt).toBe("Original photo description");
  });

  it("propagates metadata resolution failures", async () => {
    const error = new Error("Unable to resolve photo: missing");

    mockedPhotoMetadata.mockRejectedValue(error);

    await expect(
      resolve(createContent({ photoId: "missing" })),
    ).rejects.toThrow(error);
  });
});
