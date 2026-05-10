// packages/content-cli/src/cli/interactive/command.interactive.cli.ts

import { runDirectCli } from "@content-cli/cli/direct.run.cli";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type {
  ContentCliEntity,
  ParsedDirectCliArgs,
  JournalCliAction,
  PhotoCliAction,
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
  : {
      env: ContentCliEnvironment;
      entity: "photo";
      action: PhotoCliAction;
      bucket?: ContentWorkspaceBucket;
      photoId?: string;
    };

// --- helpers as arrow functions ---
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
): ParsedDirectCliArgs =>
  action === "homepageStripRebuild"
    ? { mode: "direct", env, entity, action: "homepageStripRebuild" }
    : (() => {
        const { bucket = "drafts", photoId } = args;
        return { mode: "direct", env, entity, action, bucket, photoId };
      })();

// --- main function ---
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
      : buildPhotoArgs(
          args as RunInteractiveContentCommandArgs<"photo">,
          env,
          entity,
          action as PhotoCliAction,
        );

  return runDirectCli(directArgs);
};
