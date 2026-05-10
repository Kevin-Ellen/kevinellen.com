// packages/content-cli/src/content/notes/create.note.content.ts

import fs from "node:fs/promises";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { ParsedNoteDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

import { getNoteWorkspacePath } from "@content-cli/content/notes/path.note.content";
import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

type NoteCreateCommandResult = Readonly<
  ContentCommandResult & {
    ok: true;
    entity: "note";
    action: "create";
    workspaceId: string;
    workspacePath: string;
  }
>;

const createWorkspaceId = (): string =>
  formatLocalDateTimeWithOffset(new Date()).replace(/:/g, "-");

export const runCreateNoteCommand = async (
  args: ParsedNoteDirectCliArgs,
): Promise<NoteCreateCommandResult> => {
  const workspaceId = args.slug ?? createWorkspaceId();

  const workspacePath = getNoteWorkspacePath(args.env, "drafts", workspaceId);

  await fs.mkdir(workspacePath, { recursive: true });

  console.log("\nNote draft workspace created\n");
  console.log(`Environment: ${args.env}`);
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Path: ${workspacePath}`);

  return {
    ok: true,
    entity: "note",
    action: "create",
    workspaceId,
    workspacePath,
  };
};
