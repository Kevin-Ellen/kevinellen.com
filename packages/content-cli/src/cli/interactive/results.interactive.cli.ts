// packages/content-cli/src/cli/interactive/results.interactive.cli.ts

import type {
  ContentCommandResult,
  JournalCreateCommandResult,
  NoteCreateCommandResult,
} from "@content-cli/commands/types/command.types";

/** Existing journal guard */
export const isJournalCreateCommandResult = (
  result: ContentCommandResult,
): result is JournalCreateCommandResult => {
  if (
    typeof result !== "object" ||
    result === null ||
    !("entity" in result) ||
    !("action" in result)
  ) {
    return false;
  }

  if (!result.ok) return false;
  if (result.entity !== "journal") return false;
  if (result.action !== "create") return false;

  const requiredStringKeys: Array<keyof JournalCreateCommandResult> = [
    "workspaceId",
    "workspacePath",
    "photosPath",
  ];

  return requiredStringKeys.every(
    (key) => key in result && typeof (result as any)[key] === "string",
  );
};

/** New note guard */
export const isNoteCreateCommandResult = (
  result: ContentCommandResult,
): result is NoteCreateCommandResult => {
  if (
    typeof result !== "object" ||
    result === null ||
    !("entity" in result) ||
    !("action" in result)
  ) {
    return false;
  }

  if (!result.ok) return false;
  if (result.entity !== "note") return false;
  if (result.action !== "create") return false;

  const requiredStringKeys: Array<keyof NoteCreateCommandResult> = [
    "workspaceId",
    "workspacePath",
  ];

  return requiredStringKeys.every(
    (key) => key in result && typeof (result as any)[key] === "string",
  );
};
