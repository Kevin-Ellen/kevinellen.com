// packages/content-pipeline/src/config/load.content.pipeline.env.ts

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

export const loadContentPipelineEnv = (): ContentPipelineEnv => {
  return {
    cloudflareAccountId: getEnvOrThrow("CONTENT_PIPELINE_CF_ACCOUNT_ID"),
    cloudflareImagesApiToken: getEnvOrThrow(
      "CONTENT_PIPELINE_CF_IMAGES_API_TOKEN",
    ),
    cloudflareKvApiToken: getEnvOrThrow("CONTENT_PIPELINE_CF_KV_API_TOKEN"),
    cloudflareKvPhotosNamespaceId: getEnvOrThrow(
      "CONTENT_PIPELINE_CF_KV_PHOTOS_NAMESPACE_ID",
    ),
  };
};
