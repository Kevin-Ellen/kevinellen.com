// packages/content-pipeline/src/cli/config/resolve.environment.cli.ts

import type { ContentPipelineEnvironment } from "@content-pipeline/cli/config/environment.cli.types";

export const resolveCliEnvironment = (
  args: string[],
): ContentPipelineEnvironment => {
  const envFlagIndex = args.indexOf("--env");

  if (envFlagIndex === -1) {
    return "prod";
  }

  const requestedEnvironment = args[envFlagIndex + 1];

  if (
    requestedEnvironment === "dev" ||
    requestedEnvironment === "stg" ||
    requestedEnvironment === "prod"
  ) {
    return requestedEnvironment;
  }

  throw new Error(
    `Invalid environment "${requestedEnvironment}". Expected "dev", "stg", or "prod".`,
  );
};
