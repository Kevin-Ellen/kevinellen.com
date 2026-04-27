// packages/content-cli/src/commands/registry/registry.command.ts

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";
import type {
  ContentCliAction,
  ContentCliEntity,
} from "@content-cli/types/parse-args.cli.types";

import { runStatusJournalCommand } from "@content-cli/content/journal/status.journal.content";
import { runListJournalCommand } from "@content-cli/content/journal/list.journal.content";
import { runValidateJournalCommand } from "@content-cli/content/journal/validate.journal.content";
import { runCreateJournalCommand } from "@content-cli/content/journal/create.journal.content";
import { runGenerateJournalCommand } from "@content-cli/content/journal/generate.journal.content";
import { runPublishJournalCommand } from "@content-cli/content/journal/publish.journal.content";
import { runReadJournalCommand } from "@content-cli/content/journal/read.journal.content";
import { runPromoteJournalCommand } from "@content-cli/content/journal/promote.journal.content";

import { runStatusPhotoCommand } from "@content-cli/content/photo/status.photo.content";
import { runListPhotoCommand } from "@content-cli/content/photo/list.photo.content";
import { runCreatePhotoCommand } from "@content-cli/content/photo/create.photo.content";
import { runGeneratePhotoCommand } from "@content-cli/content/photo/generate.photo.content";
import { runValidatePhotoCommand } from "@content-cli/content/photo/validate.photo.content";
import { runPublishPhotoCommand } from "@content-cli/content/photo/publish.photo.content";
import { runReadPhotoCommand } from "@content-cli/content/photo/read.photo.content";

export const contentCommandRegistry: Record<
  ContentCliEntity,
  Partial<Record<ContentCliAction, ContentCommandHandler>>
> = {
  journal: {
    create: runCreateJournalCommand,
    generate: runGenerateJournalCommand,
    list: runListJournalCommand,
    validate: runValidateJournalCommand,
    publish: runPublishJournalCommand,
    status: runStatusJournalCommand,
    read: runReadJournalCommand,
    promote: runPromoteJournalCommand,
  },
  photo: {
    create: runCreatePhotoCommand,
    generate: runGeneratePhotoCommand,
    list: runListPhotoCommand,
    validate: runValidatePhotoCommand,
    publish: runPublishPhotoCommand,
    status: runStatusPhotoCommand,
    read: runReadPhotoCommand,
  },
};
