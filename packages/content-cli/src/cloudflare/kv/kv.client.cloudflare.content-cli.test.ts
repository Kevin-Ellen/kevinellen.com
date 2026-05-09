// packages/content-cli/src/cloudflare/kv/kv.client.cloudflare.content-cli.test.ts

import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";

describe("writeCloudflareKvValue", () => {
  const mockConfig = {
    cloudflareAccountId: "fake-account",
    cloudflareKvApiToken: "fake-token",
    cloudflareImagesApiToken: "fake-images-token",
    cloudflareKvPhotosNamespaceId: "fake-photos-ns",
    cloudflareKvJournalsNamespaceId: "fake-journals-ns",
  } as const;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("writes a value successfully", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, errors: [], messages: [] }),
    } as any);

    const key = "test-key";
    const value = { foo: "bar" };

    await writeCloudflareKvValue(
      mockConfig,
      mockConfig.cloudflareKvPhotosNamespaceId,
      key,
      value,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.cloudflare.com/client/v4/accounts/${mockConfig.cloudflareAccountId}/storage/kv/namespaces/${mockConfig.cloudflareKvPhotosNamespaceId}/values/${encodeURIComponent(
        key,
      )}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${mockConfig.cloudflareKvApiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value, null, 2),
      },
    );
  });

  it("throws if response.ok is false", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, errors: ["bad"], messages: [] }),
    } as any);

    await expect(
      writeCloudflareKvValue(
        mockConfig,
        mockConfig.cloudflareKvPhotosNamespaceId,
        "key",
        { foo: "bar" },
      ),
    ).rejects.toThrow('Cloudflare KV write failed for "key": ["bad"]');
  });

  it("throws if response.ok is true but data.success is false", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, errors: ["oops"], messages: [] }),
    } as any);

    await expect(
      writeCloudflareKvValue(
        mockConfig,
        mockConfig.cloudflareKvPhotosNamespaceId,
        "key",
        { foo: "bar" },
      ),
    ).rejects.toThrow('Cloudflare KV write failed for "key": ["oops"]');
  });
});
