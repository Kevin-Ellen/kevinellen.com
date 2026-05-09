// packages/content-cli/src/cli/interactive/results.interactive.cli.ts

import type {
  ContentCommandResult,
  JournalCreateCommandResult,
} from "@content-cli/commands/types/command.types";

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

  // Ensure required string keys exist
  const requiredStringKeys: Array<keyof JournalCreateCommandResult> = [
    "workspaceId",
    "workspacePath",
    "photosPath",
  ];

  return requiredStringKeys.every(
    (key) => key in result && typeof (result as any)[key] === "string",
  );
};
