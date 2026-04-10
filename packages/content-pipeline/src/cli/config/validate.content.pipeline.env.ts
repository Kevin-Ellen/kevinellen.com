// packages/content-pipeline/src/cli/config/validate.content.pipeline.env.ts

import type { ContentPipelineEnvironment } from "@content-pipeline/cli/config/environment.cli.types";

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

const getMissingKeys = (keys: string[]): string[] => {
  return keys.filter((key) => {
    const value = process.env[key];

    return !value || value.trim().length === 0;
  });
};

export const validateContentPipelineEnv = (
  environment: ContentPipelineEnvironment,
): void => {
  const prefix = getEnvironmentPrefix(environment);

  const requiredKeys = [
    `${prefix}_CF_ACCOUNT_ID`,
    `${prefix}_CF_IMAGES_API_TOKEN`,
    `${prefix}_CF_KV_API_TOKEN`,
    `${prefix}_CF_KV_PHOTOS_NAMESPACE_ID`,
    `${prefix}_CF_KV_JOURNALS_NAMESPACE_ID`,
  ];

  const missingKeys = getMissingKeys(requiredKeys);

  if (missingKeys.length > 0) {
    throw new Error(
      [
        `Missing required environment variables for "${environment}":`,
        ...missingKeys.map((key) => `- ${key}`),
      ].join("\n"),
    );
  }
};
