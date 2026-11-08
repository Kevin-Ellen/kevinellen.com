// src/shared/resolvers/content/modules/photo-sequence/photo-sequence.module.content.resolver.shared.app-init.test.ts

import { resolvePhotoComponentContentAppInit } from "../../components/photo/photo.component.content.resolver.shared.app-init";
import { resolvePhotoSequenceModuleAppInit } from "./photo-sequence.module.content.resolver.shared.app-init";

jest.mock(
  "../../components/photo/photo.component.content.resolver.shared.app-init",
  () => ({
    resolvePhotoComponentContentAppInit: jest.fn(),
  }),
);

const mockedPhotoResolver = jest.mocked(resolvePhotoComponentContentAppInit);

type Input = Parameters<typeof resolvePhotoSequenceModuleAppInit>[0];
type Authored = Input["authored"];
type Photo = Authored["photos"][number];
type ResolvedPhoto = ReturnType<typeof resolvePhotoComponentContentAppInit>;

describe("Photo sequence module AppInit resolver", () => {
  const createPhoto = (id: string): Photo =>
    ({
      kind: "photo",
      photoId: id,
    }) as unknown as Photo;

  const createAuthored = (overrides: Partial<Authored> = {}): Authored =>
    ({
      kind: "photoSequence",
      photos: [createPhoto("fox"), createPhoto("deer")],
      ...overrides,
    }) as unknown as Authored;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedPhotoResolver.mockImplementation(({ authored }) => ({ ...authored }));
  });

  it("returns an empty photo collection", () => {
    const result = resolvePhotoSequenceModuleAppInit({
      authored: createAuthored({ photos: [] }),
    });

    expect(result.photos).toEqual([]);
    expect(mockedPhotoResolver).not.toHaveBeenCalled();
  });

  it("resolves each photograph in authored order", () => {
    const authored = createAuthored();

    resolvePhotoSequenceModuleAppInit({ authored });

    expect(mockedPhotoResolver).toHaveBeenCalledTimes(2);
    expect(mockedPhotoResolver).toHaveBeenNthCalledWith(1, {
      authored: authored.photos[0],
    });
    expect(mockedPhotoResolver).toHaveBeenNthCalledWith(2, {
      authored: authored.photos[1],
    });
  });

  it("preserves resolved photograph references", () => {
    const first = {
      kind: "photo",
      photoId: "resolved-first",
    } as unknown as ResolvedPhoto;

    const second = {
      kind: "photo",
      photoId: "resolved-second",
    } as unknown as ResolvedPhoto;

    mockedPhotoResolver.mockReturnValueOnce(first).mockReturnValueOnce(second);

    const result = resolvePhotoSequenceModuleAppInit({
      authored: createAuthored(),
    });

    expect(result.photos[0]).toBe(first);
    expect(result.photos[1]).toBe(second);
  });

  it("defaults an omitted caption to null", () => {
    const result = resolvePhotoSequenceModuleAppInit({
      authored: createAuthored(),
    });

    expect(result.caption).toBeNull();
  });

  it("preserves an authored caption", () => {
    const result = resolvePhotoSequenceModuleAppInit({
      authored: createAuthored({
        caption: "Wildlife encounters in Essex",
      }),
    });

    expect(result.caption).toBe("Wildlife encounters in Essex");
  });

  it("preserves an empty caption", () => {
    const result = resolvePhotoSequenceModuleAppInit({
      authored: createAuthored({ caption: "" }),
    });

    expect(result.caption).toBe("");
  });

  it("does not mutate authored photographs", () => {
    const authored = createAuthored();
    const original = [...authored.photos];

    const result = resolvePhotoSequenceModuleAppInit({ authored });

    expect(authored.photos).toEqual(original);
    expect(result).not.toBe(authored);
    expect(result.photos).not.toBe(authored.photos);
    expect(result.photos[0]).not.toBe(authored.photos[0]);
  });

  it("propagates photo resolution failures", () => {
    const error = new Error("Photo resolution failed");

    mockedPhotoResolver.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolvePhotoSequenceModuleAppInit({
        authored: createAuthored(),
      }),
    ).toThrow(error);

    expect(mockedPhotoResolver).toHaveBeenCalledTimes(1);
  });

  it("stops after a later photograph fails", () => {
    mockedPhotoResolver
      .mockReturnValueOnce(createPhoto("resolved"))
      .mockImplementationOnce(() => {
        throw new Error("Second photograph failed");
      });

    expect(() =>
      resolvePhotoSequenceModuleAppInit({
        authored: createAuthored(),
      }),
    ).toThrow("Second photograph failed");

    expect(mockedPhotoResolver).toHaveBeenCalledTimes(2);
  });
});
