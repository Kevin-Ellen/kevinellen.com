// src/app/life-cycle/app-resolve/resolvers/content/modules/photo-sequence/photo-sequence.module.content.resolver.app-resolve.test.ts

import { resolvePhotoSequenceModuleAppResolve } from "./photo-sequence.module.content.resolver.app-resolve";
import { resolvePhotoComponentContentAppResolve } from "../../components/photo/photo.component.content.resolver.app-resolve";

jest.mock(
  "../../components/photo/photo.component.content.resolver.app-resolve",
  () => ({
    resolvePhotoComponentContentAppResolve: jest.fn(),
  }),
);

const mockedPhoto = jest.mocked(resolvePhotoComponentContentAppResolve);

type Input = Parameters<typeof resolvePhotoSequenceModuleAppResolve>[0];
type Content = Input["content"];
type PhotoInput = Content["photos"][number];
type ResolvedPhoto = Awaited<
  ReturnType<typeof resolvePhotoComponentContentAppResolve>
>;

describe("Photo-sequence module AppResolve resolver", () => {
  const getPhoto = jest.fn<
    ReturnType<Input["getPhoto"]>,
    Parameters<Input["getPhoto"]>
  >();

  const createPhoto = (photoId: string): PhotoInput =>
    ({
      kind: "photo",
      photoId,
    }) as unknown as PhotoInput;

  const createContent = (
    photos: readonly PhotoInput[] = [
      createPhoto("first"),
      createPhoto("second"),
      createPhoto("third"),
    ],
  ): Content =>
    ({
      kind: "photoSequence",
      photos,
    }) as unknown as Content;

  const resolve = (content = createContent()) =>
    resolvePhotoSequenceModuleAppResolve({ content, getPhoto });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedPhoto.mockImplementation(
      async ({ content }) =>
        ({
          ...content,
          photo: { id: content.photoId },
        }) as unknown as ResolvedPhoto,
    );
  });

  it("resolves every photo in its original order", async () => {
    const content = createContent();
    const result = await resolve(content);

    expect(mockedPhoto).toHaveBeenCalledTimes(3);
    expect(result.photos.map((entry) => entry.photo.id)).toEqual([
      "first",
      "second",
      "third",
    ]);

    content.photos.forEach((photo, index) => {
      expect(mockedPhoto).toHaveBeenNthCalledWith(index + 1, {
        content: photo,
        getPhoto,
      });
    });
  });

  it("preserves the resolved photo references", async () => {
    const resolvedPhoto = {
      kind: "photo",
      photo: { id: "custom" },
    } as unknown as ResolvedPhoto;

    mockedPhoto.mockResolvedValue(resolvedPhoto);

    const result = await resolve(createContent([createPhoto("first")]));

    expect(result.photos[0]).toBe(resolvedPhoto);
  });

  it("supports an empty photo sequence", async () => {
    const result = await resolve(createContent([]));

    expect(result.photos).toEqual([]);
    expect(mockedPhoto).not.toHaveBeenCalled();
  });

  it("preserves the surrounding module properties", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(result.kind).toBe(content.kind);
  });

  it("returns a new module and photo collection", async () => {
    const content = createContent();
    const result = await resolve(content);

    expect(result).not.toBe(content);
    expect(result.photos).not.toBe(content.photos);
  });

  it("does not mutate the original sequence", async () => {
    const content = Object.freeze(createContent());
    const originalPhoto = content.photos[0];

    await resolve(content);

    expect(content.photos[0]).toBe(originalPhoto);
  });

  it("propagates photo component resolution failures", async () => {
    const error = new Error("Photo resolution failed");
    mockedPhoto.mockRejectedValue(error);

    await expect(resolve()).rejects.toThrow(error);
  });
});
