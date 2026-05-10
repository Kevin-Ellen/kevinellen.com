// packages/content-cli/src/content/journal/generate.journal.content.test.ts

import fs from "node:fs/promises";
import path from "node:path";

import { runGenerateJournalCommand } from "@content-cli/content/journal/generate.journal.content";
import { createDraftJournalDefinition } from "@content-cli/content/journal/draft.create.journal.content";
import { getJournalWorkspacePath } from "@content-cli/content/journal/path.journal.content";
import { renderJournalDraftFile } from "@content-cli/content/journal/render.journal.content";
import { generatePhotoDrafts } from "@content-cli/content/shared/generate-drafts.photo.content";

import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

jest.mock("node:fs/promises");
jest.mock("@content-cli/content/journal/draft.create.journal.content");
jest.mock("@content-cli/content/journal/path.journal.content");
jest.mock("@content-cli/content/journal/render.journal.content");
jest.mock("@content-cli/content/shared/generate-drafts.photo.content");

const mockFs = fs as jest.Mocked<typeof fs>;

const mockedCreateDraftJournalDefinition = jest.mocked(
  createDraftJournalDefinition,
);
const mockedGetJournalWorkspacePath = jest.mocked(getJournalWorkspacePath);
const mockedRenderJournalDraftFile = jest.mocked(renderJournalDraftFile);
const mockedGeneratePhotoDrafts = jest.mocked(generatePhotoDrafts);

const createArgs = (
  overrides: Partial<ParsedJournalDirectCliArgs> = {},
): ParsedJournalDirectCliArgs => ({
  mode: "direct",
  env: "dev",
  entity: "journal",
  action: "generate",
  bucket: "drafts",
  slug: "rye-house",
  ...overrides,
});

describe("runGenerateJournalCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetJournalWorkspacePath.mockReturnValue("/workspace/rye-house");
    mockedCreateDraftJournalDefinition.mockReturnValue({
      id: "journal:rye-house",
      kind: "journal",
      slug: "/journal/rye-house",
      label: "Rye House",
    } as any);
    mockedRenderJournalDraftFile.mockReturnValue("rendered journal draft");
    mockedGeneratePhotoDrafts.mockResolvedValue([]);
  });

  it("requires a workspace slug", async () => {
    await expect(
      runGenerateJournalCommand(createArgs({ slug: undefined })),
    ).rejects.toThrow("Journal generate requires --slug <workspace-id>.");

    expect(mockedGetJournalWorkspacePath).not.toHaveBeenCalled();
    expect(mockedGeneratePhotoDrafts).not.toHaveBeenCalled();
    expect(mockFs.writeFile).not.toHaveBeenCalled();
  });

  it("generates a journal draft in the requested workspace", async () => {
    const result = await runGenerateJournalCommand(createArgs());

    expect(mockedGetJournalWorkspacePath).toHaveBeenCalledWith(
      "dev",
      "drafts",
      "rye-house",
    );

    expect(mockFs.mkdir).toHaveBeenCalledWith("/workspace/rye-house", {
      recursive: true,
    });

    expect(mockedGeneratePhotoDrafts).toHaveBeenCalledWith(
      "drafts",
      "rye-house",
      "/workspace/rye-house",
      path.join("/workspace/rye-house", "photos"),
    );

    expect(mockedCreateDraftJournalDefinition).toHaveBeenCalledWith(
      "rye-house",
      null,
    );

    expect(mockedRenderJournalDraftFile).toHaveBeenCalledWith({
      id: "journal:rye-house",
      kind: "journal",
      slug: "/journal/rye-house",
      label: "Rye House",
    });

    expect(mockFs.writeFile).toHaveBeenCalledWith(
      path.join("/workspace/rye-house", "journal.draft.ts"),
      "rendered journal draft",
      "utf8",
    );

    expect(result).toEqual({
      ok: true,
      entity: "journal",
      action: "generate",
      workspaceId: "rye-house",
      workspacePath: "/workspace/rye-house",
      journalPath: path.join("/workspace/rye-house", "journal.draft.ts"),
      photosPath: path.join("/workspace/rye-house", "photos"),
      heroPhotoId: null,
    });
  });

  it("uses the first generated photo as the hero photo", async () => {
    mockedGeneratePhotoDrafts.mockResolvedValue([
      { id: "photo-one" },
      { id: "photo-two" },
    ] as any);

    const result = await runGenerateJournalCommand(createArgs());

    expect(mockedCreateDraftJournalDefinition).toHaveBeenCalledWith(
      "rye-house",
      "photo-one",
    );

    expect(result.heroPhotoId).toBe("photo-one");
  });

  it("uses the selected environment and bucket when resolving the workspace", async () => {
    await runGenerateJournalCommand(
      createArgs({
        env: "prod",
        bucket: "uploaded",
        slug: "mallorca",
      }),
    );

    expect(mockedGetJournalWorkspacePath).toHaveBeenCalledWith(
      "prod",
      "uploaded",
      "mallorca",
    );
  });
});
