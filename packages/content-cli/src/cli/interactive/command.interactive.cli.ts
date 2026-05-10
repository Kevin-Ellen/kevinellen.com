// packages/content-cli/src/cli/interactive/command.interactive.cli.ts

import { runDirectCli } from "@content-cli/cli/direct.run.cli";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type {
  ContentCliEntity,
  ParsedDirectCliArgs,
  JournalCliAction,
  PhotoCliAction,
  NoteCliAction,
} from "@content-cli/types/parse-args.cli.types";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

export type RunInteractiveContentCommandArgs<
  E extends ContentCliEntity = ContentCliEntity,
> = E extends "journal"
  ? {
      env: ContentCliEnvironment;
      entity: "journal";
      action: JournalCliAction;
      bucket?: ContentWorkspaceBucket;
      slug?: string;
      from?: ContentCliEnvironment;
      to?: ContentCliEnvironment;
    }
  : E extends "photo"
    ? {
        env: ContentCliEnvironment;
        entity: "photo";
        action: PhotoCliAction;
        bucket?: ContentWorkspaceBucket;
        photoId?: string;
      }
    : {
        env: ContentCliEnvironment;
        entity: "note";
        action: NoteCliAction;
        bucket?: ContentWorkspaceBucket;
        slug?: string;
        from?: ContentCliEnvironment;
        to?: ContentCliEnvironment;
      };

// --- helpers ---
const buildJournalArgs = (
  args: RunInteractiveContentCommandArgs<"journal">,
  env: ContentCliEnvironment,
  entity: "journal",
  action: JournalCliAction,
): ParsedDirectCliArgs => {
  const { bucket = "drafts", slug, from, to } = args;
  return { mode: "direct", env, entity, action, bucket, slug, from, to };
};

const buildPhotoArgs = (
  args: RunInteractiveContentCommandArgs<"photo">,
  env: ContentCliEnvironment,
  entity: "photo",
  action: PhotoCliAction,
): ParsedDirectCliArgs => {
  const { bucket = "drafts", photoId } = args;

  if (action === "homepageStripRebuild") {
    return { mode: "direct", env, entity, action };
  }

  if (action === "create") {
    return { mode: "direct", env, entity, action, bucket };
  }

  if (action === "read") {
    if (!photoId) {
      throw new Error("Photo read requires photoId.");
    }

    return { mode: "direct", env, entity, action, bucket, photoId };
  }

  if (action === "list" || action === "status") {
    return { mode: "direct", env, entity, action, bucket };
  }

  const slug = photoId;

  if (!slug) {
    throw new Error(`Photo ${action} requires photoId.`);
  }

  return { mode: "direct", env, entity, action, bucket, slug };
};

const buildNoteArgs = (
  args: RunInteractiveContentCommandArgs<"note">,
  env: ContentCliEnvironment,
  entity: "note",
  action: NoteCliAction,
): ParsedDirectCliArgs => {
  const { bucket = "drafts", slug, from, to } = args;
  return { mode: "direct", env, entity, action, bucket, slug, from, to };
};

// --- main ---
export const runInteractiveContentCommand = async <E extends ContentCliEntity>(
  args: RunInteractiveContentCommandArgs<E>,
): Promise<ContentCommandResult> => {
  const { env, entity, action } = args;

  const directArgs: ParsedDirectCliArgs =
    entity === "journal"
      ? buildJournalArgs(
          args as RunInteractiveContentCommandArgs<"journal">,
          env,
          entity,
          action as JournalCliAction,
        )
      : entity === "photo"
        ? buildPhotoArgs(
            args as RunInteractiveContentCommandArgs<"photo">,
            env,
            entity,
            action as PhotoCliAction,
          )
        : buildNoteArgs(
            args as RunInteractiveContentCommandArgs<"note">,
            env,
            entity,
            action as NoteCliAction,
          );

  return runDirectCli(directArgs);
};
