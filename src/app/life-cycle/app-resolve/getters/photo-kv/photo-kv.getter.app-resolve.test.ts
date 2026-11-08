// src/app/life-cycle/app-resolve/getters/photo-kv/photo-kv.getter.app-resolve.test.ts

import type { PhotoAppResolve } from "../../../../types/photo/photo.app-resolve.type";
import type { PhotoAppInit } from "../../../../../shared/types/assets/photo.asset.shared.app-init.type";

import {
  createPhotoGetter,
  type PhotoGetter,
} from "./photo-kv.getter.app-resolve";

describe("Photo KV getter AppResolve", () => {
  const kvGet = jest.fn();

  const kv = {
    get: kvGet,
  } as unknown as KVNamespace;

  const photoId = "test-photo";

  const createPhoto = (id = photoId): PhotoAppInit =>
    ({
      id,
      title: "Test photograph",
      alt: "A test photograph",
      width: 1200,
      height: 800,
      species: null,
    }) as PhotoAppInit;

  const resolvePhoto = (photo: PhotoAppInit): PhotoAppResolve => ({
    ...photo,
    dimensions: {
      width: photo.width,
      height: photo.height,
    },
  });

  let getPhoto: PhotoGetter;

  beforeEach(() => {
    jest.resetAllMocks();
    getPhoto = createPhotoGetter(kv);
  });

  it("retrieves the requested photo as JSON", async () => {
    const photo = createPhoto();

    kvGet.mockResolvedValue(photo);

    await expect(getPhoto(photoId)).resolves.toEqual(resolvePhoto(photo));

    expect(kvGet).toHaveBeenCalledWith("photo:test-photo", "json");
    expect(kvGet).toHaveBeenCalledTimes(1);
  });

  it("returns null when the photo does not exist", async () => {
    kvGet.mockResolvedValue(null);

    await expect(getPhoto(photoId)).resolves.toBeNull();
  });

  it("propagates KV retrieval failures", async () => {
    const error = new Error("KV unavailable");

    kvGet.mockRejectedValue(error);

    await expect(getPhoto(photoId)).rejects.toBe(error);
  });

  const expectInvalid = async (photo: unknown): Promise<void> => {
    kvGet.mockResolvedValue(photo);

    await expect(getPhoto(photoId)).rejects.toThrow(
      "Invalid published photo in KV: photo:test-photo",
    );
  };

  it.each([undefined, false, 0, "invalid", [], {}])(
    "rejects invalid photo payload %p",
    async (value) => {
      await expectInvalid(value);
    },
  );

  it("rejects an unexpected photo ID", async () => {
    await expectInvalid({
      ...createPhoto(),
      id: "another-photo",
    });
  });

  it.each([
    ["width", 0],
    ["width", -100],
    ["width", Number.NaN],
    ["height", Infinity],
    ["height", "800"],
  ] as const)("rejects invalid %s: %p", async (field, value) => {
    await expectInvalid({
      ...createPhoto(),
      [field]: value,
    });
  });

  it("maps published dimensions into the resolved photo", async () => {
    const photo = createPhoto();

    kvGet.mockResolvedValue(photo);

    await expect(getPhoto(photoId)).resolves.toEqual(resolvePhoto(photo));
  });

  it("rejects malformed species", async () => {
    await expectInvalid({
      ...createPhoto(),
      species: [
        {
          name: "Robin",
          scientificName: "Erithacus rubecula",
          taxonRank: "genus",
        },
      ],
    });
  });

  it.each([null, undefined, "Robin", 123, false, []])(
    "rejects non-object species entry %p",
    async (species) => {
      await expectInvalid({
        ...createPhoto(),
        species: [species],
      });
    },
  );

  it("accepts valid species metadata", async () => {
    const photo = {
      ...createPhoto(),
      species: [
        {
          name: "Robin",
          scientificName: "Erithacus rubecula",
          taxonRank: "species" as const,
        },
      ],
    };

    kvGet.mockResolvedValue(photo);

    await expect(getPhoto(photoId)).resolves.toEqual(resolvePhoto(photo));
  });

  it("accepts an empty species array", async () => {
    const photo = {
      ...createPhoto(),
      species: [],
    };

    kvGet.mockResolvedValue(photo);

    await expect(getPhoto(photoId)).resolves.toEqual(resolvePhoto(photo));
  });

  it("accepts published species without taxonRank", async () => {
    const photo = {
      ...createPhoto(),
      species: [
        {
          name: "Sheep",
          scientificName: "Ovis aries",
        },
      ],
    };

    kvGet.mockResolvedValue(photo);

    await expect(getPhoto(photoId)).resolves.toEqual({
      ...photo,
      dimensions: {
        width: photo.width,
        height: photo.height,
      },
    });
  });

  describe("Request-scoped deduplication", () => {
    it("deduplicates concurrent requests for the same photo", async () => {
      const photo = createPhoto();

      kvGet.mockResolvedValue(photo);

      const first = getPhoto(photoId);
      const second = getPhoto(photoId);

      expect(first).toBe(second);

      await expect(Promise.all([first, second])).resolves.toEqual([
        resolvePhoto(photo),
        resolvePhoto(photo),
      ]);

      expect(kvGet).toHaveBeenCalledTimes(1);
    });

    it("reuses a successfully resolved photo", async () => {
      const photo = createPhoto();

      kvGet.mockResolvedValue(photo);

      const first = await getPhoto(photoId);
      const second = await getPhoto(photoId);

      expect(first).toEqual(resolvePhoto(photo));
      expect(second).toBe(first);

      expect(kvGet).toHaveBeenCalledTimes(1);
    });

    it("caches missing photos within the request", async () => {
      kvGet.mockResolvedValue(null);

      await expect(getPhoto(photoId)).resolves.toBeNull();
      await expect(getPhoto(photoId)).resolves.toBeNull();

      expect(kvGet).toHaveBeenCalledTimes(1);
    });

    it("retrieves different photo IDs independently", async () => {
      const firstPhoto = createPhoto("first-photo");
      const secondPhoto = createPhoto("second-photo");

      kvGet.mockImplementation(async (key: string) => {
        if (key === "photo:first-photo") {
          return firstPhoto;
        }

        if (key === "photo:second-photo") {
          return secondPhoto;
        }

        return null;
      });

      const result = await Promise.all([
        getPhoto("first-photo"),
        getPhoto("second-photo"),
      ]);

      expect(result).toEqual([
        resolvePhoto(firstPhoto),
        resolvePhoto(secondPhoto),
      ]);

      expect(kvGet).toHaveBeenCalledTimes(2);
      expect(kvGet).toHaveBeenCalledWith("photo:first-photo", "json");
      expect(kvGet).toHaveBeenCalledWith("photo:second-photo", "json");
    });

    it("evicts failed requests so they can be retried", async () => {
      const error = new Error("KV temporarily unavailable");
      const photo = createPhoto();

      kvGet.mockRejectedValueOnce(error).mockResolvedValueOnce(photo);

      await expect(getPhoto(photoId)).rejects.toBe(error);

      await expect(getPhoto(photoId)).resolves.toEqual(resolvePhoto(photo));

      expect(kvGet).toHaveBeenCalledTimes(2);
    });

    it("evicts invalid published photos so they can be retried", async () => {
      const photo = createPhoto();

      kvGet
        .mockResolvedValueOnce({
          ...photo,
          width: 0,
        })
        .mockResolvedValueOnce(photo);

      await expect(getPhoto(photoId)).rejects.toThrow(
        "Invalid published photo in KV: photo:test-photo",
      );

      await expect(getPhoto(photoId)).resolves.toEqual(resolvePhoto(photo));

      expect(kvGet).toHaveBeenCalledTimes(2);
    });

    it("isolates caches between getter instances", async () => {
      const photo = createPhoto();

      kvGet.mockResolvedValue(photo);

      const firstGetter = createPhotoGetter(kv);
      const secondGetter = createPhotoGetter(kv);

      const first = await firstGetter(photoId);
      const second = await secondGetter(photoId);

      expect(first).toEqual(resolvePhoto(photo));
      expect(second).toEqual(resolvePhoto(photo));
      expect(first).not.toBe(second);

      expect(kvGet).toHaveBeenCalledTimes(2);
    });
  });
});
