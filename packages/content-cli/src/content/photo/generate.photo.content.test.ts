// packages/content-cli/src/content/photo/generate.photo.content.test.ts

import type { ParsedPhotoWorkspaceArgs } from "@content-cli/types/parse-args.cli.types";

import { runGeneratePhotoCommand } from "@content-cli/content/photo/generate.photo.content";
import { generatePhotoDrafts } from "@content-cli/content/shared/generate-drafts.photo.content";

jest.mock("@content-cli/content/shared/generate-drafts.photo.content");

const mockedGeneratePhotoDrafts = jest.mocked(generatePhotoDrafts);

const createArgs = (
  overrides: Partial<ParsedPhotoWorkspaceArgs> = {},
): ParsedPhotoWorkspaceArgs => ({
  mode: "direct",
  env: "dev",
  entity: "photo",
  action: "generate",
  bucket: "drafts",
  slug: "mallorca-birds",
  ...overrides,
});

describe("runGeneratePhotoCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("requires a slug", async () => {
    await expect(
      runGeneratePhotoCommand(
        createArgs({
          slug: undefined,
        }),
      ),
    ).rejects.toThrow("Photo generate requires --slug <workspace-id>.");
  });

  it("returns ok when no photos are found", async () => {
    mockedGeneratePhotoDrafts.mockResolvedValue([]);

    const result = await runGeneratePhotoCommand(createArgs());

    expect(mockedGeneratePhotoDrafts).toHaveBeenCalledWith(
      "drafts",
      "mallorca-birds",
      expect.any(String),
      expect.any(String),
    );

    expect(result).toEqual({
      ok: true,
    });
  });

  it("logs generated photo drafts", async () => {
    mockedGeneratePhotoDrafts.mockResolvedValue([
      {
        id: "great-egret",
        sourceFileName: "great-egret.jpg",
      },
      {
        id: "marsh-harrier",
        sourceFileName: "marsh-harrier.jpg",
      },
    ] as any);

    const result = await runGeneratePhotoCommand(createArgs());

    expect(mockedGeneratePhotoDrafts).toHaveBeenCalledWith(
      "drafts",
      "mallorca-birds",
      expect.any(String),
      expect.any(String),
    );

    expect(result).toEqual({
      ok: true,
    });
  });
});
