// packages/content-cli/src/content/shared/publish-backfill.shared.content.ts

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

type ContentCliConfig = ReturnType<typeof loadContentCliConfig>;

type PublishBackfillEnvironment = Exclude<ContentCliEnvironment, "prod">;

type PublishWithBackfillOptions<TValue> = Readonly<{
  env: ContentCliEnvironment;
  primaryConfig: ContentCliConfig;
  getNamespaceId: (config: ContentCliConfig) => string;
  key: string;
  value: TValue;
  backfillEnvironments?: readonly PublishBackfillEnvironment[];
}>;

const DEFAULT_PROD_BACKFILL_ENVIRONMENTS = ["dev", "stg"] as const;

const resolveBackfillEnvironments = (
  primaryEnv: ContentCliEnvironment,
  backfillEnvironments?: readonly PublishBackfillEnvironment[],
): readonly PublishBackfillEnvironment[] => {
  if (primaryEnv !== "prod") return [];

  return backfillEnvironments ?? DEFAULT_PROD_BACKFILL_ENVIRONMENTS;
};

export const publishContentWithBackfill = async <TValue>({
  env,
  primaryConfig,
  getNamespaceId,
  key,
  value,
  backfillEnvironments,
}: PublishWithBackfillOptions<TValue>): Promise<void> => {
  const primaryNamespaceId = getNamespaceId(primaryConfig);

  console.log(`Writing ${key} to ${env.toUpperCase()} KV...`);

  await writeCloudflareKvValue(primaryConfig, primaryNamespaceId, key, value);

  const resolvedBackfillEnvironments = resolveBackfillEnvironments(
    env,
    backfillEnvironments,
  );

  if (resolvedBackfillEnvironments.length === 0) return;

  console.log(
    `Backfilling ${key} to ${resolvedBackfillEnvironments
      .map((targetEnv) => targetEnv.toUpperCase())
      .join(", ")} KV...`,
  );

  for (const targetEnv of resolvedBackfillEnvironments) {
    const targetConfig = loadContentCliConfig(targetEnv);
    const targetNamespaceId = getNamespaceId(targetConfig);

    await writeCloudflareKvValue(targetConfig, targetNamespaceId, key, value);
  }
};
