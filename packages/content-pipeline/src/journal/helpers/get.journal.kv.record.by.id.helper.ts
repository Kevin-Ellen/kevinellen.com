// packages/content-pipeline/src/journal/helpers/get.journal.kv.record.by.id.helper.ts

import { loadContentPipelineConfig } from "@content-pipeline/config/load.content.pipeline.env";

import type { ContentPipelineEnvironment } from "@content-pipeline/config/types/content.pipeline.environment.types";

const getJournalKvKey = (id: string): string => {
  return `journal:${id}`;
};

export const getJournalKvRecordById = async (
  env: ContentPipelineEnvironment,
  id: string,
) => {
  const config = loadContentPipelineConfig(env);
  const kvKey = getJournalKvKey(id);

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.cloudflareAccountId}/storage/kv/namespaces/${config.cloudflareKvJournalsNamespaceId}/values/${kvKey}`,
    {
      headers: {
        Authorization: `Bearer ${config.cloudflareKvApiToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch journal KV record: ${kvKey}`);
  }

  return response.json();
};
