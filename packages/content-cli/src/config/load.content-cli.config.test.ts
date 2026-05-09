// packages/content-cli/src/config/load.content-cli.config.test.ts

import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

describe("loadContentCliConfig", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("loads config correctly when all environment variables exist", () => {
    process.env.CONTENT_PIPELINE_DEV_CF_ACCOUNT_ID = "acct-123";
    process.env.CONTENT_PIPELINE_DEV_CF_IMAGES_API_TOKEN = "img-token";
    process.env.CONTENT_PIPELINE_DEV_CF_KV_API_TOKEN = "kv-token";
    process.env.CONTENT_PIPELINE_DEV_CF_KV_PHOTOS_NAMESPACE_ID = "ns-photos";
    process.env.CONTENT_PIPELINE_DEV_CF_KV_JOURNALS_NAMESPACE_ID =
      "ns-journals";

    const config = loadContentCliConfig("dev");

    expect(config).toEqual({
      cloudflareAccountId: "acct-123",
      cloudflareImagesApiToken: "img-token",
      cloudflareKvApiToken: "kv-token",
      cloudflareKvPhotosNamespaceId: "ns-photos",
      cloudflareKvJournalsNamespaceId: "ns-journals",
    });
  });

  it("throws error if any required environment variable is missing", () => {
    process.env.CONTENT_PIPELINE_STG_CF_ACCOUNT_ID = "acct-456";
    process.env.CONTENT_PIPELINE_STG_CF_IMAGES_API_TOKEN = "";
    process.env.CONTENT_PIPELINE_STG_CF_KV_API_TOKEN = "kv-token";
    process.env.CONTENT_PIPELINE_STG_CF_KV_PHOTOS_NAMESPACE_ID = "ns-photos";
    process.env.CONTENT_PIPELINE_STG_CF_KV_JOURNALS_NAMESPACE_ID =
      "ns-journals";

    expect(() => loadContentCliConfig("stg")).toThrow(
      /Missing required environment variables for stg: CONTENT_PIPELINE_STG_CF_IMAGES_API_TOKEN/,
    );
  });

  it("trims whitespace in environment variable values", () => {
    process.env.CONTENT_PIPELINE_PROD_CF_ACCOUNT_ID = "  acct-789  ";
    process.env.CONTENT_PIPELINE_PROD_CF_IMAGES_API_TOKEN = "  img-token  ";
    process.env.CONTENT_PIPELINE_PROD_CF_KV_API_TOKEN = "  kv-token  ";
    process.env.CONTENT_PIPELINE_PROD_CF_KV_PHOTOS_NAMESPACE_ID =
      "  ns-photos  ";
    process.env.CONTENT_PIPELINE_PROD_CF_KV_JOURNALS_NAMESPACE_ID =
      "  ns-journals  ";

    const config = loadContentCliConfig("prod");

    expect(config).toEqual({
      cloudflareAccountId: "  acct-789  ",
      cloudflareImagesApiToken: "  img-token  ",
      cloudflareKvApiToken: "  kv-token  ",
      cloudflareKvPhotosNamespaceId: "  ns-photos  ",
      cloudflareKvJournalsNamespaceId: "  ns-journals  ",
    });
  });
});
