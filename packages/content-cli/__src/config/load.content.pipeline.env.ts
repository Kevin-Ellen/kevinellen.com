// packages/content-pipeline/src/config/load.content.pipeline.config.ts

import type { ContentPipelineEnvironment } from "@content-pipeline/config/types/content.pipeline.environment.types";
import type { ContentPipelineConfig } from "@content-pipeline/config/types/content.pipeline.config.types";

const getEnvironmentPrefix = (env: ContentPipelineEnvironment): string => {
  return `CONTENT_PIPELINE_${env.toUpperCase()}`;
};

const getRequiredKeys = (
  env: ContentPipelineEnvironment,
): Record<keyof ContentPipelineConfig, string> => {
  const prefix = getEnvironmentPrefix(env);

  return {
    cloudflareAccountId: `${prefix}_CF_ACCOUNT_ID`,
    cloudflareImagesApiToken: `${prefix}_CF_IMAGES_API_TOKEN`,
    cloudflareKvApiToken: `${prefix}_CF_KV_API_TOKEN`,
    cloudflareKvPhotosNamespaceId: `${prefix}_CF_KV_PHOTOS_NAMESPACE_ID`,
    cloudflareKvJournalsNamespaceId: `${prefix}_CF_KV_JOURNALS_NAMESPACE_ID`,
  };
};

export const loadContentPipelineConfig = (
  env: ContentPipelineEnvironment,
): ContentPipelineConfig => {
  const keys = getRequiredKeys(env);

  const missingKeys = Object.values(keys).filter((key) => {
    const value = process.env[key];
    return !value || value.trim().length === 0;
  });

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required environment variables for ${env}: ${missingKeys.join(", ")}`,
    );
  }

  return {
    cloudflareAccountId: process.env[keys.cloudflareAccountId]!,
    cloudflareImagesApiToken: process.env[keys.cloudflareImagesApiToken]!,
    cloudflareKvApiToken: process.env[keys.cloudflareKvApiToken]!,
    cloudflareKvPhotosNamespaceId:
      process.env[keys.cloudflareKvPhotosNamespaceId]!,
    cloudflareKvJournalsNamespaceId:
      process.env[keys.cloudflareKvJournalsNamespaceId]!,
  };
};
