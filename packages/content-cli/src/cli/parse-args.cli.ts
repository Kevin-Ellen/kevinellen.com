// packages/content-cli/src/cli/parse-args.cli.ts

import type {
  ParsedCliArgs,
  ParsedJournalDirectCliArgs,
  ParsedPhotoDirectCliArgs,
  ParsedPhotoHomepageStripRebuildArgs,
} from "@content-cli/types/parse-args.cli.types";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

/** Type guards */
const isWorkspaceBucket = (value?: string): value is ContentWorkspaceBucket =>
  value === "drafts" || value === "edits" || value === "uploaded";

const isEnvironment = (value?: string): value is ContentCliEnvironment =>
  value === "dev" || value === "stg" || value === "prod";

const isEntity = (value?: string): value is "journal" | "photo" =>
  value === "journal" || value === "photo";

/** Action maps for validation */
const entityActionsMap = {
  journal: [
    "create",
    "generate",
    "validate",
    "publish",
    "read",
    "list",
    "status",
    "promote",
  ] as const,
  photo: [
    "create",
    "generate",
    "validate",
    "publish",
    "read",
    "list",
    "status",
    "homepageStripRebuild",
  ] as const,
};

/** Returns true if action is valid for entity */
const isAction = (entity: "journal" | "photo", action: string) =>
  entityActionsMap[entity].includes(action as any);

/** CLI flag utilities */
const getFlagValue = (args: readonly string[], flagName: string) =>
  args[args.indexOf(flagName) + 1];

const removeKnownFlags = (args: readonly string[]) => {
  const known = ["--env", "--slug", "--photo-id", "--bucket", "--from", "--to"];
  return args.filter(
    (arg, index) => !known.includes(arg) && !known.includes(args[index - 1]),
  );
};

/** Main parser */
export const parseCliArgs = (args: readonly string[]): ParsedCliArgs => {
  // store raw flags first
  const envFlag = getFlagValue(args, "--env");
  const bucketFlag = getFlagValue(args, "--bucket");
  const fromFlag = getFlagValue(args, "--from");
  const toFlag = getFlagValue(args, "--to");

  // properly typed variables
  const env: ContentCliEnvironment = isEnvironment(envFlag) ? envFlag : "prod";
  const bucket: ContentWorkspaceBucket = isWorkspaceBucket(bucketFlag)
    ? bucketFlag
    : "drafts";
  const from: ContentCliEnvironment | undefined = isEnvironment(fromFlag)
    ? fromFlag
    : undefined;
  const to: ContentCliEnvironment | undefined = isEnvironment(toFlag)
    ? toFlag
    : undefined;

  const positional = removeKnownFlags(args);

  // interactive mode
  if (positional.length === 0) return { mode: "interactive", env };

  const [rawEntity, rawAction] = positional;

  if (!isEntity(rawEntity) || !isAction(rawEntity, rawAction)) {
    throw new Error(
      `Invalid CLI command: entity="${rawEntity}" action="${rawAction}"`,
    );
  }

  // Journal
  if (rawEntity === "journal") {
    const parsed: ParsedJournalDirectCliArgs = {
      mode: "direct",
      env,
      entity: "journal",
      action: rawAction as any,
      bucket,
      slug: getFlagValue(args, "--slug"),
      from,
      to,
    };
    return parsed;
  }

  // Photo: homepageStripRebuild
  if (rawEntity === "photo" && rawAction === "homepageStripRebuild") {
    const parsed: ParsedPhotoHomepageStripRebuildArgs = {
      mode: "direct",
      env,
      entity: "photo",
      action: "homepageStripRebuild",
    };
    return parsed;
  }

  // Photo: normal actions
  const parsed: ParsedPhotoDirectCliArgs = {
    mode: "direct",
    env,
    entity: "photo",
    action: rawAction as any,
    bucket,
    photoId: getFlagValue(args, "--photo-id"),
  };
  return parsed;
};
