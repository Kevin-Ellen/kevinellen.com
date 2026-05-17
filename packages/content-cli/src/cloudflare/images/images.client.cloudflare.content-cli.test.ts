// packages/content-cli/src/cloudflare/images/images.client.cloudflare.content-cli.test.ts

import {
  uploadCloudflareImage,
  CloudflareImageUploadMetadata,
} from "@content-cli/cloudflare/images/images.client.cloudflare.content-cli";
import type { PreparedPhotoUpload } from "@content-cli/content/photo/utils/prepare-upload.photo.util.content";

describe("uploadCloudflareImage full branch coverage", () => {
  let fetchMock: jest.Mock;

  const mockConfig = {
    cloudflareAccountId: "fake-account",
    cloudflareKvApiToken: "fake-token",
    cloudflareImagesApiToken: "fake-images-token",
    cloudflareKvPhotosNamespaceId: "fake-photos-ns",
    cloudflareKvJournalsNamespaceId: "fake-journals-ns",
    cloudflareKvNotesNamespaceId: "fake-notes-ns",
  } as const;

  const mockUpload: PreparedPhotoUpload = {
    buffer: new Uint8Array([1, 2, 3]).buffer,
    mimeType: "image/jpeg",
    fileName: "test.jpg",
    size: 3,
  };

  const mockMetadata: CloudflareImageUploadMetadata = {
    photoId: "photo-1",
    workspaceId: "ws-1",
    creator: "kevin",
  };

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as any;
    jest.useFakeTimers({ now: new Date("2026-05-09T00:00:00Z").getTime() });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it("hits the SUCCESS branch", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        errors: [],
        result: { id: "cf-123", uploaded: "2026-05-09T01:00:00Z" },
      }),
    });

    const result = await uploadCloudflareImage(
      mockConfig,
      mockUpload,
      mockMetadata,
    );

    expect(result).toEqual({
      id: "cf-123",
      uploadedAt: "2026-05-09T01:00:00Z",
    });
  });

  it("falls back to new Date().toISOString() if result.uploaded is undefined", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        errors: [],
        result: { id: "cf-456" }, // uploaded missing
      }),
    });

    const now = new Date();
    jest.useFakeTimers({ now: now.getTime() });

    const result = await uploadCloudflareImage(
      mockConfig,
      mockUpload,
      mockMetadata,
    );

    expect(result.id).toBe("cf-456");
    expect(result.uploadedAt).toBe(now.toISOString());
  });

  it("hits the DUPLICATE branch when errors include 'already exists'", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        errors: [{ message: "Image already exists" }],
      }),
    });

    const now = new Date();
    jest.useFakeTimers({ now: now.getTime() });

    const result = await uploadCloudflareImage(
      mockConfig,
      mockUpload,
      mockMetadata,
    );

    expect(result.id).toBe(mockMetadata.photoId);
    expect(result.uploadedAt).toBe(now.toISOString());
  });

  it("handles empty errors array in duplicate check", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        errors: [],
      }),
    });

    await expect(
      uploadCloudflareImage(mockConfig, mockUpload, mockMetadata),
    ).rejects.toThrow(/Cloudflare Images upload failed for test\.jpg/);
  });

  it("handles non-serializable error in duplicate check", async () => {
    const circular: any = {};
    circular.self = circular;

    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        errors: [circular],
      }),
    });

    await expect(
      uploadCloudflareImage(mockConfig, mockUpload, mockMetadata),
    ).rejects.toThrow(/Cloudflare Images upload failed for test\.jpg/);
  });

  it("handles REAL FAILURE branch for non-duplicate error", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        errors: [{ message: "Some other error" }],
      }),
    });

    await expect(
      uploadCloudflareImage(mockConfig, mockUpload, mockMetadata),
    ).rejects.toThrow(/Cloudflare Images upload failed for test\.jpg/);
  });
});
