// src/app-context/resolve/photos/photos.resolve.app-context.test.ts

import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";

import { appContextResolvePhotos } from "@app-context/resolve/photos/photos.resolve.app-context";

const createPhoto = (
  overrides: Partial<AuthoredPhotoMetadata> = {},
): AuthoredPhotoMetadata =>
  ({
    id: "coot",
    sourceFileName: "coot.jpg",
    cloudflareImageId: "cloudflare-coot",
    cloudflareUploadedAt: "2025-05-10T10:00:00.000Z",
    title: "Coot",
    alt: "A coot on the water.",
    commentary: "A fine coot.",
    readableLocation: "Essex, England",
    width: 3000,
    height: 2000,
    cameraMake: "Canon",
    cameraModel: "Canon EOS R7",
    lensModel: "RF 100-500mm",
    capturedAt: {
      utc: "2025-05-10T10:00:00.000Z",
      timezone: "Europe/London",
    },
    ...overrides,
  }) as AuthoredPhotoMetadata;

describe("appContextResolvePhotos", () => {
  it("resolves unique photos from KV", async () => {
    const photo = createPhoto();

    const kv = {
      get: jest.fn().mockResolvedValue(photo),
    } as unknown as KVNamespace;

    const result = await appContextResolvePhotos({
      kv,
      photoIds: ["coot", "coot"],
    });

    expect(result).toEqual([
      {
        ...photo,
        cloudflareImageId: "cloudflare-coot",
      },
    ]);

    expect(kv.get).toHaveBeenCalledTimes(1);

    expect(kv.get).toHaveBeenCalledWith("photo:coot", "json");
  });

  it("throws when photo metadata cannot be resolved from KV", async () => {
    const kv = {
      get: jest.fn().mockResolvedValue(null),
    } as unknown as KVNamespace;

    await expect(
      appContextResolvePhotos({
        kv,
        photoIds: ["missing-photo"],
      }),
    ).rejects.toThrow("Photo 'missing-photo' could not be resolved from KV.");
  });

  it("throws when cloudflareImageId is missing", async () => {
    const kv = {
      get: jest.fn().mockResolvedValue(
        createPhoto({
          cloudflareImageId: null,
        }),
      ),
    } as unknown as KVNamespace;

    await expect(
      appContextResolvePhotos({
        kv,
        photoIds: ["coot"],
      }),
    ).rejects.toThrow(
      "Photo 'coot' cannot be resolved because cloudflareImageId is missing.",
    );
  });

  it("returns an empty array when no photo ids are provided", async () => {
    const kv = {
      get: jest.fn(),
    } as unknown as KVNamespace;

    const result = await appContextResolvePhotos({
      kv,
      photoIds: [],
    });

    expect(result).toEqual([]);

    expect(kv.get).not.toHaveBeenCalled();
  });

  it("throws when KV returns invalid photo data", async () => {
    const kv = {
      get: jest.fn().mockResolvedValue({
        id: "broken-photo",
      }),
    } as unknown as KVNamespace;

    await expect(
      appContextResolvePhotos({
        kv,
        photoIds: ["broken-photo"],
      }),
    ).rejects.toThrow("Photo 'broken-photo' could not be resolved from KV.");
  });

  it("throws when capturedAt is not an object or null", async () => {
    const kv = {
      get: jest.fn().mockResolvedValue({
        ...createPhoto(),
        capturedAt: "2025-05-10T10:00:00.000Z",
      }),
    } as unknown as KVNamespace;

    await expect(
      appContextResolvePhotos({
        kv,
        photoIds: ["coot"],
      }),
    ).rejects.toThrow("Photo 'coot' could not be resolved from KV.");
  });

  it("throws when capturedAt utc is missing", async () => {
    const kv = {
      get: jest.fn().mockResolvedValue({
        ...createPhoto(),
        capturedAt: {
          timezone: "Europe/London",
        },
      }),
    } as unknown as KVNamespace;

    await expect(
      appContextResolvePhotos({
        kv,
        photoIds: ["coot"],
      }),
    ).rejects.toThrow("Photo 'coot' could not be resolved from KV.");
  });

  it("throws when capturedAt timezone is invalid", async () => {
    const kv = {
      get: jest.fn().mockResolvedValue({
        ...createPhoto(),
        capturedAt: {
          utc: "2025-05-10T10:00:00.000Z",
          timezone: 123,
        },
      }),
    } as unknown as KVNamespace;

    await expect(
      appContextResolvePhotos({
        kv,
        photoIds: ["coot"],
      }),
    ).rejects.toThrow("Photo 'coot' could not be resolved from KV.");
  });

  it("resolves photos with missing capturedAt", async () => {
    const photo = createPhoto({ capturedAt: null });

    const kv = {
      get: jest.fn().mockResolvedValue(photo),
    } as unknown as KVNamespace;

    await expect(
      appContextResolvePhotos({
        kv,
        photoIds: ["coot"],
      }),
    ).resolves.toEqual([
      {
        ...photo,
        cloudflareImageId: "cloudflare-coot",
      },
    ]);
  });
});
