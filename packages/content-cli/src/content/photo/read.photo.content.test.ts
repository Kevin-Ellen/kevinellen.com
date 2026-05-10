// packages/content-cli/src/content/photo/read.photo.content.test.ts

import { runReadPhotoCommand } from "@content-cli/content/photo/read.photo.content";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";
import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";

import type { ParsedPhotoReadArgs } from "@content-cli/types/parse-args.cli.types";

jest.mock("@content-cli/config/load.content-cli.config");
jest.mock("@content-cli/cloudflare/kv/read.client.cloudflare.content-cli");

const mockedLoadConfig = jest.mocked(loadContentCliConfig);
const mockedReadKv = jest.mocked(readCloudflareKvValue);

const createArgs = (
  overrides: Partial<ParsedPhotoReadArgs> = {},
): ParsedPhotoReadArgs => ({
  mode: "direct",
  env: "dev",
  entity: "photo",
  action: "read",
  bucket: "drafts",
  photoId: "photo-1",
  ...overrides,
});

describe("runReadPhotoCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "log").mockImplementation(() => {});

    mockedLoadConfig.mockReturnValue({
      cloudflareKvPhotosNamespaceId: "photos-kv",
    } as any);
  });

  it("requires a photoId", async () => {
    await expect(
      runReadPhotoCommand(createArgs({ photoId: undefined })),
    ).rejects.toThrow("Photo read requires --photo-id.");
  });

  it("reads the photo from KV", async () => {
    mockedReadKv.mockResolvedValue({
      id: "photo-1",
      title: "Robin",
    } as any);

    const result = await runReadPhotoCommand(createArgs());

    expect(mockedLoadConfig).toHaveBeenCalledWith("dev");

    expect(mockedReadKv).toHaveBeenCalledWith(
      expect.anything(),
      "photos-kv",
      "photo:photo-1",
    );

    expect(result).toEqual({ ok: true });
  });

  it("prints the photo JSON", async () => {
    mockedReadKv.mockResolvedValue({
      id: "photo-1",
      title: "Robin",
    } as any);

    await runReadPhotoCommand(createArgs());

    expect(console.log).toHaveBeenCalledWith("\nPhoto from KV\n");

    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify(
        {
          id: "photo-1",
          title: "Robin",
        },
        null,
        2,
      ),
    );
  });
});
