import { runDirectCli } from "@content-cli/cli/direct.run.cli";
import { contentCommandRegistry } from "@content-cli/commands/registry/registry.command";

jest.mock("@content-cli/commands/registry/registry.command", () => ({
  contentCommandRegistry: {
    journal: {
      create: jest.fn(),
      generate: jest.fn(),
    },
    photo: {
      create: jest.fn(),
      generate: jest.fn(),
      homepageStripRebuild: jest.fn(),
    },
  },
}));

describe("runDirectCli", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls the correct journal command", async () => {
    const args = {
      entity: "journal",
      action: "create",
      bucket: "drafts",
      env: "dev",
      mode: "direct",
    } as any;
    (contentCommandRegistry.journal.create as jest.Mock).mockResolvedValue({
      ok: true,
    });

    const result = await runDirectCli(args);

    expect(contentCommandRegistry.journal.create).toHaveBeenCalledWith(args);
    expect(result).toEqual({ ok: true });
  });

  it("calls the correct photo command", async () => {
    const args = {
      entity: "photo",
      action: "create",
      bucket: "drafts",
      env: "dev",
      mode: "direct",
    } as any;
    (contentCommandRegistry.photo.create as jest.Mock).mockResolvedValue({
      ok: true,
    });

    const result = await runDirectCli(args);

    expect(contentCommandRegistry.photo.create).toHaveBeenCalledWith(args);
    expect(result).toEqual({ ok: true });
  });

  it("throws for unsupported command", async () => {
    const args = {
      entity: "journal",
      action: "nonexistent",
      bucket: "drafts",
      env: "dev",
      mode: "direct",
    } as any;
    await expect(runDirectCli(args)).rejects.toThrow(
      "Unsupported CLI command.",
    );
  });
});
