// packages/content-cli/src/cli/interactive/command.interactive.cli.ts

import { runDirectCli } from "@content-cli/cli/direct.run.cli";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type {
  ContentCliAction,
  ContentCliEntity,
  ParsedDirectCliArgs,
} from "@content-cli/types/parse-args.cli.types";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

type RunInteractiveContentCommandArgs = {
  env: ContentCliEnvironment;
  entity: ContentCliEntity;
  action: ContentCliAction;
  bucket?: ContentWorkspaceBucket;
  slug?: string;
  photoId?: string;
  from?: ContentCliEnvironment;
  to?: ContentCliEnvironment;
};

export const runInteractiveContentCommand = async ({
  env,
  entity,
  action,
  bucket = "drafts",
  slug,
  photoId,
  from,
  to,
}: RunInteractiveContentCommandArgs): Promise<ContentCommandResult> => {
  const directArgs: ParsedDirectCliArgs = {
    mode: "direct",
    env,
    entity,
    action,
    bucket,
    slug,
    photoId,
    from,
    to,
  };

  return runDirectCli(directArgs);
};
