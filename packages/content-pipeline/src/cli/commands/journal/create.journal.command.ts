// packages/content-pipeline/src/cli/commands/journal/create.journal.command.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";

import { resolveDraftWorkspaceById } from "@content-pipeline/drafts/helpers/resolve.draft.workspace.by.id.helper";
import { resolveLatestDraftWorkspace } from "@content-pipeline/drafts/helpers/resolve.latest.draft.workspace.helper";
import { createPhotoDraftFiles } from "@content-pipeline/media/helpers/create.photo.draft.files.helper";
import { getDraftImageFiles } from "@content-pipeline/media/helpers/get.draft.image.files.helper";
import { renderJournalDraftFile } from "@content-pipeline/journal/helpers/render.journal.draft.file";

const JOURNAL_DRAFT_FILE_NAME = "journal.draft.ts";

const resolveJournalWorkspace = async (options: ContentCommandOptions) => {
  if (options.draftId) {
    return resolveDraftWorkspaceById("journal", options.draftId);
  }

  return resolveLatestDraftWorkspace("journal");
};

export const runCreateJournalCommand = async (
  options: ContentCommandOptions,
): Promise<void> => {
  const workspace = await resolveJournalWorkspace(options);

  const imageFiles = await getDraftImageFiles(workspace);

  const createdPhotoDraftFiles =
    imageFiles.length > 0
      ? await createPhotoDraftFiles(workspace.draftPath, imageFiles)
      : [];

  const photoIds = createdPhotoDraftFiles.map(
    (createdPhotoDraftFile) => createdPhotoDraftFile.entry.id,
  );

  const journalDraftFileContent = renderJournalDraftFile(photoIds);
  const outputFilePath = path.join(
    workspace.draftPath,
    JOURNAL_DRAFT_FILE_NAME,
  );

  await fs.writeFile(outputFilePath, journalDraftFileContent, "utf8");

  console.log("\nJournal draft file created");
  console.log(`→ ${outputFilePath}`);
  console.log(`- draft: ${workspace.draftId}`);
  console.log(`- images found: ${imageFiles.length}`);
  console.log(`- photo drafts created: ${createdPhotoDraftFiles.length}`);
  console.log(`- photo ids seeded: ${photoIds.length}`);
  console.log("\nNext steps:");
  console.log("1. Open the draft folder");
  console.log(`   code ${workspace.draftPath}`);
  console.log("2. Fill in the journal draft and refine the body/modules");
  console.log("3. Keep or remove unused photoIds during authoring");
  console.log("4. Run the upload command when ready\n");
};
