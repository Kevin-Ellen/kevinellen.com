// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/photo-sequence/photo-sequence.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolvePhotoSequenceModuleAppRenderContext } from "./photo-sequence.module.body.page.document.content.resolver.app-render-context";

import { resolvePhotoComponentContentAppRenderContext } from "../../components/photo/photo.component.body.page.document.content.resolver.app-render-context";

jest.mock(
  "../../components/photo/photo.component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolvePhotoComponentContentAppRenderContext: jest.fn(),
  }),
);

const mockedPhoto = jest.mocked(resolvePhotoComponentContentAppRenderContext);

type Content = Parameters<
  typeof resolvePhotoSequenceModuleAppRenderContext
>[0]["content"];

type Photo = Content["photos"][number];
type ResolvedPhoto = ReturnType<
  typeof resolvePhotoComponentContentAppRenderContext
>;

describe("Photo sequence module AppRenderContext resolver", () => {
  const createPhoto = (id: string): Photo =>
    ({
      kind: "photo",
      photo: { id },
    }) as unknown as Photo;

  const createContent = (
    photos: Photo[] = [
      createPhoto("one"),
      createPhoto("two"),
      createPhoto("three"),
    ],
  ): Content =>
    ({
      kind: "photoSequence",
      photos,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedPhoto.mockImplementation(
      ({ content }) =>
        ({
          kind: "photo",
          photo: content.photo,
        }) as unknown as ResolvedPhoto,
    );
  });

  it("resolves every photo in order", () => {
    const content = createContent();

    resolvePhotoSequenceModuleAppRenderContext({ content });

    expect(mockedPhoto).toHaveBeenCalledTimes(3);

    content.photos.forEach((photo, index) => {
      expect(mockedPhoto).toHaveBeenNthCalledWith(index + 1, {
        content: photo,
      });
    });
  });

  it("preserves the exact resolved photo references", () => {
    const resolved = ["one", "two", "three"].map(
      (id) =>
        ({
          kind: "photo",
          photo: { id: `resolved-${id}` },
        }) as unknown as ResolvedPhoto,
    );

    resolved.forEach((photo) => {
      mockedPhoto.mockReturnValueOnce(photo);
    });

    const result = resolvePhotoSequenceModuleAppRenderContext({
      content: createContent(),
    });

    expect(result.photos).toHaveLength(3);

    resolved.forEach((photo, index) => {
      expect(result.photos[index]).toBe(photo);
    });
  });

  it("supports an empty photo sequence", () => {
    const result = resolvePhotoSequenceModuleAppRenderContext({
      content: createContent([]),
    });

    expect(result.photos).toEqual([]);
    expect(mockedPhoto).not.toHaveBeenCalled();
  });

  it("supports a single photo", () => {
    const result = resolvePhotoSequenceModuleAppRenderContext({
      content: createContent([createPhoto("only")]),
    });

    expect(result.photos).toHaveLength(1);
    expect(mockedPhoto).toHaveBeenCalledTimes(1);
  });

  it("preserves other module properties", () => {
    const content = createContent();

    const result = resolvePhotoSequenceModuleAppRenderContext({
      content,
    });

    expect(result).toEqual({
      ...content,
      photos: result.photos,
    });
  });

  it("creates new module and collection references", () => {
    const content = createContent();

    const result = resolvePhotoSequenceModuleAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.photos).not.toBe(content.photos);
  });

  it("propagates photo resolution failures", () => {
    const error = new Error("Sequence photo failed");

    mockedPhoto.mockImplementationOnce(() => {
      throw error;
    });

    expect(() =>
      resolvePhotoSequenceModuleAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);
  });

  it("does not mutate the original photo collection", () => {
    const content = createContent();
    const originalPhotos = content.photos;
    const originalFirst = content.photos[0];

    resolvePhotoSequenceModuleAppRenderContext({ content });

    expect(content.photos).toBe(originalPhotos);
    expect(content.photos[0]).toBe(originalFirst);
  });
});
