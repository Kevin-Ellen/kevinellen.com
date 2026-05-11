// packages/content-cli/src/content/notes/promote.note.content.test.ts

import { runPromoteNoteCommand } from "@content-cli/content/notes/promote.note.content";
import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

jest.mock(
  "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli",
  () => ({
    readCloudflareKvValue: jest.fn(),
  }),
);

jest.mock(
  "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli",
  () => ({
    writeCloudflareKvValue: jest.fn(),
  }),
);

jest.mock("@content-cli/config/load.content-cli.config", () => ({
  loadContentCliConfig: jest.fn(),
}));

describe("runPromoteNoteCommand", () => {
  const fromConfig = {
    cloudflareKvNotesNamespaceId: "notes-dev",
  };

  const toConfig = {
    cloudflareKvNotesNamespaceId: "notes-stg",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .mocked(loadContentCliConfig)
      .mockReturnValueOnce(fromConfig as never)
      .mockReturnValueOnce(toConfig as never);

    jest.mocked(readCloudflareKvValue).mockResolvedValue({
      id: "note:my-note",
    } as never);
  });

  it("promotes a note between environments", async () => {
    const result = await runPromoteNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "promote",
      bucket: "drafts",
      slug: "my-note",
      from: "dev",
      to: "stg",
    });

    expect(readCloudflareKvValue).toHaveBeenCalledWith(
      fromConfig,
      "notes-dev",
      "page:my-note",
    );

    expect(writeCloudflareKvValue).toHaveBeenCalledWith(
      toConfig,
      "notes-stg",
      "page:my-note",
      { id: "note:my-note" },
    );

    expect(result).toEqual({
      ok: true,
      entity: "note",
      action: "promote",
      noteId: "my-note",
      key: "page:my-note",
      from: "dev",
      to: "stg",
    });
  });

  it("throws when slug is missing", async () => {
    await expect(
      runPromoteNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "promote",
        bucket: "drafts",
      }),
    ).rejects.toThrow("Note promote requires --slug <note-id>.");
  });

  it("throws when from or to is missing", async () => {
    await expect(
      runPromoteNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "promote",
        bucket: "drafts",
        slug: "my-note",
      }),
    ).rejects.toThrow("Note promote requires --from <env> and --to <env>.");
  });

  it("throws when from and to are the same", async () => {
    await expect(
      runPromoteNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "promote",
        bucket: "drafts",
        slug: "my-note",
        from: "dev",
        to: "dev",
      }),
    ).rejects.toThrow(
      "Note promote requires different --from and --to environments.",
    );
  });
});
