// packages/content-cli/src/content/journal/validate.journal.content.test.ts

import fs from "node:fs/promises";
import { runValidateJournalCommand } from "@content-cli/content/journal/validate.journal.content";
import { importJournalDraft } from "@content-cli/content/journal/utils/import.draft.journal.util.content";

import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

jest.mock("node:fs/promises");
jest.mock(
  "@content-cli/content/journal/utils/import.draft.journal.util.content",
);

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedImport = jest.mocked(importJournalDraft);

const createArgs = (
  overrides: Partial<ParsedJournalDirectCliArgs> = {},
): ParsedJournalDirectCliArgs => ({
  mode: "direct",
  env: "dev",
  entity: "journal",
  action: "validate",
  bucket: "drafts",
  slug: "rye-house",
  ...overrides, // ensure this comma is here
});

const baseJournal: AuthoredPublicPageDefinition = {
  id: "journal:rye-house",
  kind: "journal",
  slug: "/journal/rye-house",
  label: "Rye House",
  metadata: { pageTitle: "Rye House", metaDescription: "Test" },
  breadcrumbs: ["home", "journal"],
  content: {
    head: { title: "Rye House" },
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

describe("runValidateJournalCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("requires a slug", async () => {
    await expect(
      runValidateJournalCommand(createArgs({ slug: undefined })),
    ).rejects.toThrow("Journal validate requires --slug <workspace-id>.");
  });

  it("passes a valid journal", async () => {
    mockedImport.mockResolvedValue(baseJournal);
    mockedFs.access.mockResolvedValue();

    const result = await runValidateJournalCommand(createArgs());
    expect(result).toEqual({ ok: true });
  });

  it("fails if placeholders remain", async () => {
    const draftWithPlaceholder: AuthoredPublicPageDefinition = {
      ...baseJournal,
      label: "__REQUIRED__",
    };
    mockedImport.mockResolvedValue(draftWithPlaceholder);
    mockedFs.access.mockResolvedValue();

    await expect(runValidateJournalCommand(createArgs())).rejects.toThrow(
      /required placeholders remain/,
    );
  });

  it("fails if hero photo metadata is missing", async () => {
    const draftWithHero: AuthoredPublicPageDefinition = {
      ...baseJournal,
      content: {
        ...baseJournal.content,
        content: [
          {
            kind: "articleSection" as const,
            heading: { text: "Hero section", level: 2, visuallyHidden: false },
            modules: [{ kind: "hero" as const, photoId: "photo1" } as any],
          },
        ],
      },
    };
    mockedImport.mockResolvedValue(draftWithHero);
    mockedFs.access.mockRejectedValue(new Error("not found"));

    await expect(runValidateJournalCommand(createArgs())).rejects.toThrow(
      /missing photo metadata for hero photoId: photo1/,
    );
  });

  it("fails if journalEntryFooter is missing", async () => {
    const draftNoFooter: AuthoredPublicPageDefinition = {
      ...baseJournal,
      content: { ...baseJournal.content, footer: [] },
    };
    mockedImport.mockResolvedValue(draftNoFooter);
    mockedFs.access.mockResolvedValue();

    await expect(runValidateJournalCommand(createArgs())).rejects.toThrow(
      /missing journalEntryFooter/,
    );
  });

  it("detects multiple errors simultaneously", async () => {
    const draftBad: AuthoredPublicPageDefinition = {
      ...baseJournal,
      label: "__REQUIRED__",
      content: {
        ...baseJournal.content,
        content: [
          {
            kind: "articleSection" as const,
            heading: { text: "Hero section", level: 2, visuallyHidden: false },
            modules: [{ kind: "hero" as const, photoId: "photo2" } as any],
          },
        ],
        footer: [],
      },
    };
    mockedImport.mockResolvedValue(draftBad);
    mockedFs.access.mockRejectedValue(new Error("not found"));

    await expect(runValidateJournalCommand(createArgs())).rejects.toThrow(
      /required placeholders remain; missing photo metadata for hero photoId: photo2; missing journalEntryFooter/,
    );
  });

  it("photoMetadataExists returns false when no file exists", async () => {
    const draftWithHero: AuthoredPublicPageDefinition = {
      ...baseJournal,
      content: {
        ...baseJournal.content,
        content: [
          {
            kind: "articleSection" as const,
            heading: { text: "Hero section", level: 2, visuallyHidden: false },
            modules: [
              { kind: "hero" as const, photoId: "photo-missing" } as any,
            ],
          },
        ],
        footer: undefined, // cover the `?? []` branch
      },
    };

    mockedImport.mockResolvedValue(draftWithHero);
    mockedFs.access.mockRejectedValue(new Error("not found"));

    await expect(runValidateJournalCommand(createArgs())).rejects.toThrow(
      /missing photo metadata for hero photoId: photo-missing/,
    );
  });

  it("photoMetadataExists hits both candidates before returning true", async () => {
    const draftWithHero: AuthoredPublicPageDefinition = {
      ...baseJournal,
      content: {
        ...baseJournal.content,
        content: [
          {
            kind: "articleSection" as const,
            heading: { text: "Hero section", level: 2, visuallyHidden: false },
            modules: [{ kind: "hero" as const, photoId: "photo-mixed" } as any],
          },
        ],
        // include a valid footer to pass the journalEntryFooter check
        footer: baseJournal.content.footer,
      },
    };

    mockedImport.mockResolvedValue(draftWithHero);

    let callCount = 0;
    mockedFs.access.mockImplementation(async () => {
      callCount++;
      if (callCount === 1) throw new Error("first fails");
      return; // second candidate succeeds
    });

    const result = await runValidateJournalCommand(createArgs());
    expect(result).toEqual({ ok: true });
    expect(mockedFs.access).toHaveBeenCalledTimes(2);
  });
});
