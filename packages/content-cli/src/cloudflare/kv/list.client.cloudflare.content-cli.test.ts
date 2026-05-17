// packages/content-cli/src/cloudflare/kv/list.client.cloudflare.content-cli.test.ts

import { listCloudflareKvKeys } from "@content-cli/cloudflare/kv/list.client.cloudflare.content-cli";

describe("listCloudflareKvKeys", () => {
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

  it("returns keys from single-page response", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        errors: [],
        messages: [],
        result: [{ name: "key1" }, { name: "key2" }],
      }),
    } as any);

    const keys = await listCloudflareKvKeys(
      mockConfig,
      mockConfig.cloudflareKvPhotosNamespaceId,
      "prefix",
    );

    expect(keys).toEqual(["key1", "key2"]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("handles paginated response using cursor", async () => {
    const firstResponse = {
      success: true,
      errors: [],
      messages: [],
      result: [{ name: "key1" }],
      result_info: { cursor: "cursor123" },
    };
    const secondResponse = {
      success: true,
      errors: [],
      messages: [],
      result: [{ name: "key2" }],
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => firstResponse,
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => secondResponse,
      } as any);

    const keys = await listCloudflareKvKeys(
      mockConfig,
      mockConfig.cloudflareKvPhotosNamespaceId,
      "prefix",
    );

    expect(keys).toEqual(["key1", "key2"]);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("throws if response.ok is false", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, errors: ["bad"], messages: [] }),
    } as any);

    await expect(
      listCloudflareKvKeys(
        mockConfig,
        mockConfig.cloudflareKvPhotosNamespaceId,
        "prefix",
      ),
    ).rejects.toThrow('Cloudflare KV list failed for prefix "prefix": ["bad"]');
  });

  it("throws if data.success is false", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, errors: ["oops"], messages: [] }),
    } as any);

    await expect(
      listCloudflareKvKeys(
        mockConfig,
        mockConfig.cloudflareKvPhotosNamespaceId,
        "prefix",
      ),
    ).rejects.toThrow(
      'Cloudflare KV list failed for prefix "prefix": ["oops"]',
    );
  });
});
