// packages/content-pipeline/src/cli/types/command.definition.types.ts

import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";
import type { DraftWorkspace } from "@content-pipeline/drafts/types/draft.workspace.types";

export type ContentCommandResult = {
  workspace?: DraftWorkspace;
};

export type ContentCommandHandler = (
  options: ContentCommandOptions,
) => Promise<ContentCommandResult>;
