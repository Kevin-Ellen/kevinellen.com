// packages/content-cli/src/content/photo/utils/homepage-strip.index.photo.util.contents.test.ts

import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { updateHomepageStripPhotoIndex } from "@content-cli/content/photo/utils/homepage-strip.index.photo.util.contents";
import { HOMEPAGE_STRIP_PHOTO_INDEX_KEY } from "@shared-types/media/photo/indices.photo.types";

import type { ContentCliConfig } from "@content-cli/config/load.content-cli.config";

jest.mock("@content-cli/cloudflare/kv/read.client.cloudflare.content-cli");
jest.mock("@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli");

const mockedReadKv = jest.mocked(readCloudflareKvValue);
const mockedWriteKv = jest.mocked(writeCloudflareKvValue);

const config = {
  cloudflareKvPhotosNamespaceId: "photos-kv",
} as ContentCliConfig;

describe("updateHomepageStripPhotoIndex", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date("2026-05-10T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does nothing when no photo IDs are provided", async () => {
    await updateHomepageStripPhotoIndex(config, []);

    expect(mockedReadKv).not.toHaveBeenCalled();
    expect(mockedWriteKv).not.toHaveBeenCalled();
  });

  it("creates the index when none exists", async () => {
    mockedReadKv.mockResolvedValue(null);

    await updateHomepageStripPhotoIndex(config, ["photo-1", "photo-2"]);

    expect(mockedWriteKv).toHaveBeenCalledWith(
      config,
      "photos-kv",
      HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
      {
        photoIds: ["photo-1", "photo-2"],
        updatedAt: "2026-05-10T12:00:00.000Z",
      },
    );
  });

  it("deduplicates incoming IDs and appends only new IDs", async () => {
    mockedReadKv.mockResolvedValue({
      photoIds: ["photo-1"],
      updatedAt: "old-date",
    });

    await updateHomepageStripPhotoIndex(config, [
      "photo-1",
      "photo-2",
      "photo-2",
      "photo-3",
    ]);

    expect(mockedWriteKv).toHaveBeenCalledWith(
      config,
      "photos-kv",
      HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
      {
        photoIds: ["photo-1", "photo-2", "photo-3"],
        updatedAt: "2026-05-10T12:00:00.000Z",
      },
    );
  });

  it("does not write when all incoming IDs already exist", async () => {
    mockedReadKv.mockResolvedValue({
      photoIds: ["photo-1", "photo-2"],
      updatedAt: "old-date",
    });

    await updateHomepageStripPhotoIndex(config, ["photo-2", "photo-1"]);

    expect(mockedWriteKv).not.toHaveBeenCalled();
  });
});
