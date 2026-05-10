// packages/content-cli/src/content/photo/publish.photo.content.test.ts

import fs from "node:fs/promises";
import path from "node:path";

import { runPublishPhotoCommand } from "@content-cli/content/photo/publish.photo.content";
import { publishPhotoDrafts } from "@content-cli/content/shared/publish-drafts.photo.content";
import { updateHomepageStripPhotoIndex } from "@content-cli/content/photo/utils/homepage-strip.index.photo.util.contents";
import { renderPhotoDraftFile } from "@content-cli/content/photo/render.photo.content";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

import type { ParsedPhotoWorkspaceArgs } from "@content-cli/types/parse-args.cli.types";

jest.mock("node:fs/promises");

jest.mock("@content-cli/content/shared/publish-drafts.photo.content");
jest.mock(
  "@content-cli/content/photo/utils/homepage-strip.index.photo.util.contents",
);
jest.mock("@content-cli/content/photo/render.photo.content");
jest.mock("@content-cli/config/load.content-cli.config");

const mockedFs = fs as jest.Mocked<typeof fs>;

const mockedPublishPhotoDrafts = jest.mocked(publishPhotoDrafts);

const mockedUpdateHomepageStripPhotoIndex = jest.mocked(
  updateHomepageStripPhotoIndex,
);

const mockedRenderPhotoDraftFile = jest.mocked(renderPhotoDraftFile);

const mockedLoadContentCliConfig = jest.mocked(loadContentCliConfig);

const createArgs = (
  overrides: Partial<ParsedPhotoWorkspaceArgs> = {},
): ParsedPhotoWorkspaceArgs => ({
  mode: "direct",
  env: "prod",
  entity: "photo",
  action: "publish",
  bucket: "drafts",
  slug: "birds",
  ...overrides,
});

describe("runPublishPhotoCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "log").mockImplementation(() => {});

    mockedLoadContentCliConfig.mockReturnValue({
      cloudflareKvPhotosNamespaceId: "photos-kv",
    } as any);

    mockedRenderPhotoDraftFile.mockReturnValue("export const photo = {};");

    mockedPublishPhotoDrafts.mockResolvedValue([
      {
        id: "robin",
      },
    ] as any);
  });

  it("rejects non-prod publishing", async () => {
    await expect(
      runPublishPhotoCommand(
        createArgs({
          env: "dev",
        }),
      ),
    ).rejects.toThrow("Photo publishing is only supported in prod.");
  });

  it("throws when no photos were published", async () => {
    mockedPublishPhotoDrafts.mockResolvedValue([]);

    await expect(runPublishPhotoCommand(createArgs())).rejects.toThrow(
      "No photo draft files found.",
    );
  });

  it("publishes photos and moves workspace", async () => {
    await runPublishPhotoCommand(createArgs());

    expect(mockedPublishPhotoDrafts).toHaveBeenCalledWith(
      expect.anything(),
      "birds",
      expect.any(String),
      expect.any(String),
    );

    expect(mockedUpdateHomepageStripPhotoIndex).toHaveBeenCalledWith(
      expect.anything(),
      ["robin"],
    );

    expect(mockedFs.rm).toHaveBeenCalled();
    expect(mockedFs.mkdir).toHaveBeenCalled();
    expect(mockedFs.rename).toHaveBeenCalled();

    expect(mockedFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining("robin.uploaded.ts"),
      "export const photo = {};",
      "utf8",
    );
  });

  it("removes the old draft file before writing uploaded metadata", async () => {
    await runPublishPhotoCommand(createArgs());

    expect(mockedFs.rm).toHaveBeenCalledWith(
      expect.stringContaining("robin.draft.ts"),
      { force: true },
    );
  });

  it("logs saved uploaded metadata paths", async () => {
    await runPublishPhotoCommand(createArgs());

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Saved:"));
  });

  it("writes uploaded metadata using rendered draft output", async () => {
    mockedPublishPhotoDrafts.mockResolvedValue([
      {
        id: "goldfinch",
      },
    ] as any);

    mockedRenderPhotoDraftFile.mockReturnValue("mock-photo-file");

    await runPublishPhotoCommand(createArgs());

    expect(mockedRenderPhotoDraftFile).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "goldfinch",
      }),
    );

    expect(mockedFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining("goldfinch.uploaded.ts"),
      "mock-photo-file",
      "utf8",
    );
  });
});
