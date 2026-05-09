// packages/content-cli/src/cli/interactive/results.interactive.cli.test.ts

import type { JournalCreateCommandResult } from "@content-cli/commands/types/command.types";

import { isJournalCreateCommandResult } from "@content-cli/cli/interactive/results.interactive.cli";

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
});
