// packages/content-cli/src/cli/interactive/results.interactive.cli.ts

import type {
  ContentCommandResult,
  JournalCreateCommandResult,
} from "@content-cli/commands/types/command.types";

export const isJournalCreateCommandResult = (
  result: ContentCommandResult,
): result is JournalCreateCommandResult =>
  result.ok &&
  "entity" in result &&
  result.entity === "journal" &&
  "action" in result &&
  result.action === "create" &&
  "workspaceId" in result &&
  typeof result.workspaceId === "string" &&
  "workspacePath" in result &&
  typeof result.workspacePath === "string" &&
  "photosPath" in result &&
  typeof result.photosPath === "string";
