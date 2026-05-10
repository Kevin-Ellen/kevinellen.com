// packages/content-cli/src/content/photo/validate.photo.content.test.ts

import fs from "node:fs/promises";
import type { Dirent } from "node:fs";

import { runValidatePhotoCommand } from "@content-cli/content/photo/validate.photo.content";
import { importPhotoDraft } from "@content-cli/content/photo/utils/import.draft.photo.util.content";

import type { ParsedPhotoWorkspaceArgs } from "@content-cli/types/parse-args.cli.types";

jest.mock("node:fs/promises");
jest.mock("@content-cli/content/photo/utils/import.draft.photo.util.content");

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedImportPhotoDraft = jest.mocked(importPhotoDraft);

const createArgs = (
  overrides: Partial<ParsedPhotoWorkspaceArgs> = {},
): ParsedPhotoWorkspaceArgs => ({
  mode: "direct",
  env: "dev",
  entity: "photo",
  action: "validate",
  bucket: "drafts",
  slug: "birds",
  ...overrides,
});

const createDirent = (name: string, isFile = true) =>
  ({
    name,
    isFile: () => isFile,
  }) as Dirent;

describe("runValidatePhotoCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("requires a workspace slug", async () => {
    await expect(
      runValidatePhotoCommand(createArgs({ slug: undefined })),
    ).rejects.toThrow("Photo validate requires --slug <workspace-id>.");
  });

  it("fails when no draft files exist", async () => {
    mockedFs.readdir.mockResolvedValue([] as any);

    await expect(runValidatePhotoCommand(createArgs())).rejects.toThrow(
      "No photo draft files found.",
    );
  });

  it("passes valid draft files", async () => {
    mockedFs.readdir.mockResolvedValue([createDirent("robin.draft.ts")] as any);

    mockedImportPhotoDraft.mockResolvedValue({
      sourceFileName: "robin.jpg",
      title: "Robin",
      alt: "Robin perched",
      commentary: "Robin in woodland",
      readableLocation: "Epping Forest",
      width: 1000,
      height: 800,
    } as any);

    mockedFs.access.mockResolvedValue(undefined);

    const result = await runValidatePhotoCommand(createArgs());

    expect(result).toEqual({ ok: true });

    expect(console.log).toHaveBeenCalledWith("  ✓ robin.draft.ts");
  });

  it("fails drafts with placeholder values", async () => {
    mockedFs.readdir.mockResolvedValue([createDirent("robin.draft.ts")] as any);

    mockedImportPhotoDraft.mockResolvedValue({
      sourceFileName: "robin.jpg",
      title: "__REQUIRED__",
      alt: "",
      commentary: "Robin in woodland",
      readableLocation: "__REQUIRED__",
      width: 1000,
      height: 800,
    } as any);

    mockedFs.access.mockResolvedValue(undefined);

    await expect(runValidatePhotoCommand(createArgs())).rejects.toThrow(
      "Photo validation failed for 1 file(s).",
    );

    expect(console.log).toHaveBeenCalledWith(
      "    Missing/invalid: title, alt, readableLocation",
    );
  });

  it("fails when source image is missing", async () => {
    mockedFs.readdir.mockResolvedValue([createDirent("owl.draft.ts")] as any);

    mockedImportPhotoDraft.mockResolvedValue({
      sourceFileName: "owl.jpg",
      title: "Owl",
      alt: "Barn owl",
      commentary: "Owl in flight",
      readableLocation: "Norfolk",
      width: 1000,
      height: 800,
    } as any);

    mockedFs.access.mockRejectedValue(new Error("missing"));

    await expect(runValidatePhotoCommand(createArgs())).rejects.toThrow(
      "Photo validation failed for 1 file(s).",
    );

    expect(console.log).toHaveBeenCalledWith(
      "    Missing/invalid: sourceFileName image",
    );
  });

  it("fails invalid dimensions", async () => {
    mockedFs.readdir.mockResolvedValue([createDirent("fox.draft.ts")] as any);

    mockedImportPhotoDraft.mockResolvedValue({
      sourceFileName: "fox.jpg",
      title: "Fox",
      alt: "Fox portrait",
      commentary: "Fox in grass",
      readableLocation: "Essex",
      width: 0,
      height: -1,
    } as any);

    mockedFs.access.mockResolvedValue(undefined);

    await expect(runValidatePhotoCommand(createArgs())).rejects.toThrow(
      "Photo validation failed for 1 file(s).",
    );

    expect(console.log).toHaveBeenCalledWith(
      "    Missing/invalid: width/height",
    );
  });

  it("ignores non-draft files", async () => {
    mockedFs.readdir.mockResolvedValue([
      createDirent("robin.draft.ts"),
      createDirent("notes.txt"),
      createDirent("photos", false),
    ] as any);

    mockedImportPhotoDraft.mockResolvedValue({
      sourceFileName: "robin.jpg",
      title: "Robin",
      alt: "Robin perched",
      commentary: "Robin in woodland",
      readableLocation: "Epping Forest",
      width: 1000,
      height: 800,
    } as any);

    mockedFs.access.mockResolvedValue(undefined);

    const result = await runValidatePhotoCommand(createArgs());

    expect(result).toEqual({ ok: true });

    expect(mockedImportPhotoDraft).toHaveBeenCalledTimes(1);
  });
});
