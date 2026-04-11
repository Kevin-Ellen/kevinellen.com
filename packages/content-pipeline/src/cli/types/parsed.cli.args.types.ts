// packages/content-pipeline/src/cli/types/parsed.cli.args.types.ts

import type { ContentPipelineEnvironment } from "@content-pipeline/config/types/content.pipeline.environment.types";
import type {
  ContentCliAction,
  ContentCliEntity,
} from "@content-pipeline/cli/types/cli.types";

export type ParsedInteractiveCliArgs = {
  mode: "interactive";
  env: ContentPipelineEnvironment;
};

export type ParsedDirectCliArgs = {
  mode: "direct";
  env: ContentPipelineEnvironment;
  entity?: ContentCliEntity;
  action?: ContentCliAction;
  draftId?: string;
};

export type ParsedCliArgs = ParsedInteractiveCliArgs | ParsedDirectCliArgs;
