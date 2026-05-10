// packages/content-cli/src/content/journal/list.journal.content.test.ts

import { runListJournalCommand } from "@content-cli/content/journal/list.journal.content";
import { getJournalWorkspaceStatus } from "@content-cli/content/journal/workspace.status.journal.content";

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

jest.mock("@content-cli/content/journal/workspace.status.journal.content");

const mockedGetJournalWorkspaceStatus = jest.mocked(getJournalWorkspaceStatus);

const createArgs = (
  overrides: Partial<ParsedJournalDirectCliArgs> = {},
): ParsedJournalDirectCliArgs => ({
  mode: "direct",
  env: "dev",
  entity: "journal",
  action: "list",
  bucket: "drafts",
  ...overrides,
});

const createStatusEntry = (
  bucket: ContentWorkspaceBucket,
  workspaceIds: readonly string[],
  env: ContentCliEnvironment = "dev",
) => ({
  bucket,
  env,
  path: `/journal/${env}/${bucket}`,
  count: workspaceIds.length,
  workspaceIds,
});

describe("runListJournalCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns workspace IDs for the requested bucket", async () => {
    mockedGetJournalWorkspaceStatus.mockResolvedValue([
      createStatusEntry("drafts", ["rye-house", "mallorca"]),
      createStatusEntry("uploaded", ["published-one"]),
    ]);

    const result = await runListJournalCommand(createArgs());

    expect(mockedGetJournalWorkspaceStatus).toHaveBeenCalledWith("dev");

    expect(result).toEqual({
      ok: true,
      entity: "journal",
      action: "list",
      env: "dev",
      bucket: "drafts",
      workspaceIds: ["rye-house", "mallorca"],
    });
  });

  it("returns an empty workspace list when the bucket has no workspaces", async () => {
    mockedGetJournalWorkspaceStatus.mockResolvedValue([
      createStatusEntry("drafts", []),
    ]);

    const result = await runListJournalCommand(createArgs());

    expect(result).toEqual({
      ok: true,
      entity: "journal",
      action: "list",
      env: "dev",
      bucket: "drafts",
      workspaceIds: [],
    });
  });

  it("throws when the requested bucket is not known", async () => {
    mockedGetJournalWorkspaceStatus.mockResolvedValue([
      createStatusEntry("uploaded", []),
    ]);

    await expect(runListJournalCommand(createArgs())).rejects.toThrow(
      "Unknown journal bucket: drafts",
    );
  });

  it("uses the selected environment", async () => {
    mockedGetJournalWorkspaceStatus.mockResolvedValue([
      createStatusEntry("uploaded", ["live-entry"], "prod"),
    ]);

    await runListJournalCommand(
      createArgs({
        env: "prod",
        bucket: "uploaded",
      }),
    );

    expect(mockedGetJournalWorkspaceStatus).toHaveBeenCalledWith("prod");
  });
});
