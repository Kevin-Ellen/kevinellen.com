// packages/content-pipeline/src/cli/command.options.types.ts

import type { ContentPipelineEnvironment } from "@content-pipeline/cli/config/environment.cli.types";

export type ContentCommandOptions = {
  environment: ContentPipelineEnvironment;
};
