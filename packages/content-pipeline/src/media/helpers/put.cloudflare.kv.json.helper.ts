// packages/content-pipeline/src/media/helpers/put.cloudflare.kv.json.helper.ts

export type PutCloudflareKvJsonInput = {
  accountId: string;
  apiToken: string;
  namespaceId: string;
  key: string;
  value: unknown;
};

const CLOUDFLARE_KV_VALUE_URL = (
  accountId: string,
  namespaceId: string,
  key: string,
): string =>
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(
    key,
  )}`;

export const putCloudflareKvJson = async ({
  accountId,
  apiToken,
  namespaceId,
  key,
  value,
}: PutCloudflareKvJsonInput): Promise<void> => {
  const response = await fetch(
    CLOUDFLARE_KV_VALUE_URL(accountId, namespaceId, key),
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    },
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Cloudflare KV write failed for key "${key}" with status ${response.status}: ${responseText}`,
    );
  }
};
