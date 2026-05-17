// packages/content-cli/src/content/notes/read.note.content.test.ts

import { runReadNoteCommand } from "@content-cli/content/notes/read.note.content";
import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

jest.mock(
  "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli",
  () => ({
    readCloudflareKvValue: jest.fn(),
  }),
);

jest.mock("@content-cli/config/load.content-cli.config", () => ({
  loadContentCliConfig: jest.fn(),
}));

describe("runReadNoteCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(loadContentCliConfig).mockReturnValue({
      cloudflareKvNotesNamespaceId: "notes-dev",
    } as never);

    jest.mocked(readCloudflareKvValue).mockResolvedValue({
      id: "note:my-note",
    } as never);
  });

  it("reads a note from KV", async () => {
    const result = await runReadNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "read",
      bucket: "drafts",
      slug: "my-note",
    });

    expect(readCloudflareKvValue).toHaveBeenCalledWith(
      { cloudflareKvNotesNamespaceId: "notes-dev" },
      "notes-dev",
      "page:my-note",
    );

    expect(result).toEqual({ ok: true });
  });

  it("throws when slug is missing", async () => {
    await expect(
      runReadNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "read",
        bucket: "drafts",
      }),
    ).rejects.toThrow("Note read requires --slug <note-id>.");
  });
});
