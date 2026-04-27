// packages/content-cli/src/cli/parse-args.cli.ts

import type {
  ContentCliAction,
  ContentCliEntity,
  ParsedCliArgs,
} from "@content-cli/types/parse-args.cli.types";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

const isWorkspaceBucket = (
  value: string | undefined,
): value is ContentWorkspaceBucket =>
  value === "drafts" || value === "edits" || value === "uploaded";

const isEnvironment = (
  value: string | undefined,
): value is ContentCliEnvironment =>
  value === "dev" || value === "stg" || value === "prod";

const isEntity = (value: string | undefined): value is ContentCliEntity =>
  value === "journal" || value === "photo";

const isAction = (value: string | undefined): value is ContentCliAction =>
  [
    "create",
    "generate",
    "validate",
    "publish",
    "read",
    "list",
    "status",
    "promote",
  ].includes(value ?? "");

const getFlagValue = (
  args: readonly string[],
  flagName: string,
): string | undefined => {
  const index = args.indexOf(flagName);

  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
};

const removeKnownFlags = (args: readonly string[]): string[] =>
  args.filter((arg, index) => {
    const previousArg = args[index - 1];
    const knownFlags = [
      "--env",
      "--slug",
      "--photo-id",
      "--bucket",
      "--from",
      "--to",
    ];

    if (knownFlags.includes(arg)) {
      return false;
    }

    if (knownFlags.includes(previousArg)) {
      return false;
    }

    return true;
  });

export const parseCliArgs = (args: readonly string[]): ParsedCliArgs => {
  const envValue = getFlagValue(args, "--env");
  const bucketValue = getFlagValue(args, "--bucket");

  const env = isEnvironment(envValue) ? envValue : "prod";
  const bucket = isWorkspaceBucket(bucketValue) ? bucketValue : "drafts";

  const fromValue = getFlagValue(args, "--from");
  const toValue = getFlagValue(args, "--to");

  const from = isEnvironment(fromValue) ? fromValue : undefined;
  const to = isEnvironment(toValue) ? toValue : undefined;

  const positionalArgs = removeKnownFlags(args);

  if (positionalArgs.length === 0) {
    return {
      mode: "interactive",
      env,
    };
  }

  const [rawEntity, rawAction] = positionalArgs;

  if (!isEntity(rawEntity) || !isAction(rawAction)) {
    throw new Error("Invalid CLI command.");
  }

  return {
    mode: "direct",
    env,
    entity: rawEntity,
    action: rawAction,
    bucket,
    from,
    to,
    slug: getFlagValue(args, "--slug"),
    photoId: getFlagValue(args, "--photo-id"),
  };
};
