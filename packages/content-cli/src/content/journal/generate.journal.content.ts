// packages/content-cli/src/content/journal/generate.journal.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import { createDraftJournalDefinition } from "@content-cli/content/journal/draft.create.journal.content";
import { getJournalWorkspacePath } from "@content-cli/content/journal/path.journal.content";
import { renderJournalDraftFile } from "@content-cli/content/journal/render.journal.content";
import { generatePhotoDrafts } from "@content-cli/content/shared/generate-drafts.photo.content";

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";

export const runGenerateJournalCommand: ContentCommandHandler = async (
  args,
) => {
  const workspaceId = args.slug;

  if (!workspaceId) {
    throw new Error("Journal generate requires --slug <workspace-id>.");
  }

  const workspacePath = getJournalWorkspacePath(
    args.env,
    args.bucket,
    workspaceId,
  );

  const photosPath = path.join(workspacePath, "photos");

  await fs.mkdir(workspacePath, { recursive: true });

  const generatedPhotos = await generatePhotoDrafts(
    args.bucket,
    workspaceId,
    workspacePath,
    photosPath,
  );

  const firstPhotoId = generatedPhotos[0]?.id ?? null;

  const journal = createDraftJournalDefinition(workspaceId, firstPhotoId);
  const journalPath = path.join(workspacePath, "journal.draft.ts");

  await fs.writeFile(journalPath, renderJournalDraftFile(journal), "utf8");

  console.log("\nGenerated journal draft\n");
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Path: ${journalPath}`);

  for (const photo of generatedPhotos) {
    console.log(`  ✓ photo: ${photo.id}`);
  }

  console.log(`Hero photo: ${firstPhotoId ?? "none"}\n`);

  return { ok: true };
};
