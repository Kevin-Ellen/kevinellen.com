// packages/content-pipeline/src/photos/clients/write.cloudflare.kv.ts

type WriteCloudflareKvInput = {
  accountId: string;
  apiToken: string;
  namespaceId: string;
  key: string;
  value: unknown;
};

type CloudflareKvWriteResponse = {
  success: boolean;
  errors?: Array<{
    code?: number;
    message?: string;
  }>;
  messages?: unknown[];
  result?: unknown;
};

const getCloudflareKvUrl = (
  accountId: string,
  namespaceId: string,
  key: string,
): string => {
  const encodedKey = encodeURIComponent(key);

  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodedKey}`;
};

export const writeCloudflareKv = async ({
  accountId,
  apiToken,
  namespaceId,
  key,
  value,
}: WriteCloudflareKvInput): Promise<void> => {
  const response = await fetch(
    getCloudflareKvUrl(accountId, namespaceId, key),
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

  try {
    const json = (await response.json()) as CloudflareKvWriteResponse;

    if (!json.success) {
      const message =
        json.errors
          ?.map((error) => error.message)
          .filter((value): value is string => typeof value === "string")
          .join("; ") || "Unknown Cloudflare KV API error";

      throw new Error(
        `Cloudflare KV write failed for key "${key}": ${message}`,
      );
    }
  } catch {
    // Some successful KV writes return no JSON or empty body
    return;
  }
};
