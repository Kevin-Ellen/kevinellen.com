// packages/content-cli/src/content/journal/create.journal.content.test.ts

import fs from "node:fs/promises";
import path from "node:path";

import { runCreateJournalCommand } from "@content-cli/content/journal/create.journal.content";
import { getJournalWorkspacePath } from "@content-cli/content/journal/path.journal.content";
import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

jest.mock("node:fs/promises");
jest.mock("@content-cli/content/journal/path.journal.content");
jest.mock("@content-cli/utils/format.local.date.time.with.offset.util");

const mockFs = fs as jest.Mocked<typeof fs>;

const mockedGetJournalWorkspacePath = jest.mocked(getJournalWorkspacePath);

const mockedFormatLocalDateTimeWithOffset = jest.mocked(
  formatLocalDateTimeWithOffset,
);

describe("runCreateJournalCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a journal workspace using the provided slug", async () => {
    mockedGetJournalWorkspacePath.mockReturnValue("/workspace/my-journal");

    const result = await runCreateJournalCommand({
      mode: "direct",
      env: "dev",
      entity: "journal",
      action: "create",
      bucket: "drafts",
      slug: "my-journal",
    } as ParsedJournalDirectCliArgs);

    expect(mockedGetJournalWorkspacePath).toHaveBeenCalledWith(
      "dev",
      "drafts",
      "my-journal",
    );

    expect(mockFs.mkdir).toHaveBeenNthCalledWith(1, "/workspace/my-journal", {
      recursive: true,
    });

    expect(mockFs.mkdir).toHaveBeenNthCalledWith(
      2,
      path.join("/workspace/my-journal", "photos"),
      { recursive: true },
    );

    expect(result).toEqual({
      ok: true,
      entity: "journal",
      action: "create",
      workspaceId: "my-journal",
      workspacePath: "/workspace/my-journal",
      photosPath: "/workspace/my-journal/photos",
    });
  });

  it("creates a timestamp workspace ID when no slug is provided", async () => {
    mockedFormatLocalDateTimeWithOffset.mockReturnValue(
      "2026-05-10T12:30:00+01:00",
    );

    mockedGetJournalWorkspacePath.mockReturnValue(
      "/workspace/2026-05-10T12-30-00+01-00",
    );

    const result = await runCreateJournalCommand({
      mode: "direct",
      env: "prod",
      entity: "journal",
      action: "create",
      bucket: "drafts",
    } as ParsedJournalDirectCliArgs);

    expect(mockedFormatLocalDateTimeWithOffset).toHaveBeenCalledTimes(1);

    expect(mockedGetJournalWorkspacePath).toHaveBeenCalledWith(
      "prod",
      "drafts",
      "2026-05-10T12-30-00+01-00",
    );

    expect(result.workspaceId).toBe("2026-05-10T12-30-00+01-00");
  });

  it("creates the photos directory inside the workspace", async () => {
    mockedGetJournalWorkspacePath.mockReturnValue("/workspace/test");

    await runCreateJournalCommand({
      mode: "direct",
      env: "dev",
      entity: "journal",
      action: "create",
      bucket: "drafts",
      slug: "test",
    } as ParsedJournalDirectCliArgs);

    expect(mockFs.mkdir).toHaveBeenCalledWith("/workspace/test/photos", {
      recursive: true,
    });
  });
});
