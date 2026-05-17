// packages/content-cli/src/cli/interactive/results.interactive.cli.test.ts

import type {
  JournalCreateCommandResult,
  NoteCreateCommandResult,
} from "@content-cli/commands/types/command.types";

import {
  isJournalCreateCommandResult,
  isNoteCreateCommandResult,
} from "@content-cli/cli/interactive/results.interactive.cli";

describe("isJournalCreateCommandResult", () => {
  const validResult: JournalCreateCommandResult = {
    ok: true,
    entity: "journal",
    action: "create",
    workspaceId: "abc123",
    workspacePath: "/tmp/journal",
    photosPath: "/tmp/journal/photos",
  };

  it("returns true for a valid JournalCreateCommandResult", () => {
    expect(isJournalCreateCommandResult(validResult)).toBe(true);
  });

  it("returns false if ok is false", () => {
    const result: any = { ...validResult, ok: false };
    expect(isJournalCreateCommandResult(result)).toBe(false);
  });

  it("returns false if entity is not 'journal'", () => {
    const result: any = { ...validResult, entity: "photo" };
    expect(isJournalCreateCommandResult(result)).toBe(false);
  });

  it("returns false if action is not 'create'", () => {
    const result: any = { ...validResult, action: "publish" };
    expect(isJournalCreateCommandResult(result)).toBe(false);
  });

  it("returns false if a required key is missing", () => {
    const { workspaceId, ...partial } = validResult;
    expect(isJournalCreateCommandResult(partial as any)).toBe(false);
  });

  it("returns false if a required key is wrong type", () => {
    const badResult: any = { ...validResult, photosPath: 123 };
    expect(isJournalCreateCommandResult(badResult)).toBe(false);
  });

  it("returns false for non-object input", () => {
    expect(isJournalCreateCommandResult(null as any)).toBe(false);
    expect(isJournalCreateCommandResult("string" as any)).toBe(false);
    expect(isJournalCreateCommandResult(123 as any)).toBe(false);
  });

  describe("isNoteCreateCommandResult", () => {
    const validResult: NoteCreateCommandResult = {
      ok: true,
      entity: "note",
      action: "create",
      workspaceId: "abc123",
      workspacePath: "/tmp/note",
    };

    it("returns true for a valid NoteCreateCommandResult", () => {
      expect(isNoteCreateCommandResult(validResult)).toBe(true);
    });

    it("returns false if ok is false", () => {
      expect(
        isNoteCreateCommandResult({ ...validResult, ok: false } as any),
      ).toBe(false);
    });

    it("returns false if entity is not 'note'", () => {
      expect(
        isNoteCreateCommandResult({ ...validResult, entity: "journal" } as any),
      ).toBe(false);
    });

    it("returns false if action is not 'create'", () => {
      expect(
        isNoteCreateCommandResult({ ...validResult, action: "publish" } as any),
      ).toBe(false);
    });

    it("returns false if a required key is missing", () => {
      const { workspaceId, ...partial } = validResult;

      expect(isNoteCreateCommandResult(partial as any)).toBe(false);
    });

    it("returns false if a required key is wrong type", () => {
      expect(
        isNoteCreateCommandResult({
          ...validResult,
          workspacePath: 123,
        } as any),
      ).toBe(false);
    });

    it("returns false for non-object input", () => {
      expect(isNoteCreateCommandResult(null as any)).toBe(false);
      expect(isNoteCreateCommandResult("string" as any)).toBe(false);
      expect(isNoteCreateCommandResult(123 as any)).toBe(false);
    });
  });
});
