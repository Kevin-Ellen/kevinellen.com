// packages/content-cli/src/content/notes/generate.note.content.test.ts

import fs from "node:fs/promises";

import { runGenerateNoteCommand } from "@content-cli/content/notes/generate.note.content";
import { createDraftNoteDefinition } from "@content-cli/content/notes/draft.create.note.content";
import {
  getNoteFilePath,
  getNoteWorkspacePath,
} from "@content-cli/content/notes/path.note.content";
import { renderNoteDraftFile } from "@content-cli/content/notes/render.note.content";

jest.mock("node:fs/promises", () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
}));

jest.mock("@content-cli/content/notes/draft.create.note.content", () => ({
  createDraftNoteDefinition: jest.fn(),
}));

jest.mock("@content-cli/content/notes/path.note.content", () => ({
  getNoteFilePath: jest.fn(),
  getNoteWorkspacePath: jest.fn(),
}));

jest.mock("@content-cli/content/notes/render.note.content", () => ({
  renderNoteDraftFile: jest.fn(),
}));

describe("runGenerateNoteCommand", () => {
  const draftNote = {
    id: "note:__REQUIRED__",
    kind: "note",
    slug: "/notes/my-note",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(getNoteWorkspacePath).mockReturnValue("/workspace/note");
    jest
      .mocked(getNoteFilePath)
      .mockReturnValue("/workspace/note/note.draft.ts");
    jest.mocked(createDraftNoteDefinition).mockReturnValue(draftNote as never);
    jest.mocked(renderNoteDraftFile).mockReturnValue("rendered note file");
  });

  it("generates a note draft file", async () => {
    const result = await runGenerateNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "generate",
      bucket: "drafts",
      slug: "my-note",
    });

    expect(getNoteWorkspacePath).toHaveBeenCalledWith(
      "dev",
      "drafts",
      "my-note",
    );

    expect(fs.mkdir).toHaveBeenCalledWith("/workspace/note", {
      recursive: true,
    });

    expect(createDraftNoteDefinition).toHaveBeenCalledWith("my-note");

    expect(getNoteFilePath).toHaveBeenCalledWith("dev", "drafts", "my-note");

    expect(renderNoteDraftFile).toHaveBeenCalledWith(draftNote);

    expect(fs.writeFile).toHaveBeenCalledWith(
      "/workspace/note/note.draft.ts",
      "rendered note file",
      "utf8",
    );

    expect(result).toEqual({
      ok: true,
      entity: "note",
      action: "generate",
      workspaceId: "my-note",
      workspacePath: "/workspace/note",
      notePath: "/workspace/note/note.draft.ts",
    });
  });

  it("throws when slug is missing", async () => {
    await expect(
      runGenerateNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "generate",
        bucket: "drafts",
      }),
    ).rejects.toThrow("Note generate requires --slug <workspace-id>.");

    expect(fs.mkdir).not.toHaveBeenCalled();
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
});
