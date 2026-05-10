// packages/content-cli/src/content/journal/status.journal.content.test.ts

import { runStatusJournalCommand } from "@content-cli/content/journal/status.journal.content";
import { getJournalWorkspaceStatus } from "@content-cli/content/journal/workspace.status.journal.content";

import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

jest.mock("@content-cli/content/journal/workspace.status.journal.content");

const mockedGetStatus = jest.mocked(getJournalWorkspaceStatus);

const createArgs = (
  overrides: Partial<ParsedJournalDirectCliArgs> = {},
): ParsedJournalDirectCliArgs => ({
  mode: "direct",
  env: "dev",
  entity: "journal",
  action: "status",
  bucket: "drafts",
  slug: "rye-house",
  ...overrides,
});

describe("runStatusJournalCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("returns ok even with empty status", async () => {
    mockedGetStatus.mockResolvedValue([
      { bucket: "drafts", count: 0, workspaceIds: [] },
      { bucket: "uploaded", count: 0, workspaceIds: [] },
    ] as any);

    const result = await runStatusJournalCommand(createArgs());

    expect(mockedGetStatus).toHaveBeenCalledWith("dev");
    expect(result).toEqual({ ok: true });
  });

  it("logs workspace status with multiple workspaces", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    mockedGetStatus.mockResolvedValue([
      { bucket: "drafts", count: 2, workspaceIds: ["rye-house", "mallorca"] },
      { bucket: "uploaded", count: 1, workspaceIds: ["published-one"] },
    ] as any);

    await runStatusJournalCommand(createArgs());

    expect(consoleSpy).toHaveBeenCalledWith("\nJournal status (dev)\n");
    expect(consoleSpy).toHaveBeenCalledWith("drafts: 2");
    expect(consoleSpy).toHaveBeenCalledWith("  • rye-house");
    expect(consoleSpy).toHaveBeenCalledWith("  • mallorca");
    expect(consoleSpy).toHaveBeenCalledWith("uploaded: 1");
    expect(consoleSpy).toHaveBeenCalledWith("  • published-one");
  });

  it("logs 'none' when bucket has no workspaces", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    mockedGetStatus.mockResolvedValue([
      { bucket: "drafts", count: 0, workspaceIds: [] },
    ] as any);

    await runStatusJournalCommand(createArgs());

    expect(consoleSpy).toHaveBeenCalledWith("  none");
  });
});
