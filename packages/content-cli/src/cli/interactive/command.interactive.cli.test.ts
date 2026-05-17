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
    mockRunDirectCli.mockResolvedValue({ ok: true });

    const result = await runInteractiveContentCommand({
      env: "dev",
      entity: "journal",
      action: "create",
      bucket: "drafts",
      slug: "my-journal",
      from: "dev",
      to: "stg",
    });

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
    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand({
      env: "dev",
      entity: "journal",
      action: "create",
    });

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

  it("calls runDirectCli with photo workspace action correctly", async () => {
    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand({
      env: "dev",
      entity: "photo",
      action: "publish",
      photoId: "photo-123",
    });

    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "photo",
      action: "publish",
      bucket: "drafts",
      slug: "photo-123",
    });
  });

  it("calls runDirectCli for photo homepageStripRebuild correctly", async () => {
    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand({
      env: "prod",
      entity: "photo",
      action: "homepageStripRebuild",
    });

    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "prod",
      entity: "photo",
      action: "homepageStripRebuild",
    });
  });

  it("applies default bucket for photo workspace actions", async () => {
    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand({
      env: "dev",
      entity: "photo",
      action: "publish",
      photoId: "photo-456",
    });

    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "photo",
      action: "publish",
      bucket: "drafts",
      slug: "photo-456",
    });
  });

  it("throws when photo read is missing photoId", async () => {
    await expect(
      runInteractiveContentCommand({
        env: "dev",
        entity: "photo",
        action: "read",
      }),
    ).rejects.toThrow("Photo read requires photoId.");
  });

  it("calls runDirectCli with note action and all fields", async () => {
    mockRunDirectCli.mockResolvedValue({ ok: true });

    const result = await runInteractiveContentCommand({
      env: "dev",
      entity: "note",
      action: "promote",
      bucket: "drafts",
      slug: "my-note",
      from: "dev",
      to: "stg",
    });

    expect(result).toEqual({ ok: true });
    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "promote",
      bucket: "drafts",
      slug: "my-note",
      from: "dev",
      to: "stg",
    });
  });

  it("calls runDirectCli with photo create action", async () => {
    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand({
      env: "dev",
      entity: "photo",
      action: "create",
    });

    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "photo",
      action: "create",
      bucket: "drafts",
    });
  });

  it("calls runDirectCli with photo read action", async () => {
    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand({
      env: "dev",
      entity: "photo",
      action: "read",
      photoId: "photo-123",
    });

    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "photo",
      action: "read",
      bucket: "drafts",
      photoId: "photo-123",
    });
  });

  it("calls runDirectCli with photo list action", async () => {
    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand({
      env: "dev",
      entity: "photo",
      action: "list",
    });

    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "photo",
      action: "list",
      bucket: "drafts",
    });
  });

  it("throws when photo workspace action is missing photoId", async () => {
    await expect(
      runInteractiveContentCommand({
        env: "dev",
        entity: "photo",
        action: "publish",
      }),
    ).rejects.toThrow("Photo publish requires photoId.");
  });

  it("applies default bucket for note actions", async () => {
    mockRunDirectCli.mockResolvedValue({ ok: true });

    await runInteractiveContentCommand({
      env: "dev",
      entity: "note",
      action: "create",
    });

    expect(mockRunDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "create",
      bucket: "drafts",
      slug: undefined,
      from: undefined,
      to: undefined,
    });
  });
});
