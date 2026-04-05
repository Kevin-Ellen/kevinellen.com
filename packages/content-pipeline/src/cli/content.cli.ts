// packages/content-pipeline/src/cli/content.cli.ts

import dotenv from "dotenv";

import type { ContentPipelineEnvironment } from "@content-pipeline/config/content.pipeline.environment.types";

import { runCreatePhotoCommand } from "./commands/photo/create.photo.command";
import { runStartPhotoCommand } from "./commands/photo/start.photo.command";
import { runUploadPhotoCommand } from "./commands/photo/upload.photo.command";

const getEnvironmentFromArgs = (args: string[]): ContentPipelineEnvironment => {
  const envFlagIndex = args.indexOf("--env");

  if (envFlagIndex === -1) {
    return "prod";
  }

  const requestedEnvironment = args[envFlagIndex + 1];

  if (
    requestedEnvironment !== "dev" &&
    requestedEnvironment !== "stg" &&
    requestedEnvironment !== "prod"
  ) {
    throw new Error(
      `Invalid environment "${requestedEnvironment}". Expected one of: dev, stg, prod`,
    );
  }

  return requestedEnvironment;
};

const getEnvFilePath = (environment: ContentPipelineEnvironment): string => {
  if (environment === "dev") {
    return "content-pipeline/.env.dev";
  }

  if (environment === "stg") {
    return "content-pipeline/.env.stg";
  }

  return "content-pipeline/.env";
};

const main = async (): Promise<void> => {
  const args = process.argv.slice(2);
  const [domain, action] = args;

  const environment = getEnvironmentFromArgs(args);
  const envFilePath = getEnvFilePath(environment);

  dotenv.config({
    path: envFilePath,
  });

  if (domain === "photo" && action === "create") {
    await runCreatePhotoCommand();
    return;
  }

  if (domain === "photo" && action === "start") {
    await runStartPhotoCommand();
    return;
  }

  if (domain === "photo" && action === "upload") {
    await runUploadPhotoCommand(environment);
    return;
  }

  throw new Error(`Unknown command: ${args.join(" ")}`);
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown CLI error";

  console.error(`\n${message}\n`);
  process.exit(1);
});
