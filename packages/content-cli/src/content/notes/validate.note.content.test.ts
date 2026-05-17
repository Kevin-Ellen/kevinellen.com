// packages/content-cli/src/content/notes/validate.note.content.test.ts

import { runValidateNoteCommand } from "@content-cli/content/notes/validate.note.content";

import { getNoteFilePath } from "@content-cli/content/notes/path.note.content";
import { getNoteWorkspacePath } from "@content-cli/content/notes/path.note.content";
import { importNoteDraft } from "@content-cli/content/notes/utils/import.draft.note.util.content";

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

describe("runValidateNoteCommand", () => {
  const mockGetNoteFilePath = jest.mocked(getNoteFilePath);
  const mockGetNoteWorkspacePath = jest.mocked(getNoteWorkspacePath);
  const mockImportNoteDraft = jest.mocked(importNoteDraft);

  const validPage = {
    id: "note:test-note",
    kind: "note",
    slug: "/notes/test-note",
    label: "Test Note",

    metadata: {
      pageTitle: "Test Note",
      metaDescription: "Description",
    },

    breadcrumbs: ["home"],

    content: {
      head: {
        eyebrow: "Note",
        title: "Test Note",
        intro: "Intro",
      },

      content: [
        {
          kind: "articleSection",
          heading: {
            text: "Section",
            visuallyHidden: false,
            level: 2,
          },

          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value: "Valid content",
                },
              ],
            },
          ],
        },
      ],

      footer: [
        {
          kind: "journalEntryFooter",
          publication: {
            author: "Kevin Ellen",
            publishedAt: "2026-01-01T00:00:00+00:00",
            updatedAt: ["2026-01-01T00:00:00+00:00"],
          },
          tags: [],
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetNoteWorkspacePath.mockReturnValue("/workspace/test-note");
    mockGetNoteFilePath.mockReturnValue("/workspace/test-note/note.draft.ts");
  });

  it("validates a valid note draft", async () => {
    mockImportNoteDraft.mockResolvedValue(validPage as never);

    const result = await runValidateNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "validate",
      bucket: "drafts",
      slug: "test-note",
    });

    expect(result).toEqual({ ok: true });

    expect(mockGetNoteWorkspacePath).toHaveBeenCalledWith(
      "dev",
      "drafts",
      "test-note",
    );

    expect(mockGetNoteFilePath).toHaveBeenCalledWith(
      "dev",
      "drafts",
      "test-note",
    );

    expect(mockImportNoteDraft).toHaveBeenCalledWith(
      "/workspace/test-note/note.draft.ts",
    );
  });

  it("throws if slug is missing", async () => {
    await expect(
      runValidateNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "validate",
        bucket: "drafts",
      }),
    ).rejects.toThrow("Note validate requires --slug <workspace-id>.");
  });

  it("throws if placeholders remain", async () => {
    mockImportNoteDraft.mockResolvedValue({
      ...validPage,
      label: "__REQUIRED__",
    } as never);

    await expect(
      runValidateNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "validate",
        bucket: "drafts",
        slug: "test-note",
      }),
    ).rejects.toThrow("Note validation failed: required placeholders remain");
  });

  it("throws if kind is invalid", async () => {
    mockImportNoteDraft.mockResolvedValue({
      ...validPage,
      kind: "journal",
    } as never);

    await expect(
      runValidateNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "validate",
        bucket: "drafts",
        slug: "test-note",
      }),
    ).rejects.toThrow('expected kind "note", received "journal"');
  });

  it("throws if slug does not start with /notes/", async () => {
    mockImportNoteDraft.mockResolvedValue({
      ...validPage,
      slug: "/journal/test-note",
    } as never);

    await expect(
      runValidateNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "validate",
        bucket: "drafts",
        slug: "test-note",
      }),
    ).rejects.toThrow(
      'expected note slug to start with /notes/, received "/journal/test-note"',
    );
  });

  it("throws if publication footer is missing", async () => {
    mockImportNoteDraft.mockResolvedValue({
      ...validPage,
      content: {
        ...validPage.content,
        footer: [],
      },
    } as never);

    await expect(
      runValidateNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "validate",
        bucket: "drafts",
        slug: "test-note",
      }),
    ).rejects.toThrow("missing publication footer");
  });

  it("throws with multiple validation errors", async () => {
    mockImportNoteDraft.mockResolvedValue({
      ...validPage,
      kind: "journal",
      slug: "/invalid/test",
      label: "__REQUIRED__",
      content: {
        ...validPage.content,
        footer: [],
      },
    } as never);

    await expect(
      runValidateNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "validate",
        bucket: "drafts",
        slug: "test-note",
      }),
    ).rejects.toThrow(/required placeholders remain/);

    await expect(
      runValidateNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "validate",
        bucket: "drafts",
        slug: "test-note",
      }),
    ).rejects.toThrow(/expected kind "note"/);

    await expect(
      runValidateNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "validate",
        bucket: "drafts",
        slug: "test-note",
      }),
    ).rejects.toThrow(/missing publication footer/);
  });

  it("handles null and primitive recursion safely", async () => {
    mockImportNoteDraft.mockResolvedValue({
      ...validPage,
      content: {
        ...validPage.content,
        extra: null,
      },
    } as never);

    const result = await runValidateNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "validate",
      bucket: "drafts",
      slug: "test-note",
    });

    expect(result).toEqual({ ok: true });
  });

  it("fails when footer is undefined", async () => {
    mockImportNoteDraft.mockResolvedValue({
      ...validPage,
      content: {
        ...validPage.content,
        footer: undefined,
      },
    } as never);

    await expect(
      runValidateNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "validate",
        bucket: "drafts",
        slug: "test-note",
      }),
    ).rejects.toThrow("missing publication footer");
  });
});
