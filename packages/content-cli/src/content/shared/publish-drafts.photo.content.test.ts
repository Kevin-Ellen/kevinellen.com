// packages/content-cli/src/content/shared/publish-drafts.photo.content.test.ts

import fs from "node:fs/promises";

import type { ContentCliConfig } from "@content-cli/config/load.content-cli.config";
import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";

import { publishPhotoDrafts } from "@content-cli/content/shared/publish-drafts.photo.content";

jest.mock("node:fs/promises");
jest.mock(
  "@content-cli/content/photo/utils/import.draft.photo.util.content",
  () => ({
    importPhotoDraft: jest.fn(),
  }),
);
jest.mock(
  "@content-cli/content/photo/utils/prepare-upload.photo.util.content",
  () => ({
    preparePhotoUploadFile: jest.fn(),
  }),
);
jest.mock(
  "@content-cli/cloudflare/images/images.client.cloudflare.content-cli",
  () => ({
    uploadCloudflareImage: jest.fn(),
  }),
);
jest.mock(
  "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli",
  () => ({
    writeCloudflareKvValue: jest.fn(),
  }),
);
jest.mock(
  "@content-cli/content/photo/utils/captured-at-timezone.photo.util.content",
  () => ({
    enrichPhotoCapturedAtTimezone: jest.fn(),
  }),
);

const mockFs = fs as jest.Mocked<typeof fs>;
const {
  importPhotoDraft,
} = require("@content-cli/content/photo/utils/import.draft.photo.util.content");
const {
  preparePhotoUploadFile,
} = require("@content-cli/content/photo/utils/prepare-upload.photo.util.content");
const {
  uploadCloudflareImage,
} = require("@content-cli/cloudflare/images/images.client.cloudflare.content-cli");
const {
  writeCloudflareKvValue,
} = require("@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli");
const {
  enrichPhotoCapturedAtTimezone,
} = require("@content-cli/content/photo/utils/captured-at-timezone.photo.util.content");

describe("publishPhotoDrafts", () => {
  const mockConfig: ContentCliConfig = {
    cloudflareAccountId: "acct-123",
    cloudflareImagesApiToken: "token-abc",
    cloudflareKvApiToken: "kv-token",
    cloudflareKvPhotosNamespaceId: "ns-photos",
    cloudflareKvJournalsNamespaceId: "ns-journals",
  } as const;

  const workspaceId = "ws-1";
  const workspacePath = "/workspace";
  const photosPath = "/photos";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("publishes drafts for supported draft files", async () => {
    mockFs.readdir.mockResolvedValue([
      { isFile: () => true, name: "photo1.draft.ts" },
      { isFile: () => true, name: "ignore.txt" },
      { isFile: () => true, name: "journal.draft.ts" },
    ] as any);

    const mockPhoto: AuthoredPhotoMetadata = {
      id: "photo1",
      sourceFileName: "photo1.jpg",
    } as any;

    importPhotoDraft.mockResolvedValue(mockPhoto);
    preparePhotoUploadFile.mockResolvedValue({
      buffer: new ArrayBuffer(3),
      mimeType: "image/jpeg",
      fileName: "photo1.jpg",
      size: 3,
    });
    uploadCloudflareImage.mockResolvedValue({
      id: "cf-1",
      uploadedAt: "2026-05-09T01:00:00Z",
    });
    enrichPhotoCapturedAtTimezone.mockImplementation(
      (photo: AuthoredPhotoMetadata) => photo,
    );

    const result = await publishPhotoDrafts(
      mockConfig,
      workspaceId,
      workspacePath,
      photosPath,
    );

    expect(result).toHaveLength(1);
    expect(result[0].cloudflareImageId).toBe("cf-1");
    expect(result[0].cloudflareUploadedAt).toBe("2026-05-09T01:00:00Z");
    expect(writeCloudflareKvValue).toHaveBeenCalledWith(
      mockConfig,
      mockConfig.cloudflareKvPhotosNamespaceId,
      `photo:${mockPhoto.id}`,
      expect.any(Object),
    );
  });

  it("skips files that are not draft files", async () => {
    mockFs.readdir.mockResolvedValue([
      { isFile: () => true, name: "notadraft.jpg" },
    ] as any);

    const result = await publishPhotoDrafts(
      mockConfig,
      workspaceId,
      workspacePath,
      photosPath,
    );

    expect(result).toEqual([]);
    expect(writeCloudflareKvValue).not.toHaveBeenCalled();
  });
});
