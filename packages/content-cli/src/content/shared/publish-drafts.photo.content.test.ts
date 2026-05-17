// packages/content-cli/src/content/shared/publish-drafts.photo.content.test.ts

import fs from "node:fs/promises";

import type { ContentCliConfig } from "@content-cli/config/load.content-cli.config";
import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";

import { uploadCloudflareImage } from "@content-cli/cloudflare/images/images.client.cloudflare.content-cli";
import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { importPhotoDraft } from "@content-cli/content/photo/utils/import.draft.photo.util.content";
import { preparePhotoUploadFile } from "@content-cli/content/photo/utils/prepare-upload.photo.util.content";
import { enrichPhotoCapturedAtTimezone } from "@content-cli/content/photo/utils/captured-at-timezone.photo.util.content";
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

describe("publishPhotoDrafts", () => {
  const mockFs = jest.mocked(fs);
  const mockedImportPhotoDraft = jest.mocked(importPhotoDraft);
  const mockedPreparePhotoUploadFile = jest.mocked(preparePhotoUploadFile);
  const mockedUploadCloudflareImage = jest.mocked(uploadCloudflareImage);
  const mockedWriteCloudflareKvValue = jest.mocked(writeCloudflareKvValue);
  const mockedEnrichPhotoCapturedAtTimezone = jest.mocked(
    enrichPhotoCapturedAtTimezone,
  );

  const mockConfig: ContentCliConfig = {
    cloudflareAccountId: "fake-account",
    cloudflareKvApiToken: "fake-token",
    cloudflareImagesApiToken: "fake-images-token",
    cloudflareKvPhotosNamespaceId: "fake-photos-ns",
    cloudflareKvJournalsNamespaceId: "fake-journals-ns",
    cloudflareKvNotesNamespaceId: "fake-notes-ns",
  };

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
    ] as never);

    const mockPhoto: AuthoredPhotoMetadata = {
      id: "photo1",
      sourceFileName: "photo1.jpg",
    } as AuthoredPhotoMetadata;

    mockedImportPhotoDraft.mockResolvedValue(mockPhoto);

    mockedPreparePhotoUploadFile.mockResolvedValue({
      buffer: new ArrayBuffer(3),
      mimeType: "image/jpeg",
      fileName: "photo1.jpg",
      size: 3,
    });

    mockedUploadCloudflareImage.mockResolvedValue({
      id: "cf-1",
      uploadedAt: "2026-05-09T01:00:00Z",
    });

    mockedEnrichPhotoCapturedAtTimezone.mockImplementation(
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

    expect(mockedWriteCloudflareKvValue).toHaveBeenCalledWith(
      mockConfig,
      mockConfig.cloudflareKvPhotosNamespaceId,
      `photo:${mockPhoto.id}`,
      expect.any(Object),
    );
  });

  it("skips files that are not draft files", async () => {
    mockFs.readdir.mockResolvedValue([
      { isFile: () => true, name: "notadraft.jpg" },
    ] as never);

    const result = await publishPhotoDrafts(
      mockConfig,
      workspaceId,
      workspacePath,
      photosPath,
    );

    expect(result).toEqual([]);
    expect(mockedWriteCloudflareKvValue).not.toHaveBeenCalled();
  });
});
