// packages/content-cli/src/content/notes/publish.note.content.test.ts

import fs from "node:fs/promises";
import path from "node:path";

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

describe("runPublishNoteCommand", () => {
  const config = {
    cloudflareKvNotesNamespaceId: "notes-dev",
  };

  const validPage = {
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
          kind: "journalEntryFooter",
          publication: {
            author: "Kevin Ellen",
            publishedAt: "2026-05-10T22:00:00+01:00",
            updatedAt: ["2026-05-10T22:00:00+01:00"],
          },
          tags: [],
        },
      ],
    },
  };

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

    jest.mocked(importNoteDraft).mockResolvedValue(validPage as never);

    jest
      .mocked(formatLocalDateTimeWithOffset)
      .mockReturnValue("2026-05-10T23:00:00+01:00");
  });

  it("publishes a valid note to KV and moves the workspace", async () => {
    const result = await runPublishNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "publish",
      bucket: "drafts",
      slug: "my-note",
    });

    expect(runValidateNoteCommand).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "publish",
      bucket: "drafts",
      slug: "my-note",
    });

    expect(writeCloudflareKvValue).toHaveBeenCalledWith(
      config,
      "notes-dev",
      "page:note:my-note",
      {
        ...validPage,
        content: {
          ...validPage.content,
          footer: [
            {
              kind: "journalEntryFooter",
              publication: {
                author: "Kevin Ellen",
                publishedAt: "2026-05-10T22:00:00+01:00",
                updatedAt: [
                  "2026-05-10T22:00:00+01:00",
                  "2026-05-10T23:00:00+01:00",
                ],
              },
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
      runPublishNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "publish",
        bucket: "drafts",
      }),
    ).rejects.toThrow("Note publish requires --slug <workspace-id>.");
  });

  it("throws when page kind is not note", async () => {
    jest.mocked(importNoteDraft).mockResolvedValue({
      ...validPage,
      kind: "journal",
    } as never);

    await expect(
      runPublishNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "publish",
        bucket: "drafts",
        slug: "my-note",
      }),
    ).rejects.toThrow('Note publish requires kind "note". Received: journal');
  });

  it("throws when note id does not start with note prefix", async () => {
    jest.mocked(importNoteDraft).mockResolvedValue({
      ...validPage,
      id: "journal:my-note",
    } as never);

    await expect(
      runPublishNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "publish",
        bucket: "drafts",
        slug: "my-note",
      }),
    ).rejects.toThrow(
      'Note id must start with "note:". Received: journal:my-note',
    );
  });

  it("throws when note slug does not start with notes path", async () => {
    jest.mocked(importNoteDraft).mockResolvedValue({
      ...validPage,
      slug: "/journal/my-note",
    } as never);

    await expect(
      runPublishNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "publish",
        bucket: "drafts",
        slug: "my-note",
      }),
    ).rejects.toThrow(
      'Note slug must start with "/notes/". Received: /journal/my-note',
    );
  });

  it("preserves non-publication footer modules", async () => {
    const pageWithOtherFooter = {
      ...validPage,
      content: {
        ...validPage.content,
        footer: [
          {
            kind: "otherFooter",
          },
        ],
      },
    };

    jest
      .mocked(importNoteDraft)
      .mockResolvedValue(pageWithOtherFooter as never);

    await runPublishNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "publish",
      bucket: "drafts",
      slug: "my-note",
    });

    expect(writeCloudflareKvValue).toHaveBeenCalledWith(
      config,
      "notes-dev",
      "page:note:my-note",
      pageWithOtherFooter,
    );
  });

  it("handles missing footer by publishing an empty footer array", async () => {
    const pageWithoutFooter = {
      ...validPage,
      content: {
        ...validPage.content,
        footer: undefined,
      },
    };

    jest.mocked(importNoteDraft).mockResolvedValue(pageWithoutFooter as never);

    await runPublishNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "publish",
      bucket: "drafts",
      slug: "my-note",
    });

    expect(writeCloudflareKvValue).toHaveBeenCalledWith(
      config,
      "notes-dev",
      "page:note:my-note",
      {
        ...pageWithoutFooter,
        content: {
          ...pageWithoutFooter.content,
          footer: [],
        },
      },
    );
  });
});
