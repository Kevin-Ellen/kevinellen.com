// packages/content-cli/src/content/journal/validate.journal.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import {
  getJournalFilePath,
  getJournalWorkspacePath,
} from "@content-cli/content/journal/path.journal.content";
import { importJournalDraft } from "@content-cli/content/journal/utils/import.draft.journal.util.content";

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";

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

const collectHeroPhotoIds = (page: unknown): string[] => {
  const ids: string[] = [];

  const visit = (value: unknown): void => {
    if (!value || typeof value !== "object") return;

    if (
      "kind" in value &&
      value.kind === "hero" &&
      "photoId" in value &&
      typeof value.photoId === "string"
    ) {
      ids.push(value.photoId);
    }

    for (const child of Object.values(value)) {
      if (Array.isArray(child)) {
        child.forEach(visit);
      } else {
        visit(child);
      }
    }
  };

  visit(page);

  return ids;
};

const photoMetadataExists = async (
  workspacePath: string,
  photoId: string,
): Promise<boolean> => {
  const candidates = [
    path.join(workspacePath, `${photoId}.draft.ts`),
    path.join(workspacePath, `${photoId}.uploaded.ts`),
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return true;
    } catch {
      // keep checking
    }
  }

  return false;
};

export const runValidateJournalCommand: ContentCommandHandler = async (
  args,
) => {
  const workspaceId = args.slug;

  if (!workspaceId) {
    throw new Error("Journal validate requires --slug <workspace-id>.");
  }

  const workspacePath = getJournalWorkspacePath(
    args.env,
    args.bucket,
    workspaceId,
  );

  const journalPath = getJournalFilePath(args.env, args.bucket, workspaceId);
  const page = await importJournalDraft(journalPath);

  console.log("\nValidate journal draft\n");
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Path: ${journalPath}\n`);

  const errors: string[] = [];

  if (containsRequiredPlaceholder(page)) {
    errors.push("required placeholders remain");
  }

  const heroPhotoIds = collectHeroPhotoIds(page);

  for (const photoId of heroPhotoIds) {
    if (!(await photoMetadataExists(workspacePath, photoId))) {
      errors.push(`missing photo metadata for hero photoId: ${photoId}`);
    }
  }

  const footer = page.content.footer ?? [];
  const journalFooter = footer.find(
    (module) => module.kind === "journalEntryFooter",
  );

  if (!journalFooter) {
    errors.push("missing journalEntryFooter");
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.log(`  ✗ ${error}`);
    }

    console.log();
    throw new Error(
      `Journal validation failed with ${errors.length} error(s).`,
    );
  }

  console.log("  ✓ journal draft valid\n");

  return { ok: true };
};
