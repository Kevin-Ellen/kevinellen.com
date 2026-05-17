// packages/content-cli/src/content/journal/promote.journal.content.test.ts

import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";
import { runPromoteJournalCommand } from "@content-cli/content/journal/promote.journal.content";

import type { ContentCliConfig } from "@content-cli/config/load.content-cli.config";
import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

jest.mock("@content-cli/cloudflare/kv/read.client.cloudflare.content-cli");
jest.mock("@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli");
jest.mock("@content-cli/config/load.content-cli.config");

const mockedReadCloudflareKvValue = jest.mocked(readCloudflareKvValue);
const mockedWriteCloudflareKvValue = jest.mocked(writeCloudflareKvValue);
const mockedLoadContentCliConfig = jest.mocked(loadContentCliConfig);

const devConfig = {
  cloudflareKvJournalsNamespaceId: "dev-journals",
} as ContentCliConfig;

const prodConfig = {
  cloudflareKvJournalsNamespaceId: "prod-journals",
} as ContentCliConfig;

const createArgs = (
  overrides: Partial<ParsedJournalDirectCliArgs> = {},
): ParsedJournalDirectCliArgs => ({
  mode: "direct",
  env: "dev",
  entity: "journal",
  action: "promote",
  bucket: "uploaded",
  slug: "rye-house",
  from: "dev",
  to: "prod",
  ...overrides,
});

describe("runPromoteJournalCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedLoadContentCliConfig.mockImplementation((env) => {
      if (env === "dev") return devConfig;
      if (env === "prod") return prodConfig;

      throw new Error(`Unexpected env: ${env}`);
    });
  });

  it("requires a journal ID", async () => {
    await expect(
      runPromoteJournalCommand(createArgs({ slug: undefined })),
    ).rejects.toThrow("Journal promote requires --slug <journal-id>.");

    expect(mockedLoadContentCliConfig).not.toHaveBeenCalled();
    expect(mockedReadCloudflareKvValue).not.toHaveBeenCalled();
    expect(mockedWriteCloudflareKvValue).not.toHaveBeenCalled();
  });

  it("requires from and to environments", async () => {
    await expect(
      runPromoteJournalCommand(createArgs({ from: undefined })),
    ).rejects.toThrow("Journal promote requires --from <env> and --to <env>.");

    await expect(
      runPromoteJournalCommand(createArgs({ to: undefined })),
    ).rejects.toThrow("Journal promote requires --from <env> and --to <env>.");

    expect(mockedLoadContentCliConfig).not.toHaveBeenCalled();
    expect(mockedReadCloudflareKvValue).not.toHaveBeenCalled();
    expect(mockedWriteCloudflareKvValue).not.toHaveBeenCalled();
  });

  it("requires different from and to environments", async () => {
    await expect(
      runPromoteJournalCommand(
        createArgs({
          from: "dev",
          to: "dev",
        }),
      ),
    ).rejects.toThrow(
      "Journal promote requires different --from and --to environments.",
    );

    expect(mockedLoadContentCliConfig).not.toHaveBeenCalled();
    expect(mockedReadCloudflareKvValue).not.toHaveBeenCalled();
    expect(mockedWriteCloudflareKvValue).not.toHaveBeenCalled();
  });

  it("promotes a journal page from one KV namespace to another", async () => {
    const journal = {
      id: "journal:rye-house",
      kind: "journal",
      slug: "/journal/rye-house",
      label: "Rye House",
      metadata: {
        pageTitle: "Rye House Journal",
        metaDescription: "Test journal",
      },
      breadcrumbs: ["home", "journal"],
      content: {
        head: {
          title: "Rye House Journal",
        },
        content: [],
        footer: [],
      },
    } as AuthoredPublicPageDefinition;

    mockedReadCloudflareKvValue.mockResolvedValue(journal);

    const result = await runPromoteJournalCommand(createArgs());

    expect(mockedLoadContentCliConfig).toHaveBeenNthCalledWith(1, "dev");
    expect(mockedLoadContentCliConfig).toHaveBeenNthCalledWith(2, "prod");

    expect(mockedReadCloudflareKvValue).toHaveBeenCalledWith(
      devConfig,
      "dev-journals",
      "page:rye-house",
    );

    expect(mockedWriteCloudflareKvValue).toHaveBeenCalledWith(
      prodConfig,
      "prod-journals",
      "page:rye-house",
      journal,
    );

    expect(result).toEqual({
      ok: true,
      entity: "journal",
      action: "promote",
      journalId: "rye-house",
      key: "page:rye-house",
      from: "dev",
      to: "prod",
    });
  });
});
