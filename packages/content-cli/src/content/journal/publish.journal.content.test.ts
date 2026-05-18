// packages/content-cli/src/content/journal/publish.journal.content.test.ts

import fs from "node:fs/promises";

import { runPublishJournalCommand } from "@content-cli/content/journal/publish.journal.content";
import { publishPhotoDrafts } from "@content-cli/content/shared/publish-drafts.photo.content";
import { importJournalDraft } from "@content-cli/content/journal/utils/import.draft.journal.util.content";
import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";
import { runValidateJournalCommand } from "@content-cli/content/journal/validate.journal.content";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";
import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

jest.mock("@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli");
jest.mock("@content-cli/config/load.content-cli.config");
jest.mock(
  "@content-cli/content/journal/utils/import.draft.journal.util.content",
);
jest.mock("@content-cli/content/shared/publish-drafts.photo.content");
jest.mock("@content-cli/content/journal/validate.journal.content");
jest.mock("node:fs/promises");

const mockedWriteKv = jest.mocked(writeCloudflareKvValue);
const mockedLoadConfig = jest.mocked(loadContentCliConfig);
const mockedImportDraft = jest.mocked(importJournalDraft);
const mockedPublishPhotos = jest.mocked(publishPhotoDrafts);
const mockedValidate = jest.mocked(runValidateJournalCommand);
const mockedFs = fs as jest.Mocked<typeof fs>;

const createArgs = (
  overrides: Partial<ParsedJournalDirectCliArgs> = {},
): ParsedJournalDirectCliArgs => ({
  mode: "direct",
  env: "dev",
  entity: "journal",
  action: "publish",
  bucket: "drafts",
  slug: "rye-house",
  ...overrides,
});

const mockPage: AuthoredPublicPageDefinition = {
  id: "journal:rye-house",
  kind: "journal",
  slug: "/journal/rye-house",
  label: "Rye House",
  metadata: { pageTitle: "Rye House", metaDescription: "Test journal" },
  breadcrumbs: ["home", "journal"],
  content: {
    head: { title: "Rye House Journal" },
    content: [],
    footer: [
      {
        kind: "journalEntryFooter",
        publication: {
          author: "Kevin Ellen",
          publishedAt: "2026-05-10T12:00:00+01:00",
          updatedAt: ["2026-05-10T12:00:00+01:00"],
        },
        tags: [],
      },
    ],
  },
};

describe("runPublishJournalCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedLoadConfig.mockReturnValue({
      cloudflareKvJournalsNamespaceId: "kv",
    } as any);

    mockedImportDraft.mockResolvedValue(mockPage);
    mockedPublishPhotos.mockResolvedValue([]);
    mockedValidate.mockResolvedValue({ ok: true } as any);
  });

  it("throws if slug is missing", async () => {
    await expect(
      runPublishJournalCommand(createArgs({ slug: undefined })),
    ).rejects.toThrow("Journal publish requires --slug <workspace-id>.");
  });

  it("validates draft, publishes photos, writes KV, and moves workspace", async () => {
    const result = await runPublishJournalCommand(createArgs());

    expect(mockedValidate).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "rye-house" }),
    );

    expect(mockedPublishPhotos).toHaveBeenCalledWith(
      expect.anything(),
      "rye-house",
      expect.any(String),
      expect.any(String),
    );

    expect(mockedWriteKv).toHaveBeenCalledWith(
      expect.anything(),
      "kv",
      "page:journal:rye-house",
      expect.objectContaining({
        id: "journal:rye-house",
        slug: "/journal/rye-house",
      }),
    );

    expect(mockedFs.rm).toHaveBeenCalled();
    expect(mockedFs.mkdir).toHaveBeenCalled();
    expect(mockedFs.rename).toHaveBeenCalled();

    expect(result).toEqual({
      ok: true,
      workspaceId: "rye-house",
      journalId: "journal:rye-house",
      publishedPhotos: 0,
      workspacePath: expect.any(String),
      uploadedWorkspacePath: expect.any(String),
    });
  });

  it("normalises an unprefixed authored journal id before publishing", async () => {
    mockedImportDraft.mockResolvedValue({
      ...mockPage,
      id: "rye-house",
      breadcrumbs: ["home", "journal"],
    });

    await runPublishJournalCommand(createArgs());

    expect(mockedWriteKv).toHaveBeenCalledWith(
      expect.anything(),
      "kv",
      "page:journal:rye-house",
      expect.objectContaining({
        id: "journal:rye-house",
        breadcrumbs: ["home", "journal", "journal:rye-house"],
      }),
    );
  });

  it("rejects slug/workspace mismatch before publishing photos or writing KV", async () => {
    mockedImportDraft.mockResolvedValue({
      ...mockPage,
      slug: "/journal/a-different-slug",
    });

    await expect(runPublishJournalCommand(createArgs())).rejects.toThrow(
      [
        "Journal slug/workspace mismatch.",
        "",
        "Workspace: rye-house",
        "Expected slug: /journal/rye-house",
        "Actual slug: /journal/a-different-slug",
      ].join("\n"),
    );

    expect(mockedPublishPhotos).not.toHaveBeenCalled();
    expect(mockedWriteKv).not.toHaveBeenCalled();
    expect(mockedFs.rm).not.toHaveBeenCalled();
    expect(mockedFs.mkdir).not.toHaveBeenCalled();
    expect(mockedFs.rename).not.toHaveBeenCalled();
  });

  it("returns correct publishedPhotos count", async () => {
    mockedPublishPhotos.mockResolvedValue([
      { id: "photo1" },
      { id: "photo2" },
    ] as any);

    const result = await runPublishJournalCommand(createArgs());

    expect(result.publishedPhotos).toBe(2);
  });

  it("updates journalEntryFooter.updatedAt and leaves other footer modules untouched", async () => {
    const extraModule = {
      kind: "noteEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2026-05-10T12:00:00+01:00",
        updatedAt: ["2026-05-10T12:00:00+01:00"],
      },
      topic: "Architecture",
      tags: [],
    } as const;

    const draftWithMix: AuthoredPublicPageDefinition = {
      ...mockPage,
      content: {
        ...mockPage.content,
        footer: [...mockPage.content.footer!, extraModule],
      },
    };

    mockedImportDraft.mockResolvedValue(draftWithMix);

    const result = await runPublishJournalCommand(createArgs());

    expect(result.ok).toBe(true);

    const updatedPage = mockedWriteKv.mock
      .calls[0][3] as AuthoredPublicPageDefinition;

    const updatedFooter = updatedPage.content.footer!;

    const journalFooter = updatedFooter.find(
      (module) => module.kind === "journalEntryFooter",
    );

    expect(journalFooter).toBeDefined();
    expect(journalFooter!.publication.updatedAt.length).toBe(
      mockPage.content.footer![0].publication.updatedAt.length + 1,
    );

    const noteFooter = updatedFooter.find(
      (module) => module.kind === "noteEntryFooter",
    );

    expect(noteFooter).toBe(extraModule);
  });

  it("handles undefined footer by using empty array", async () => {
    const draftNoFooter: AuthoredPublicPageDefinition = {
      ...mockPage,
      content: {
        ...mockPage.content,
        footer: undefined,
      },
    };

    mockedImportDraft.mockResolvedValue(draftNoFooter);

    const result = await runPublishJournalCommand(createArgs());

    expect(result.ok).toBe(true);

    expect(mockedWriteKv).toHaveBeenCalledWith(
      expect.anything(),
      "kv",
      "page:journal:rye-house",
      expect.objectContaining({
        id: "journal:rye-house",
        slug: "/journal/rye-house",
        content: expect.objectContaining({
          footer: [],
        }),
      }),
    );
  });
});
