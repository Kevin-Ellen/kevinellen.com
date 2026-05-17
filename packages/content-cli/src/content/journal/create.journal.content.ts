// packages/content-cli/src/content/journal/create.journal.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

import { getJournalWorkspacePath } from "@content-cli/content/journal/path.journal.content";
import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

type JournalCreateCommandResult = Readonly<
  ContentCommandResult & {
    ok: true;
    entity: "journal";
    action: "create";
    workspaceId: string;
    workspacePath: string;
    photosPath: string;
  }
>;

const createWorkspaceId = (): string =>
  formatLocalDateTimeWithOffset(new Date()).replace(/:/g, "-");

export const runCreateJournalCommand = async (
  args: ParsedJournalDirectCliArgs,
): Promise<JournalCreateCommandResult> => {
  const workspaceId = args.slug ?? createWorkspaceId();

  const workspacePath = getJournalWorkspacePath(
    args.env,
    "drafts",
    workspaceId,
  );

  await fs.mkdir(workspacePath, { recursive: true });

  const photosPath = path.join(workspacePath, "photos");

  await fs.mkdir(photosPath, { recursive: true });

  console.log("\nJournal draft workspace created\n");
  console.log(`Environment: ${args.env}`);
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Path: ${workspacePath}\n`);
  console.log(`Photos: ${photosPath}`);

  return {
    ok: true,
    entity: "journal",
    action: "create",
    workspaceId,
    workspacePath,
    photosPath,
  };
};
