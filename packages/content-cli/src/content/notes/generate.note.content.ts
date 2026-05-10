// packages/content-cli/src/content/notes/generate.note.content.ts

import fs from "node:fs/promises";

import { createDraftNoteDefinition } from "@content-cli/content/notes/draft.create.note.content";
import {
  getNoteFilePath,
  getNoteWorkspacePath,
} from "@content-cli/content/notes/path.note.content";
import { renderNoteDraftFile } from "@content-cli/content/notes/render.note.content";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { ParsedNoteDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

type NoteGenerateCommandResult = Readonly<
  ContentCommandResult & {
    ok: true;
    entity: "note";
    action: "generate";
    workspaceId: string;
    workspacePath: string;
    notePath: string;
  }
>;

export const runGenerateNoteCommand = async (
  args: ParsedNoteDirectCliArgs,
): Promise<NoteGenerateCommandResult> => {
  const workspaceId = args.slug;

  if (!workspaceId) {
    throw new Error("Note generate requires --slug <workspace-id>.");
  }

  const workspacePath = getNoteWorkspacePath(
    args.env,
    args.bucket,
    workspaceId,
  );

  await fs.mkdir(workspacePath, { recursive: true });

  const note = createDraftNoteDefinition(workspaceId);

  const notePath = getNoteFilePath(args.env, args.bucket, workspaceId);

  await fs.writeFile(notePath, renderNoteDraftFile(note), "utf8");

  console.log("\nGenerated note draft\n");
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Path: ${notePath}`);

  return {
    ok: true,
    entity: "note",
    action: "generate",
    workspaceId,
    workspacePath,
    notePath,
  };
};
