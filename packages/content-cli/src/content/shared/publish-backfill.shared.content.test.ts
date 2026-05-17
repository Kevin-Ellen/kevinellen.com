// packages/content-cli/src/content/shared/publish-backfill.shared.content.test.ts

import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

import { publishContentWithBackfill } from "@content-cli/content/shared/publish-backfill.shared.content";

jest.mock(
  "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli",
  () => ({
    writeCloudflareKvValue: jest.fn(),
  }),
);

jest.mock("@content-cli/config/load.content-cli.config", () => ({
  loadContentCliConfig: jest.fn(),
}));

type ContentCliConfig = ReturnType<typeof loadContentCliConfig>;

const mockWriteCloudflareKvValue = jest.mocked(writeCloudflareKvValue);
const mockLoadContentCliConfig = jest.mocked(loadContentCliConfig);

const createConfig = (
  overrides: Partial<ContentCliConfig> = {},
): ContentCliConfig => ({
  cloudflareAccountId: "account-id",
  cloudflareImagesApiToken: "images-token",
  cloudflareKvApiToken: "kv-token",
  cloudflareKvPhotosNamespaceId: "photos-namespace",
  cloudflareKvJournalsNamespaceId: "journals-namespace",
  cloudflareKvNotesNamespaceId: "notes-namespace",
  ...overrides,
});

describe("publishContentWithBackfill", () => {
  const primaryConfig = createConfig({
    cloudflareKvJournalsNamespaceId: "prod-journals",
    cloudflareKvNotesNamespaceId: "prod-notes",
  });

  const devConfig = createConfig({
    cloudflareKvJournalsNamespaceId: "dev-journals",
    cloudflareKvNotesNamespaceId: "dev-notes",
  });

  const stgConfig = createConfig({
    cloudflareKvJournalsNamespaceId: "stg-journals",
    cloudflareKvNotesNamespaceId: "stg-notes",
  });

  const value = {
    id: "journal:test",
    title: "Test Journal",
  };

  const getJournalNamespaceId = (config: ContentCliConfig): string =>
    config.cloudflareKvJournalsNamespaceId;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLoadContentCliConfig.mockImplementation((env) => {
      if (env === "dev") return devConfig;
      if (env === "stg") return stgConfig;
      return primaryConfig;
    });
  });

  it("writes only to the selected environment when publishing outside prod", async () => {
    await publishContentWithBackfill({
      env: "dev",
      primaryConfig: devConfig,
      getNamespaceId: getJournalNamespaceId,
      key: "page:journal:test",
      value,
    });

    expect(mockWriteCloudflareKvValue).toHaveBeenCalledTimes(1);
    expect(mockWriteCloudflareKvValue).toHaveBeenCalledWith(
      devConfig,
      "dev-journals",
      "page:journal:test",
      value,
    );

    expect(mockLoadContentCliConfig).not.toHaveBeenCalled();
  });

  it("writes to prod first, then backfills dev and stg by default", async () => {
    await publishContentWithBackfill({
      env: "prod",
      primaryConfig,
      getNamespaceId: getJournalNamespaceId,
      key: "page:journal:test",
      value,
    });

    expect(mockWriteCloudflareKvValue).toHaveBeenCalledTimes(3);

    expect(mockWriteCloudflareKvValue).toHaveBeenNthCalledWith(
      1,
      primaryConfig,
      "prod-journals",
      "page:journal:test",
      value,
    );

    expect(mockWriteCloudflareKvValue).toHaveBeenNthCalledWith(
      2,
      devConfig,
      "dev-journals",
      "page:journal:test",
      value,
    );

    expect(mockWriteCloudflareKvValue).toHaveBeenNthCalledWith(
      3,
      stgConfig,
      "stg-journals",
      "page:journal:test",
      value,
    );

    expect(mockLoadContentCliConfig).toHaveBeenCalledTimes(2);
    expect(mockLoadContentCliConfig).toHaveBeenNthCalledWith(1, "dev");
    expect(mockLoadContentCliConfig).toHaveBeenNthCalledWith(2, "stg");
  });

  it("uses explicit backfill environments when provided", async () => {
    await publishContentWithBackfill({
      env: "prod",
      primaryConfig,
      getNamespaceId: getJournalNamespaceId,
      key: "page:journal:test",
      value,
      backfillEnvironments: ["dev"],
    });

    expect(mockWriteCloudflareKvValue).toHaveBeenCalledTimes(2);

    expect(mockWriteCloudflareKvValue).toHaveBeenNthCalledWith(
      1,
      primaryConfig,
      "prod-journals",
      "page:journal:test",
      value,
    );

    expect(mockWriteCloudflareKvValue).toHaveBeenNthCalledWith(
      2,
      devConfig,
      "dev-journals",
      "page:journal:test",
      value,
    );

    expect(mockLoadContentCliConfig).toHaveBeenCalledTimes(1);
    expect(mockLoadContentCliConfig).toHaveBeenCalledWith("dev");
  });

  it("can resolve a different namespace from the same shared helper", async () => {
    await publishContentWithBackfill({
      env: "prod",
      primaryConfig,
      getNamespaceId: (config) => config.cloudflareKvNotesNamespaceId,
      key: "page:note:test",
      value,
      backfillEnvironments: ["stg"],
    });

    expect(mockWriteCloudflareKvValue).toHaveBeenCalledTimes(2);

    expect(mockWriteCloudflareKvValue).toHaveBeenNthCalledWith(
      1,
      primaryConfig,
      "prod-notes",
      "page:note:test",
      value,
    );

    expect(mockWriteCloudflareKvValue).toHaveBeenNthCalledWith(
      2,
      stgConfig,
      "stg-notes",
      "page:note:test",
      value,
    );
  });
});
