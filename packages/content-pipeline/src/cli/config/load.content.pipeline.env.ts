// packages/content-pipeline/src/cli/config/load.content.pipeline.env.ts

import type { ContentPipelineEnvironment } from "@content-pipeline/cli/config/environment.cli.types";

type ContentPipelineEnv = {
  cloudflareAccountId: string;
  cloudflareImagesApiToken: string;
  cloudflareKvApiToken: string;
  cloudflareKvPhotosNamespaceId: string;
};

const getEnvOrThrow = (key: string): string => {
  const value = process.env[key];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const getEnvironmentPrefix = (
  environment: ContentPipelineEnvironment,
): string => {
  switch (environment) {
    case "dev":
      return "CONTENT_PIPELINE_DEV";
    case "stg":
      return "CONTENT_PIPELINE_STG";
    case "prod":
      return "CONTENT_PIPELINE_PROD";
  }
};

export const loadContentPipelineEnv = (
  environment: ContentPipelineEnvironment,
): ContentPipelineEnv => {
  const prefix = getEnvironmentPrefix(environment);

  return {
    cloudflareAccountId: getEnvOrThrow(`${prefix}_CF_ACCOUNT_ID`),
    cloudflareImagesApiToken: getEnvOrThrow(`${prefix}_CF_IMAGES_API_TOKEN`),
    cloudflareKvApiToken: getEnvOrThrow(`${prefix}_CF_KV_API_TOKEN`),
    cloudflareKvPhotosNamespaceId: getEnvOrThrow(
      `${prefix}_CF_KV_PHOTOS_NAMESPACE_ID`,
    ),
  };
};
