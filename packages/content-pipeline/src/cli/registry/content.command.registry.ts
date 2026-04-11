// packages/content-pipeline/src/cli/registry/content.command.registry.ts

import type { ContentCommandHandler } from "@content-pipeline/cli/types/command.definition.types";
import type {
  ContentCliAction,
  ContentCliEntity,
} from "@content-pipeline/cli/types/cli.types";

import { runCreatePhotoCommand } from "@content-pipeline/cli/commands/photo/create.photo.command";
import { runStartPhotoCommand } from "@content-pipeline/cli/commands/photo/start.photo.command";
import { runUploadPhotoCommand } from "@content-pipeline/cli/commands/photo/upload.photo.command";
import { runStatusPhotoCommand } from "@content-pipeline/cli/commands/photo/status.photo.command";

import { runCreateJournalCommand } from "@content-pipeline/cli/commands/journal/create.journal.command";
import { runStartJournalCommand } from "@content-pipeline/cli/commands/journal/start.journal.command";
import { runUploadJournalCommand } from "@content-pipeline/cli/commands/journal/upload.journal.command";
import { runStatusJournalCommand } from "@content-pipeline/cli/commands/journal/status.journal.command";

export const contentCommandRegistry: Partial<
  Record<
    ContentCliEntity,
    Partial<Record<ContentCliAction, ContentCommandHandler>>
  >
> = {
  photo: {
    start: runStartPhotoCommand,
    create: runCreatePhotoCommand,
    upload: runUploadPhotoCommand,
    status: runStatusPhotoCommand,
  },

  journal: {
    start: runStartJournalCommand,
    create: runCreateJournalCommand,
    upload: runUploadJournalCommand,
    status: runStatusJournalCommand,
  },
};
