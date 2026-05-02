// tests/src/app-context/resolve/photos/photos.resolve.app-context.test.ts

import { resolvePhotosAppContext } from "@app-context/resolve/photos/photos.resolve.app-context";

const createKv = (data: Record<string, unknown>): KVNamespace =>
  ({
    get: jest.fn((key: string) => Promise.resolve(data[key] ?? null)),
  }) as unknown as KVNamespace;

const createAuthoredPhoto = (overrides = {}) => ({
  id: "photo-1",
  sourceFileName: "photo-1.jpg",
  title: "Coot with nesting material",
  alt: "A coot carrying nesting material.",
  commentary: "A field note about the moment.",
  readableLocation: "Walthamstow Wetlands",
  width: 3000,
  height: 2000,
  cloudflareImageId: "cloudflare-photo-1",
  capturedAt: "2025-05-27T10:30:00.000Z",
  cameraMake: "Canon",
  cameraModel: "EOS R7",
  lensMake: "Canon",
  lensModel: "RF100-500mm F4.5-7.1 L IS USM",
  ...overrides,
});

describe("resolvePhotosAppContext", () => {
  it("reads photos from KV using photo keys", async () => {
    const photo = createAuthoredPhoto();
    const kv = createKv({
      "photo:photo-1": photo,
    });

    await resolvePhotosAppContext({
      kv,
      photoIds: ["photo-1"],
    });

    expect(kv.get).toHaveBeenCalledWith("photo:photo-1", "json");
  });

  it("returns deterministic AppContext photo metadata", async () => {
    const photo = createAuthoredPhoto();
    const kv = createKv({
      "photo:photo-1": photo,
    });

    const result = await resolvePhotosAppContext({
      kv,
      photoIds: ["photo-1"],
    });

    expect(result).toEqual([
      {
        ...photo,
        cloudflareImageId: "cloudflare-photo-1",
      },
    ]);
  });

  it("deduplicates photo IDs before reading from KV", async () => {
    const photo = createAuthoredPhoto();
    const kv = createKv({
      "photo:photo-1": photo,
    });

    const result = await resolvePhotosAppContext({
      kv,
      photoIds: ["photo-1", "photo-1"],
    });

    expect(result).toHaveLength(1);
    expect(kv.get).toHaveBeenCalledTimes(1);
    expect(kv.get).toHaveBeenCalledWith("photo:photo-1", "json");
  });

  it("preserves first-seen order after deduplication", async () => {
    const photoA = createAuthoredPhoto({
      id: "photo-a",
      cloudflareImageId: "cloudflare-photo-a",
    });
    const photoB = createAuthoredPhoto({
      id: "photo-b",
      cloudflareImageId: "cloudflare-photo-b",
    });

    const kv = createKv({
      "photo:photo-a": photoA,
      "photo:photo-b": photoB,
    });

    const result = await resolvePhotosAppContext({
      kv,
      photoIds: ["photo-b", "photo-a", "photo-b"],
    });

    expect(result.map((photo) => photo.id)).toEqual(["photo-b", "photo-a"]);
  });

  it("throws when a photo is missing from KV", async () => {
    const kv = createKv({});

    await expect(
      resolvePhotosAppContext({
        kv,
        photoIds: ["missing-photo"],
      }),
    ).rejects.toThrow("Photo 'missing-photo' could not be resolved from KV.");
  });

  it("throws when a KV photo record is invalid", async () => {
    const kv = createKv({
      "photo:photo-1": {
        id: "photo-1",
        nonsense: true,
      },
    });

    await expect(
      resolvePhotosAppContext({
        kv,
        photoIds: ["photo-1"],
      }),
    ).rejects.toThrow("Photo 'photo-1' could not be resolved from KV.");
  });

  it("throws when a photo does not have cloudflareImageId", async () => {
    const photo = createAuthoredPhoto({
      cloudflareImageId: undefined,
    });

    const kv = createKv({
      "photo:photo-1": photo,
    });

    await expect(
      resolvePhotosAppContext({
        kv,
        photoIds: ["photo-1"],
      }),
    ).rejects.toThrow(
      "Photo 'photo-1' cannot be resolved because cloudflareImageId is missing.",
    );
  });

  it("returns an empty array without reading KV when no photo IDs are provided", async () => {
    const kv = createKv({});

    const result = await resolvePhotosAppContext({
      kv,
      photoIds: [],
    });

    expect(result).toEqual([]);
    expect(kv.get).not.toHaveBeenCalled();
  });
}); // tests/src/app-state/resolve/photos/photos.resolve.app-context.test.ts
