// packages/content-pipeline/src/cli/config/parse.args.cli.ts

import type { ContentPipelineEnvironment } from "@content-pipeline/config/types/content.pipeline.environment.types";
import type { ParsedCliArgs } from "@content-pipeline/cli/types/parsed.cli.args.types";
import type {
  ContentCliAction,
  ContentCliEntity,
} from "@content-pipeline/cli/types/cli.types";

const isEnvironment = (
  value: string | undefined,
): value is ContentPipelineEnvironment => {
  return value === "dev" || value === "stg" || value === "prod";
};

const getFlagValue = (args: string[], flagName: string): string | undefined => {
  const flagIndex = args.indexOf(flagName);

  if (flagIndex === -1) {
    return undefined;
  }

  return args[flagIndex + 1];
};

export const parseCliArgs = (args: string[]): ParsedCliArgs => {
  const envValue = getFlagValue(args, "--env");
  const draftId = getFlagValue(args, "--draft-id");

  const env: ContentPipelineEnvironment = isEnvironment(envValue)
    ? envValue
    : "prod";

  const positionalArgs = args.filter((arg, index) => {
    const previousArg = args[index - 1];

    if (arg === "--env" || arg === "--draft-id") {
      return false;
    }

    if (previousArg === "--env" || previousArg === "--draft-id") {
      return false;
    }

    return true;
  });

  if (positionalArgs.length === 0) {
    return {
      mode: "interactive",
      env,
    };
  }

  const [entity, action] = positionalArgs as [
    ContentCliEntity?,
    ContentCliAction?,
  ];

  return {
    mode: "direct",
    env,
    entity,
    action,
    draftId,
  };
};
