// packages/content-cli/src/cloudflare/kv/read.client.cloudflare.content-cli.ts

import type { ContentCliConfig } from "@content-cli/config/load.content-cli.config";

export const readCloudflareKvValue = async <T>(
  config: ContentCliConfig,
  namespaceId: string,
  key: string,
): Promise<T> => {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.cloudflareAccountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.cloudflareKvApiToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Cloudflare KV read failed for "${key}"`);
  }

  return (await response.json()) as T;
};
