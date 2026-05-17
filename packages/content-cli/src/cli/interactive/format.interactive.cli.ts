// packages/content-cli/src/cli/interactive/format.interactive.cli.ts

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

export const formatEnvironment = (env: ContentCliEnvironment): string => {
  if (env === "prod") {
    return "🚨 PROD";
  }

  return env.toUpperCase();
};
