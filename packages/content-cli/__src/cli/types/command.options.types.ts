// packages/content-pipeline/src/cli/types/command.options.types.ts

import type { ContentPipelineEnvironment } from "@content-pipeline/config/types/content.pipeline.environment.types";

export type ContentCommandOptions = {
  env: ContentPipelineEnvironment;
  draftId?: string;
};
