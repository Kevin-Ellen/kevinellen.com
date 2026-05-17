// packages/content-cli/src/cloudflare/kv/kv.client.cloudflare.content-cli.ts

import type { ContentCliConfig } from "@content-cli/config/load.content-cli.config";

type CloudflareKvWriteResponse = Readonly<{
  success: boolean;
  errors: readonly unknown[];
  messages: readonly unknown[];
}>;

export const writeCloudflareKvValue = async (
  config: ContentCliConfig,
  namespaceId: string,
  key: string,
  value: unknown,
): Promise<void> => {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.cloudflareAccountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.cloudflareKvApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value, null, 2),
    },
  );

  const data = (await response.json()) as CloudflareKvWriteResponse;

  if (!response.ok || !data.success) {
    throw new Error(
      `Cloudflare KV write failed for "${key}": ${JSON.stringify(data.errors)}`,
    );
  }
};
