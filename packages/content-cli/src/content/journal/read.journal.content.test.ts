// packages/content-cli/src/content/journal/read.journal.content.test.ts

import { runReadJournalCommand } from "@content-cli/content/journal/read.journal.content";
import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

jest.mock("@content-cli/cloudflare/kv/read.client.cloudflare.content-cli");
jest.mock("@content-cli/config/load.content-cli.config");

const mockedReadKv = jest.mocked(readCloudflareKvValue);
const mockedLoadConfig = jest.mocked(loadContentCliConfig);

const createArgs = (
  overrides: Partial<ParsedJournalDirectCliArgs> = {},
): ParsedJournalDirectCliArgs => ({
  mode: "direct",
  env: "dev",
  entity: "journal",
  action: "read",
  bucket: "drafts",
  slug: "rye-house",
  ...overrides,
});

describe("runReadJournalCommand", () => {
  const mockPage: AuthoredPublicPageDefinition = {
    id: "journal:rye-house",
    kind: "journal",
    slug: "/journal/rye-house",
    label: "Rye House",
    metadata: { pageTitle: "Rye House Journal", metaDescription: "Test" },
    breadcrumbs: ["home", "journal"],
    content: { head: { title: "Rye House Journal" }, content: [], footer: [] },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedLoadConfig.mockReturnValue({
      cloudflareKvJournalsNamespaceId: "kv",
    } as any);
    mockedReadKv.mockResolvedValue(mockPage);
  });

  it("requires a slug", async () => {
    await expect(
      runReadJournalCommand(createArgs({ slug: undefined })),
    ).rejects.toThrow("Journal read requires --slug <journal-id>.");
  });

  it("reads the journal from KV and returns ok", async () => {
    const result = await runReadJournalCommand(createArgs());

    expect(mockedLoadConfig).toHaveBeenCalledWith("dev");
    expect(mockedReadKv).toHaveBeenCalledWith(
      expect.anything(),
      "kv",
      "page:journal:rye-house",
    );

    expect(result).toEqual({ ok: true });
  });
});
