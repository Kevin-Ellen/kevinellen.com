// packages/content-cli/src/cli/interactive/command.interactive.cli.test.ts

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { runDirectCli } from "@content-cli/cli/direct.run.cli";

jest.mock("@content-cli/cli/direct.run.cli", () => ({
  runDirectCli: jest.fn(),
}));

describe("runInteractiveContentCommand", () => {
  const mockRunDirectCli = runDirectCli as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls runDirectCli with journal action and all fields", async () => {
    const args = {
      env: "dev" as const,
      entity: "journal" as const,
      action: "create" as const,
      bucket: "drafts" as const,
      slug: "my-journal",
      from: "dev" as const,
      to: "stg" as const,
    };

    mockRunDirectCli.mockResolvedValue({ ok: true });

    const result = await runInteractiveContentCommand(args);

    expect(result).toEqual({ ok: true });
    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "journal",
      action: "create",
      bucket: "drafts",
      slug: "my-journal",
      from: "dev",
      to: "stg",
    });
  });

  it("applies defaults for missing optional journal fields", async () => {
    const args = {
      env: "dev" as const,
      entity: "journal" as const,
      action: "create" as const,
    };

    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand(args);

    // bucket should default to "drafts", slug/from/to undefined
    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "journal",
      action: "create",
      bucket: "drafts",
      slug: undefined,
      from: undefined,
      to: undefined,
    });
  });

  it("calls runDirectCli with photo action correctly", async () => {
    const args = {
      env: "dev" as const,
      entity: "photo" as const,
      action: "publish" as const,
      photoId: "photo-123",
    };

    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand(args);

    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "photo",
      action: "publish",
      bucket: "drafts", // default applied
      photoId: "photo-123",
    });
  });

  it("calls runDirectCli for photo homepageStripRebuild correctly", async () => {
    const args = {
      env: "prod" as const,
      entity: "photo" as const,
      action: "homepageStripRebuild" as const,
    };

    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand(args);

    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "prod",
      entity: "photo",
      action: "homepageStripRebuild",
    });
  });

  it("applies default bucket for photo if missing", async () => {
    const args = {
      env: "dev" as const,
      entity: "photo" as const,
      action: "publish" as const,
      photoId: "photo-456",
    };

    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand(args);

    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "photo",
      action: "publish",
      bucket: "drafts",
      photoId: "photo-456",
    });
  });
});
