// packages/content-pipeline/src/cli/config/parse.cli.args.ts

import type { ContentCliParsedArgs } from "@content-pipeline/cli/cli.types";

import { resolveCliEnvironment } from "@content-pipeline/cli/config/resolve.environment.cli";

const isEntity = (value: string | undefined): value is "photo" => {
  return value === "photo";
};

const isAction = (
  value: string | undefined,
): value is "start" | "create" | "upload" | "status" => {
  return (
    value === "start" ||
    value === "create" ||
    value === "upload" ||
    value === "status"
  );
};

export const parseCliArgs = (args: string[]): ContentCliParsedArgs => {
  const environment = resolveCliEnvironment(args);

  const positionalArgs = args.filter((arg, index) => {
    if (arg === "--env") {
      return false;
    }

    if (index > 0 && args[index - 1] === "--env") {
      return false;
    }

    return !arg.startsWith("--");
  });

  const entity = positionalArgs[0];
  const action = positionalArgs[1];

  if (!entity && !action) {
    return {
      environment,
      mode: "interactive",
    };
  }

  if (!isEntity(entity)) {
    throw new Error(`Invalid entity "${entity}". Expected one of: "photo".`);
  }

  if (!isAction(action)) {
    throw new Error(
      `Invalid action "${action}". Expected one of: "start", "create", "upload", or "status".`,
    );
  }

  return {
    environment,
    mode: "direct",
    entity,
    action,
  };
};
