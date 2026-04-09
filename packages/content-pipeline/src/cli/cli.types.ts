// packages/content-pipeline/src/cli/cli.types.ts

import type { ContentPipelineEnvironment } from "@content-pipeline/cli/config/environment.cli.types";

export type ContentCliMode = "interactive" | "direct";

export type ContentCliEntity = "photo";

export type ContentCliAction = "start" | "create" | "upload" | "status";

export type ContentCliParsedArgs = {
  environment: ContentPipelineEnvironment;
  mode: ContentCliMode;
  entity?: ContentCliEntity;
  action?: ContentCliAction;
};
