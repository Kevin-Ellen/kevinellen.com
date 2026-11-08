// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/photo-pair/photo-pair.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolvePhotoPairModuleContentAppRenderContext } from "./photo-pair.module.body.page.document.content.resolver.app-render-context";

import { resolvePhotoComponentContentAppRenderContext } from "../../components/photo/photo.component.body.page.document.content.resolver.app-render-context";

jest.mock(
  "../../components/photo/photo.component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolvePhotoComponentContentAppRenderContext: jest.fn(),
  }),
);

const mockedPhoto = jest.mocked(resolvePhotoComponentContentAppRenderContext);

type Content = Parameters<
  typeof resolvePhotoPairModuleContentAppRenderContext
>[0]["content"];

type Photo = Content["photos"][number];
type ResolvedPhoto = ReturnType<
  typeof resolvePhotoComponentContentAppRenderContext
>;

describe("Photo pair module AppRenderContext resolver", () => {
  const createPhoto = (id: string): Photo =>
    ({
      kind: "photo",
      photo: { id },
    }) as unknown as Photo;

  const first = createPhoto("first");
  const second = createPhoto("second");

  const createContent = (): Content =>
    ({
      kind: "photoPair",
      photos: [first, second],
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedPhoto.mockImplementation(
      ({ content }) =>
        ({
          kind: content.kind,
          photo: content.photo,
        }) as unknown as ResolvedPhoto,
    );
  });

  it("resolves both photos in tuple order", () => {
    const content = createContent();

    resolvePhotoPairModuleContentAppRenderContext({ content });

    expect(mockedPhoto).toHaveBeenCalledTimes(2);
    expect(mockedPhoto).toHaveBeenNthCalledWith(1, {
      content: first,
    });
    expect(mockedPhoto).toHaveBeenNthCalledWith(2, {
      content: second,
    });
  });

  it("preserves the exact resolved photo references", () => {
    const resolvedFirst = {
      kind: "photo",
      photo: { id: "resolved-first" },
    } as unknown as ResolvedPhoto;

    const resolvedSecond = {
      kind: "photo",
      photo: { id: "resolved-second" },
    } as unknown as ResolvedPhoto;

    mockedPhoto
      .mockReturnValueOnce(resolvedFirst)
      .mockReturnValueOnce(resolvedSecond);

    const result = resolvePhotoPairModuleContentAppRenderContext({
      content: createContent(),
    });

    expect(result.photos).toHaveLength(2);
    expect(result.photos[0]).toBe(resolvedFirst);
    expect(result.photos[1]).toBe(resolvedSecond);
  });

  it("preserves other module properties", () => {
    const content = createContent();

    const result = resolvePhotoPairModuleContentAppRenderContext({
      content,
    });

    expect(result).toEqual({
      ...content,
      photos: result.photos,
    });
  });

  it("creates a new module and photos tuple", () => {
    const content = createContent();

    const result = resolvePhotoPairModuleContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.photos).not.toBe(content.photos);
  });

  it("propagates a failure from the first photo", () => {
    const error = new Error("First photo failed");

    mockedPhoto.mockImplementationOnce(() => {
      throw error;
    });

    expect(() =>
      resolvePhotoPairModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedPhoto).toHaveBeenCalledTimes(1);
  });

  it("propagates a failure from the second photo", () => {
    const error = new Error("Second photo failed");

    mockedPhoto
      .mockReturnValueOnce({
        kind: "photo",
      } as unknown as ResolvedPhoto)
      .mockImplementationOnce(() => {
        throw error;
      });

    expect(() =>
      resolvePhotoPairModuleContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedPhoto).toHaveBeenCalledTimes(2);
  });

  it("does not mutate the original photos tuple", () => {
    const content = createContent();
    const originalPhotos = content.photos;

    resolvePhotoPairModuleContentAppRenderContext({ content });

    expect(content.photos).toBe(originalPhotos);
    expect(content.photos[0]).toBe(first);
    expect(content.photos[1]).toBe(second);
  });
});
