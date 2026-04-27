// packages/content-pipeline/src/cli/commands/photo/status.photo.command.ts

import kleur from "kleur";

import type { ContentCommandResult } from "@content-pipeline/cli/types/command.definition.types";
import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";

import { getDraftKindStatus } from "@content-pipeline/drafts/helpers/get.workspace.status.helper";

export const runStatusPhotoCommand = async (
  _options: ContentCommandOptions,
): Promise<ContentCommandResult> => {
  const status = await getDraftKindStatus("photo");

  console.log("\n" + kleur.bold("Photo status") + "\n");

  console.log(kleur.yellow("📝 Draft"));
  if (status.latestDraft) {
    console.log(`  • ${kleur.bold(status.latestDraft.id)}`);
    console.log(
      `    ${kleur.dim(
        `images: ${status.latestDraft.imageCount} | drafts: ${status.latestDraft.draftFileCount}`,
      )}`,
    );
    console.log(`    ${kleur.dim(status.latestDraft.path)}`);
  } else {
    console.log(kleur.dim("  none"));
  }

  console.log("\n" + kleur.green("☁️  Uploaded"));
  if (status.latestUploaded) {
    console.log(
      `  ${kleur.green("✓")} ${kleur.bold(status.latestUploaded.id)}`,
    );
    console.log(
      `    ${kleur.dim(
        `images: ${status.latestUploaded.imageCount} | drafts: ${status.latestUploaded.draftFileCount}`,
      )}`,
    );
    console.log(`    ${kleur.dim(status.latestUploaded.path)}`);
  } else {
    console.log(kleur.dim("  none"));
  }

  console.log();

  return {};
};
