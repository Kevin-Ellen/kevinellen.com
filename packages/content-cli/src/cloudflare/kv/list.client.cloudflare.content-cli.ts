// packages/content-cli/src/cloudflare/kv/list.client.cloudflare.content-cli.ts

import type { ContentCliConfig } from "@content-cli/config/load.content-cli.config";

type CloudflareKvListKey = Readonly<{
  name: string;
}>;

type CloudflareKvListResponse = Readonly<{
  success: boolean;
  errors: readonly unknown[];
  messages: readonly unknown[];
  result: readonly CloudflareKvListKey[];
  result_info?: Readonly<{
    cursor?: string;
  }>;
}>;

export const listCloudflareKvKeys = async (
  config: ContentCliConfig,
  namespaceId: string,
  prefix: string,
): Promise<readonly string[]> => {
  const keys: string[] = [];
  let cursor: string | undefined;

  do {
    const url = new URL(
      `https://api.cloudflare.com/client/v4/accounts/${config.cloudflareAccountId}/storage/kv/namespaces/${namespaceId}/keys`,
    );

    url.searchParams.set("prefix", prefix);

    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.cloudflareKvApiToken}`,
      },
    });

    const data = (await response.json()) as CloudflareKvListResponse;

    if (!response.ok || !data.success) {
      throw new Error(
        `Cloudflare KV list failed for prefix "${prefix}": ${JSON.stringify(data.errors)}`,
      );
    }

    keys.push(...data.result.map((key) => key.name));

    cursor = data.result_info?.cursor || undefined;
  } while (cursor);

  return keys;
};
