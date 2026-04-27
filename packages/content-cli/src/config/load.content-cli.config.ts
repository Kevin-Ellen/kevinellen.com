// packages/content-cli/src/config/load.content-cli.config.ts

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

export type ContentCliConfig = Readonly<{
  cloudflareAccountId: string;
  cloudflareImagesApiToken: string;
  cloudflareKvApiToken: string;
  cloudflareKvPhotosNamespaceId: string;
  cloudflareKvJournalsNamespaceId: string;
}>;

const getEnvironmentPrefix = (env: ContentCliEnvironment): string =>
  `CONTENT_PIPELINE_${env.toUpperCase()}`;

const getRequiredKeys = (
  env: ContentCliEnvironment,
): Record<keyof ContentCliConfig, string> => {
  const prefix = getEnvironmentPrefix(env);

  return {
    cloudflareAccountId: `${prefix}_CF_ACCOUNT_ID`,
    cloudflareImagesApiToken: `${prefix}_CF_IMAGES_API_TOKEN`,
    cloudflareKvApiToken: `${prefix}_CF_KV_API_TOKEN`,
    cloudflareKvPhotosNamespaceId: `${prefix}_CF_KV_PHOTOS_NAMESPACE_ID`,
    cloudflareKvJournalsNamespaceId: `${prefix}_CF_KV_JOURNALS_NAMESPACE_ID`,
  };
};

export const loadContentCliConfig = (
  env: ContentCliEnvironment,
): ContentCliConfig => {
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
