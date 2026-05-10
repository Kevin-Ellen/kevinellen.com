// packages/content-cli/src/cli/parse-args.cli.ts

import type {
  ParsedCliArgs,
  ParsedJournalDirectCliArgs,
  ParsedPhotoDirectCliArgs,
  ParsedPhotoHomepageStripRebuildArgs,
  ParsedNoteDirectCliArgs,
} from "@content-cli/types/parse-args.cli.types";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

const isWorkspaceBucket = (value?: string): value is ContentWorkspaceBucket =>
  value === "drafts" || value === "edits" || value === "uploaded";

const isEnvironment = (value?: string): value is ContentCliEnvironment =>
  value === "dev" || value === "stg" || value === "prod";

const isEntity = (value?: string): value is "journal" | "photo" | "note" =>
  value === "journal" || value === "photo" || value === "note";

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
  note: [
    "create",
    "generate",
    "validate",
    "publish",
    "read",
    "list",
    "status",
    "promote",
  ] as const,
};

const isAction = (entity: "journal" | "photo" | "note", action: string) =>
  entityActionsMap[entity].includes(action as any);

const getFlagValue = (args: readonly string[], flagName: string) =>
  args[args.indexOf(flagName) + 1];

const removeKnownFlags = (args: readonly string[]) => {
  const known = ["--env", "--slug", "--photo-id", "--bucket", "--from", "--to"];

  return args.filter(
    (arg, index) => !known.includes(arg) && !known.includes(args[index - 1]),
  );
};

export const parseCliArgs = (args: readonly string[]): ParsedCliArgs => {
  const envFlag = getFlagValue(args, "--env");
  const bucketFlag = getFlagValue(args, "--bucket");
  const fromFlag = getFlagValue(args, "--from");
  const toFlag = getFlagValue(args, "--to");

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

  if (positional.length === 0) {
    return { mode: "interactive", env };
  }

  const [rawEntity, rawAction] = positional;

  if (!isEntity(rawEntity) || !isAction(rawEntity, rawAction)) {
    throw new Error(
      `Invalid CLI command: entity="${rawEntity}" action="${rawAction}"`,
    );
  }

  if (rawEntity === "journal") {
    const parsed: ParsedJournalDirectCliArgs = {
      mode: "direct",
      env,
      entity: "journal",
      action: rawAction as ParsedJournalDirectCliArgs["action"],
      bucket,
      slug: getFlagValue(args, "--slug"),
      from,
      to,
    };

    return parsed;
  }

  if (rawEntity === "note") {
    const parsed: ParsedNoteDirectCliArgs = {
      mode: "direct",
      env,
      entity: "note",
      action: rawAction as ParsedNoteDirectCliArgs["action"],
      bucket,
      slug: getFlagValue(args, "--slug"),
      from,
      to,
    };

    return parsed;
  }

  if (rawAction === "homepageStripRebuild") {
    const parsed: ParsedPhotoHomepageStripRebuildArgs = {
      mode: "direct",
      env,
      entity: "photo",
      action: "homepageStripRebuild",
    };

    return parsed;
  }

  if (rawAction === "create") {
    return {
      mode: "direct",
      env,
      entity: "photo",
      action: "create",
      bucket,
    };
  }

  if (
    rawAction === "generate" ||
    rawAction === "validate" ||
    rawAction === "publish"
  ) {
    return {
      mode: "direct",
      env,
      entity: "photo",
      action: rawAction,
      bucket,
      slug: getFlagValue(args, "--slug"),
    };
  }

  if (rawAction === "read") {
    return {
      mode: "direct",
      env,
      entity: "photo",
      action: "read",
      bucket,
      photoId: getFlagValue(args, "--photo-id"),
    };
  }

  return {
    mode: "direct",
    env,
    entity: "photo",
    action: rawAction as "list" | "status",
    bucket,
  };
};
