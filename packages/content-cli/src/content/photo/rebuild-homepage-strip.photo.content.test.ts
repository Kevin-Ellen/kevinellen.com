// packages/content-cli/src/content/photo/rebuild-homepage-strip.photo.content.test.ts

import { runRebuildHomepageStripPhotoCommand } from "@content-cli/content/photo/rebuild-homepage-strip.photo.content";

import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";
import { listCloudflareKvKeys } from "@content-cli/cloudflare/kv/list.client.cloudflare.content-cli";
import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";

import { HOMEPAGE_STRIP_PHOTO_INDEX_KEY } from "@shared-types/media/photo/indices.photo.types";

jest.mock("@content-cli/config/load.content-cli.config");
jest.mock("@content-cli/cloudflare/kv/list.client.cloudflare.content-cli");
jest.mock("@content-cli/cloudflare/kv/read.client.cloudflare.content-cli");
jest.mock("@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli");

const mockedLoadConfig = jest.mocked(loadContentCliConfig);
const mockedListKeys = jest.mocked(listCloudflareKvKeys);
const mockedReadKv = jest.mocked(readCloudflareKvValue);
const mockedWriteKv = jest.mocked(writeCloudflareKvValue);

describe("runRebuildHomepageStripPhotoCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "log").mockImplementation(() => {});

    mockedLoadConfig.mockReturnValue({
      cloudflareKvPhotosNamespaceId: "photos-kv",
    } as any);
  });

  it("rebuilds the homepage strip index", async () => {
    mockedListKeys.mockResolvedValue([
      "photo:zebra",
      "photo:robin",
      HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
    ]);

    mockedReadKv
      .mockResolvedValueOnce({
        id: "zebra",
        capturedAt: {
          utc: "2026-05-10T10:00:00.000Z",
          timezone: "Europe/London",
        },
      } as any)
      .mockResolvedValueOnce({
        id: "robin",
        capturedAt: {
          utc: "2026-05-11T10:00:00.000Z",
          timezone: "Europe/London",
        },
      } as any);

    const result = await runRebuildHomepageStripPhotoCommand({
      mode: "direct",
      env: "prod",
      entity: "photo",
      action: "homepageStripRebuild",
    });

    expect(mockedListKeys).toHaveBeenCalledWith(
      expect.anything(),
      "photos-kv",
      "photo:",
    );

    expect(mockedWriteKv).toHaveBeenCalledWith(
      expect.anything(),
      "photos-kv",
      HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
      expect.objectContaining({
        photoIds: ["robin", "zebra"],
      }),
    );

    expect(console.log).toHaveBeenCalledWith(
      "Rebuilt homepage strip index with 2 photos.",
    );

    expect(result).toEqual({ ok: true });
  });

  it("sorts deterministically when capturedAt dates match", async () => {
    mockedListKeys.mockResolvedValue(["photo:b", "photo:a"]);

    mockedReadKv
      .mockResolvedValueOnce({
        id: "b",
        capturedAt: {
          utc: "2026-05-10T10:00:00.000Z",
          timezone: null,
        },
      } as any)
      .mockResolvedValueOnce({
        id: "a",
        capturedAt: {
          utc: "2026-05-10T10:00:00.000Z",
          timezone: null,
        },
      } as any);

    await runRebuildHomepageStripPhotoCommand({
      mode: "direct",
      env: "prod",
      entity: "photo",
      action: "homepageStripRebuild",
    });

    expect(mockedWriteKv).toHaveBeenCalledWith(
      expect.anything(),
      "photos-kv",
      HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
      expect.objectContaining({
        photoIds: ["a", "b"],
      }),
    );
  });

  it("handles photos without capturedAt", async () => {
    mockedListKeys.mockResolvedValue(["photo:robin"]);

    mockedReadKv.mockResolvedValue({
      id: "robin",
      capturedAt: null,
    } as any);

    await runRebuildHomepageStripPhotoCommand({
      mode: "direct",
      env: "prod",
      entity: "photo",
      action: "homepageStripRebuild",
    });

    expect(mockedWriteKv).toHaveBeenCalledWith(
      expect.anything(),
      "photos-kv",
      HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
      expect.objectContaining({
        photoIds: ["robin"],
      }),
    );
  });

  it("sorts deterministically when all photos are missing capturedAt", async () => {
    mockedListKeys.mockResolvedValue(["photo:zebra", "photo:alpha"]);

    mockedReadKv
      .mockResolvedValueOnce({
        id: "zebra",
        capturedAt: null,
      } as any)
      .mockResolvedValueOnce({
        id: "alpha",
        capturedAt: null,
      } as any);

    await runRebuildHomepageStripPhotoCommand({
      mode: "direct",
      env: "prod",
      entity: "photo",
      action: "homepageStripRebuild",
    });

    expect(mockedWriteKv).toHaveBeenCalledWith(
      expect.anything(),
      "photos-kv",
      HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
      expect.objectContaining({
        photoIds: ["alpha", "zebra"],
      }),
    );
  });
});
