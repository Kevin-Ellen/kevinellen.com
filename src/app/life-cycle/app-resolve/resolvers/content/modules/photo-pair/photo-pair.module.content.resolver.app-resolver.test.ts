// src/app/life-cycle/app-resolve/resolvers/content/modules/photo-pair/photo-pair.module.content.resolver.app-resolver.test.ts

import { resolvePhotoPairModuleContentAppResolve } from "./photo-pair.module.content.resolver.app-resolver";
import { resolvePhotoComponentContentAppResolve } from "../../components/photo/photo.component.content.resolver.app-resolve";

jest.mock(
  "../../components/photo/photo.component.content.resolver.app-resolve",
  () => ({
    resolvePhotoComponentContentAppResolve: jest.fn(),
  }),
);

const mockedPhoto = jest.mocked(resolvePhotoComponentContentAppResolve);

type Input = Parameters<typeof resolvePhotoPairModuleContentAppResolve>[0];
type Content = Input["content"];
type ResolvedPhoto = Awaited<
  ReturnType<typeof resolvePhotoComponentContentAppResolve>
>;

describe("Photo-pair module AppResolve resolver", () => {
  const getPhoto = jest.fn<
    ReturnType<Input["getPhoto"]>,
    Parameters<Input["getPhoto"]>
  >();

  const createContent = (): Content =>
    ({
      kind: "photoPair",
      photos: [
        { kind: "photo", photoId: "first" },
        { kind: "photo", photoId: "second" },
      ],
    }) as unknown as Content;

  const first = {
    kind: "photo",
    photo: { id: "resolved-first" },
  } as unknown as ResolvedPhoto;

  const second = {
    kind: "photo",
    photo: { id: "resolved-second" },
  } as unknown as ResolvedPhoto;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedPhoto.mockResolvedValueOnce(first).mockResolvedValueOnce(second);
  });

  it("resolves both photos with the supplied getter", async () => {
    const content = createContent();

    await resolvePhotoPairModuleContentAppResolve({ content, getPhoto });

    expect(mockedPhoto).toHaveBeenCalledTimes(2);
    expect(mockedPhoto).toHaveBeenNthCalledWith(1, {
      content: content.photos[0],
      getPhoto,
    });
    expect(mockedPhoto).toHaveBeenNthCalledWith(2, {
      content: content.photos[1],
      getPhoto,
    });
  });

  it("preserves the order and identity of resolved photos", async () => {
    const result = await resolvePhotoPairModuleContentAppResolve({
      content: createContent(),
      getPhoto,
    });

    expect(result.photos[0]).toBe(first);
    expect(result.photos[1]).toBe(second);
  });

  it("starts resolving both photos without waiting for the first", async () => {
    let finishFirst: ((photo: ResolvedPhoto) => void) | undefined;

    mockedPhoto
      .mockReset()
      .mockImplementationOnce(
        () =>
          new Promise<ResolvedPhoto>((resolve) => {
            finishFirst = resolve;
          }),
      )
      .mockResolvedValueOnce(second);

    const operation = resolvePhotoPairModuleContentAppResolve({
      content: createContent(),
      getPhoto,
    });

    expect(mockedPhoto).toHaveBeenCalledTimes(2);

    if (!finishFirst) {
      throw new Error("First photo resolution did not start");
    }

    finishFirst(first);

    await expect(operation).resolves.toMatchObject({
      photos: [first, second],
    });
  });

  it("returns a new module and photo pair", async () => {
    const content = createContent();

    const result = await resolvePhotoPairModuleContentAppResolve({
      content,
      getPhoto,
    });

    expect(result).not.toBe(content);
    expect(result.photos).not.toBe(content.photos);
    expect(content.photos[0]).toHaveProperty("photoId", "first");
  });

  it("propagates failures from the first photo", async () => {
    mockedPhoto.mockReset();
    mockedPhoto
      .mockRejectedValueOnce(new Error("First photo failed"))
      .mockResolvedValueOnce(second);

    await expect(
      resolvePhotoPairModuleContentAppResolve({
        content: createContent(),
        getPhoto,
      }),
    ).rejects.toThrow("First photo failed");
  });

  it("propagates failures from the second photo", async () => {
    mockedPhoto.mockReset();
    mockedPhoto
      .mockResolvedValueOnce(first)
      .mockRejectedValueOnce(new Error("Second photo failed"));

    await expect(
      resolvePhotoPairModuleContentAppResolve({
        content: createContent(),
        getPhoto,
      }),
    ).rejects.toThrow("Second photo failed");
  });
});
