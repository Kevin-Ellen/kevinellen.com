// packages/content-cli/src/content/notes/publish.note.content.test.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";
import type { ParsedNoteDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

import { runPublishNoteCommand } from "@content-cli/content/notes/publish.note.content";
import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";
import {
  getNoteFilePath,
  getNoteWorkspacePath,
} from "@content-cli/content/notes/path.note.content";
import { importNoteDraft } from "@content-cli/content/notes/utils/import.draft.note.util.content";
import { runValidateNoteCommand } from "@content-cli/content/notes/validate.note.content";
import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

jest.mock("node:fs/promises", () => ({
  mkdir: jest.fn(),
  rename: jest.fn(),
  rm: jest.fn(),
}));

jest.mock(
  "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli",
  () => ({
    writeCloudflareKvValue: jest.fn(),
  }),
);

jest.mock("@content-cli/config/load.content-cli.config", () => ({
  loadContentCliConfig: jest.fn(),
}));

jest.mock("@content-cli/content/notes/path.note.content", () => ({
  getNoteFilePath: jest.fn(),
  getNoteWorkspacePath: jest.fn(),
}));

jest.mock(
  "@content-cli/content/notes/utils/import.draft.note.util.content",
  () => ({
    importNoteDraft: jest.fn(),
  }),
);

jest.mock("@content-cli/content/notes/validate.note.content", () => ({
  runValidateNoteCommand: jest.fn(),
}));

jest.mock("@content-cli/utils/format.local.date.time.with.offset.util", () => ({
  formatLocalDateTimeWithOffset: jest.fn(),
}));

const config = {
  cloudflareKvNotesNamespaceId: "notes-dev",
};

const createArgs = (
  overrides: Partial<ParsedNoteDirectCliArgs> = {},
): ParsedNoteDirectCliArgs => ({
  mode: "direct",
  env: "dev",
  entity: "note",
  action: "publish",
  bucket: "drafts",
  slug: "my-note",
  ...overrides,
});

const validPage: AuthoredPublicPageDefinition = {
  id: "note:my-note",
  kind: "note",
  slug: "/notes/my-note",
  label: "My Note",
  metadata: {
    pageTitle: "My Note",
    metaDescription: "Description.",
  },
  breadcrumbs: ["home"],
  content: {
    head: {
      eyebrow: "Note",
      title: "My Note",
      intro: "Intro.",
    },
    content: [],
    footer: [
      {
        kind: "noteEntryFooter",
        publication: {
          author: "Kevin Ellen",
          publishedAt: "2026-05-10T22:00:00+01:00",
          updatedAt: ["2026-05-10T22:00:00+01:00"],
        },
        topic: "Architecture",
        tags: [],
      },
    ],
  },
};

describe("runPublishNoteCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(loadContentCliConfig).mockReturnValue(config as never);

    jest
      .mocked(getNoteWorkspacePath)
      .mockReturnValueOnce("/workspace/note/drafts/dev/my-note")
      .mockReturnValueOnce("/workspace/note/uploaded/dev/my-note");

    jest
      .mocked(getNoteFilePath)
      .mockReturnValue("/workspace/note/drafts/dev/my-note/note.draft.ts");

    jest.mocked(importNoteDraft).mockResolvedValue(validPage);
    jest.mocked(runValidateNoteCommand).mockResolvedValue({ ok: true });
    jest
      .mocked(formatLocalDateTimeWithOffset)
      .mockReturnValue("2026-05-10T23:00:00+01:00");
  });

  it("publishes a valid note to KV and moves the workspace", async () => {
    const args = createArgs();

    const result = await runPublishNoteCommand(args);

    expect(runValidateNoteCommand).toHaveBeenCalledWith(args);

    expect(writeCloudflareKvValue).toHaveBeenCalledWith(
      config,
      "notes-dev",
      "page:note:my-note",
      {
        ...validPage,
        id: "note:my-note",
        kind: "note",
        slug: "/notes/my-note",
        breadcrumbs: ["home", "notes", "note:my-note"],
        content: {
          ...validPage.content,
          footer: [
            {
              kind: "noteEntryFooter",
              publication: {
                author: "Kevin Ellen",
                publishedAt: "2026-05-10T22:00:00+01:00",
                updatedAt: [
                  "2026-05-10T22:00:00+01:00",
                  "2026-05-10T23:00:00+01:00",
                ],
              },
              topic: "Architecture",
              tags: [],
            },
          ],
        },
      },
    );

    expect(fs.rm).toHaveBeenCalledWith("/workspace/note/uploaded/dev/my-note", {
      recursive: true,
      force: true,
    });

    expect(fs.mkdir).toHaveBeenCalledWith(
      path.dirname("/workspace/note/uploaded/dev/my-note"),
      { recursive: true },
    );

    expect(fs.rename).toHaveBeenCalledWith(
      "/workspace/note/drafts/dev/my-note",
      "/workspace/note/uploaded/dev/my-note",
    );

    expect(result).toEqual({
      ok: true,
      workspaceId: "my-note",
      noteId: "note:my-note",
      workspacePath: "/workspace/note/drafts/dev/my-note",
      uploadedWorkspacePath: "/workspace/note/uploaded/dev/my-note",
    });
  });

  it("throws when slug is missing", async () => {
    await expect(
      runPublishNoteCommand(createArgs({ slug: undefined })),
    ).rejects.toThrow("Note publish requires --slug <workspace-id>.");
  });

  it("throws when page kind is not note", async () => {
    jest.mocked(importNoteDraft).mockResolvedValue({
      ...validPage,
      kind: "journal",
    } as AuthoredPublicPageDefinition);

    await expect(runPublishNoteCommand(createArgs())).rejects.toThrow(
      'Note publish requires kind "note". Received: journal',
    );

    expect(writeCloudflareKvValue).not.toHaveBeenCalled();
    expect(fs.rename).not.toHaveBeenCalled();
  });

  it("normalises an unprefixed note id before publishing", async () => {
    jest.mocked(importNoteDraft).mockResolvedValue({
      ...validPage,
      id: "my-note",
    });

    await runPublishNoteCommand(createArgs());

    expect(writeCloudflareKvValue).toHaveBeenCalledWith(
      config,
      "notes-dev",
      "page:note:my-note",
      expect.objectContaining({
        id: "note:my-note",
        breadcrumbs: ["home", "notes", "note:my-note"],
      }),
    );
  });

  it("rejects slug/workspace mismatch before writing KV or moving workspace", async () => {
    jest.mocked(importNoteDraft).mockResolvedValue({
      ...validPage,
      slug: "/notes/a-different-note",
    });

    await expect(runPublishNoteCommand(createArgs())).rejects.toThrow(
      [
        "Note slug/workspace mismatch.",
        "",
        "Workspace: my-note",
        "Expected slug: /notes/my-note",
        "Actual slug: /notes/a-different-note",
      ].join("\n"),
    );

    expect(writeCloudflareKvValue).not.toHaveBeenCalled();
    expect(fs.rm).not.toHaveBeenCalled();
    expect(fs.mkdir).not.toHaveBeenCalled();
    expect(fs.rename).not.toHaveBeenCalled();
  });

  it("updates noteEntryFooter.updatedAt and leaves other footer modules untouched", async () => {
    const journalFooter = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2026-05-10T22:00:00+01:00",
        updatedAt: ["2026-05-10T22:00:00+01:00"],
      },
      tags: [],
    } as const;

    jest.mocked(importNoteDraft).mockResolvedValue({
      ...validPage,
      content: {
        ...validPage.content,
        footer: [...validPage.content.footer!, journalFooter],
      },
    });

    await runPublishNoteCommand(createArgs());

    const publishedPage = jest.mocked(writeCloudflareKvValue).mock
      .calls[0][3] as AuthoredPublicPageDefinition;

    const noteFooter = publishedPage.content.footer?.find(
      (module) => module.kind === "noteEntryFooter",
    );

    const untouchedJournalFooter = publishedPage.content.footer?.find(
      (module) => module.kind === "journalEntryFooter",
    );

    expect(noteFooter?.publication.updatedAt).toEqual([
      "2026-05-10T22:00:00+01:00",
      "2026-05-10T23:00:00+01:00",
    ]);

    expect(untouchedJournalFooter).toBe(journalFooter);
  });

  it("handles undefined footer by publishing an empty footer array", async () => {
    jest.mocked(importNoteDraft).mockResolvedValue({
      ...validPage,
      content: {
        ...validPage.content,
        footer: undefined,
      },
    });

    await runPublishNoteCommand(createArgs());

    expect(writeCloudflareKvValue).toHaveBeenCalledWith(
      config,
      "notes-dev",
      "page:note:my-note",
      expect.objectContaining({
        content: expect.objectContaining({
          footer: [],
        }),
      }),
    );
  });
});
