// src/app/life-cycle/app-resolve/resolvers/primitives/photo-metadata/photo-metadata.primitive.resolver.app-resolve.test.ts

import type { PhotoAppResolve } from "../../../../../types/photo/photo.app-resolve.type";
import type { PhotoGetter } from "../../../getters/photo-kv/photo-kv.getter.app-resolve";

import { resolvePhotoMetadataAppResolve } from "./photo-metadata.primitive.resolver.app-resolve";

describe("Photo metadata primitive AppResolve resolver", () => {
  const createPhoto = (
    overrides: Partial<PhotoAppResolve> = {},
  ): PhotoAppResolve =>
    ({
      id: "fox-001",
      width: 6000,
      height: 4000,
      dimensions: {
        width: 1400,
        height: 933,
      },
      ...overrides,
    }) as PhotoAppResolve;

  const getPhoto = jest.fn<ReturnType<PhotoGetter>, Parameters<PhotoGetter>>();

  const resolve = (photoId = "fox-001") =>
    resolvePhotoMetadataAppResolve({
      photoId,
      getPhoto,
    });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("requests the correct photo ID", async () => {
    getPhoto.mockResolvedValue(createPhoto());

    await resolve("deer-002");

    expect(getPhoto).toHaveBeenCalledTimes(1);
    expect(getPhoto).toHaveBeenCalledWith("deer-002");
  });

  it("limits landscape photos to 1400 pixels wide", async () => {
    getPhoto.mockResolvedValue(createPhoto());

    const result = await resolve();

    expect(result.dimensions).toEqual({
      width: 1400,
      height: 933,
    });
  });

  it("does not upscale photos smaller than 1400 pixels", async () => {
    getPhoto.mockResolvedValue(
      createPhoto({
        width: 1000,
        height: 750,
      }),
    );

    const result = await resolve();

    expect(result.dimensions).toEqual({
      width: 1000,
      height: 750,
    });
  });

  it("preserves the aspect ratio of portrait photographs", async () => {
    getPhoto.mockResolvedValue(
      createPhoto({
        width: 3000,
        height: 4500,
      }),
    );

    const result = await resolve();

    expect(result.dimensions).toEqual({
      width: 1400,
      height: 2100,
    });
  });

  it("handles square photographs", async () => {
    getPhoto.mockResolvedValue(
      createPhoto({
        width: 4000,
        height: 4000,
      }),
    );

    const result = await resolve();

    expect(result.dimensions).toEqual({
      width: 1400,
      height: 1400,
    });
  });

  it("preserves photographs exactly 1400 pixels wide", async () => {
    getPhoto.mockResolvedValue(
      createPhoto({
        width: 1400,
        height: 900,
      }),
    );

    const result = await resolve();

    expect(result.dimensions).toEqual({
      width: 1400,
      height: 900,
    });
  });

  it("rounds calculated heights to the nearest integer", async () => {
    getPhoto.mockResolvedValue(
      createPhoto({
        width: 3000,
        height: 2000,
      }),
    );

    const result = await resolve();

    expect(result.dimensions.height).toBe(933);
  });

  it("preserves the original photograph metadata", async () => {
    const photo = createPhoto({
      title: "Red Fox",
      alt: "A fox in the forest",
    });

    getPhoto.mockResolvedValue(photo);

    const result = await resolve();

    expect(result).toMatchObject({
      id: "fox-001",
      title: "Red Fox",
      alt: "A fox in the forest",
      width: 6000,
      height: 4000,
    });
  });

  it("replaces previously calculated dimensions", async () => {
    getPhoto.mockResolvedValue(
      createPhoto({
        dimensions: {
          width: 200,
          height: 100,
        },
      }),
    );

    const result = await resolve();

    expect(result.dimensions).toEqual({
      width: 1400,
      height: 933,
    });
  });

  it("returns a new photo object without mutating the original", async () => {
    const photo = Object.freeze(createPhoto());

    getPhoto.mockResolvedValue(photo);

    const result = await resolve();

    expect(result).not.toBe(photo);
    expect(result.dimensions).not.toBe(photo.dimensions);
    expect(photo.width).toBe(6000);
    expect(photo.height).toBe(4000);
  });

  it("throws when the photo cannot be found", async () => {
    getPhoto.mockResolvedValue(null);

    await expect(resolve("missing-photo")).rejects.toThrow(
      "Unable to resolve photo: missing-photo",
    );
  });

  it("propagates photo getter failures", async () => {
    const error = new Error("KV unavailable");

    getPhoto.mockRejectedValue(error);

    await expect(resolve()).rejects.toThrow(error);
  });
});
