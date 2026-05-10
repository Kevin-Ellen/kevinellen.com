// packages/content-cli/src/content/notes/validate.note.content.ts

import {
  getNoteFilePath,
  getNoteWorkspacePath,
} from "@content-cli/content/notes/path.note.content";
import { importNoteDraft } from "@content-cli/content/notes/utils/import.draft.note.util.content";

import type { ParsedNoteDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";

const REQUIRED_PLACEHOLDER = "__REQUIRED__";

const containsRequiredPlaceholder = (value: unknown): boolean => {
  if (typeof value === "string") {
    return value === REQUIRED_PLACEHOLDER || value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.some(containsRequiredPlaceholder);
  }

  if (value && typeof value === "object") {
    return Object.values(value).some(containsRequiredPlaceholder);
  }

  return false;
};

export const runValidateNoteCommand = async (
  args: ParsedNoteDirectCliArgs,
): Promise<ContentCommandResult> => {
  const workspaceId = args.slug;

  if (!workspaceId) {
    throw new Error("Note validate requires --slug <workspace-id>.");
  }

  const workspacePath = getNoteWorkspacePath(
    args.env,
    args.bucket,
    workspaceId,
  );

  const notePath = getNoteFilePath(args.env, args.bucket, workspaceId);

  const page = await importNoteDraft(notePath);

  console.log("\nValidate note draft\n");
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Path: ${notePath}`);
  console.log(`Workspace path: ${workspacePath}\n`);

  const errors: string[] = [];

  if (containsRequiredPlaceholder(page)) {
    errors.push("required placeholders remain");
  }

  if (page.kind !== "note") {
    errors.push(`expected kind "note", received "${page.kind}"`);
  }

  if (!page.slug.startsWith("/notes/")) {
    errors.push(
      `expected note slug to start with /notes/, received "${page.slug}"`,
    );
  }

  const footer = page.content.footer ?? [];

  const publicationFooter = footer.find(
    (module) => module.kind === "journalEntryFooter",
  );

  if (!publicationFooter) {
    errors.push("missing publication footer");
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.log(`  ✗ ${error}`);
    }

    console.log();

    throw new Error(`Note validation failed: ${errors.join("; ")}`);
  }

  console.log("  ✓ note draft valid\n");

  return { ok: true };
};
