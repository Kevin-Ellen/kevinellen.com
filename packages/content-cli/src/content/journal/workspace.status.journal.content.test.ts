// packages/content-cli/src/content/journal/workspace.status.journal.content.test.ts

import fs from "node:fs/promises";
import path from "node:path";
import { getJournalWorkspaceStatus } from "@content-cli/content/journal/workspace.status.journal.content";
import { JOURNAL_WORKSPACE_ROOT } from "@content-cli/config/paths.config.content-cli";

jest.mock("node:fs/promises");

const mockedFs = fs as jest.Mocked<typeof fs>;

describe("getJournalWorkspaceStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all buckets with sorted workspace IDs", async () => {
    mockedFs.readdir.mockImplementation(async (dirPath) => {
      const dir = dirPath.toString(); // <- cast to string

      if (dir.includes("drafts")) {
        return [
          { isDirectory: () => true, name: "B" },
          { isDirectory: () => true, name: "A" },
        ] as any;
      }
      if (dir.includes("edits")) return [] as any;
      if (dir.includes("uploaded"))
        return [{ isDirectory: () => true, name: "X" }] as any;
      return [] as any;
    });

    const result = await getJournalWorkspaceStatus("dev");

    expect(result).toHaveLength(3);

    const drafts = result.find((b) => b.bucket === "drafts");
    expect(drafts?.workspaceIds).toEqual(["A", "B"]);
    expect(drafts?.count).toBe(2);

    const edits = result.find((b) => b.bucket === "edits");
    expect(edits?.workspaceIds).toEqual([]);
    expect(edits?.count).toBe(0);

    const uploaded = result.find((b) => b.bucket === "uploaded");
    expect(uploaded?.workspaceIds).toEqual(["X"]);
    expect(uploaded?.count).toBe(1);

    for (const bucket of result) {
      expect(bucket.env).toBe("dev");
      expect(bucket.path).toContain(JOURNAL_WORKSPACE_ROOT);
    }
  });

  it("returns empty array if folder does not exist", async () => {
    mockedFs.readdir.mockRejectedValue(new Error("not found"));
    const result = await getJournalWorkspaceStatus("dev");
    for (const bucket of result) {
      expect(bucket.workspaceIds).toEqual([]);
      expect(bucket.count).toBe(0);
    }
  });
});
