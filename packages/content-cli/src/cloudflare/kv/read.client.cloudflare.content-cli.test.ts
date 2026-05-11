// packages/content-cli/src/cloudflare/kv/read.client.cloudflare.content-cli.test.ts

import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";

describe("readCloudflareKvValue", () => {
  const mockConfig = {
    cloudflareAccountId: "fake-account",
    cloudflareKvApiToken: "fake-token",
    cloudflareImagesApiToken: "fake-images-token",
    cloudflareKvPhotosNamespaceId: "fake-photos-ns",
    cloudflareKvJournalsNamespaceId: "fake-journals-ns",
    cloudflareKvNotesNamespaceId: "fake-notes-ns",
  } as const;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns JSON value when response is ok", async () => {
    const mockData = { foo: "bar" };

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as any);

    const value = await readCloudflareKvValue<typeof mockData>(
      mockConfig,
      mockConfig.cloudflareKvPhotosNamespaceId,
      "test-key",
    );

    expect(value).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("throws if response.ok is false", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    } as any);

    await expect(
      readCloudflareKvValue(
        mockConfig,
        mockConfig.cloudflareKvPhotosNamespaceId,
        "test-key",
      ),
    ).rejects.toThrow('Cloudflare KV read failed for "test-key"');
  });
});
