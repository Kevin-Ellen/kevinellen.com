// packages/content-cli/src/content/notes/utils/import.draft.note.util.content.test.ts

import path from "node:path";
import { pathToFileURL } from "node:url";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

const mockPage: AuthoredPublicPageDefinition = {
  id: "note:test-note",
  kind: "note",
  slug: "/notes/test-note",
  label: "Test Note",
  metadata: {
    pageTitle: "Test Note",
    metaDescription: "Test note description.",
  },
  breadcrumbs: ["home"],
  content: {
    head: {
      eyebrow: "Note",
      title: "Test Note",
      intro: "Test intro.",
    },
    content: [],
  },
};

describe("importNoteDraft", () => {
  const originalDateNow = Date.now;

  beforeEach(() => {
    jest.resetModules();
    Date.now = jest.fn(() => 1234567890);
  });

  afterEach(() => {
    Date.now = originalDateNow;
    jest.restoreAllMocks();
  });

  it("imports and returns a cloned note draft page", async () => {
    const filePath = "/tmp/note.draft.ts";
    const moduleUrl = pathToFileURL(path.resolve(filePath));

    moduleUrl.searchParams.set("t", "1234567890");

    jest.doMock(moduleUrl.href, () => ({ page: mockPage }), {
      virtual: true,
    });

    const { importNoteDraft } =
      await import("@content-cli/content/notes/utils/import.draft.note.util.content");

    const result = await importNoteDraft(filePath);

    expect(result).toEqual(mockPage);
    expect(result).not.toBe(mockPage);
  });

  it("throws when the module does not export page", async () => {
    const filePath = "/tmp/missing-note.draft.ts";
    const moduleUrl = pathToFileURL(path.resolve(filePath));

    moduleUrl.searchParams.set("t", "1234567890");

    jest.doMock(moduleUrl.href, () => ({}), {
      virtual: true,
    });

    const { importNoteDraft } =
      await import("@content-cli/content/notes/utils/import.draft.note.util.content");

    await expect(importNoteDraft(filePath)).rejects.toThrow(
      `Note draft does not export page: ${filePath}`,
    );
  });

  it("throws when page export is undefined", async () => {
    const filePath = "/tmp/undefined-note.draft.ts";
    const moduleUrl = pathToFileURL(path.resolve(filePath));

    moduleUrl.searchParams.set("t", "1234567890");

    jest.doMock(moduleUrl.href, () => ({ page: undefined }), {
      virtual: true,
    });

    const { importNoteDraft } =
      await import("@content-cli/content/notes/utils/import.draft.note.util.content");

    await expect(importNoteDraft(filePath)).rejects.toThrow(
      `Note draft does not export page: ${filePath}`,
    );
  });
});
