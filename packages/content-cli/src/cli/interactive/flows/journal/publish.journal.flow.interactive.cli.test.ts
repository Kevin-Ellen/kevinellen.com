// tests/src/cli/interactive/flows/journal/publish.journal.flow.interactive.cli.test.ts

import { runJournalPublishFlow } from "@content-cli/cli/interactive/flows/journal/publish.journal.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { cancel, isCancel, text, confirm } from "@clack/prompts";

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  text: jest.fn(),
  confirm: jest.fn(),
}));

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runJournalPublishFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("cancels if slug input is cancelled", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("slug");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runJournalPublishFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("cancels if PROD confirmation is cancelled", async () => {
    const prodState = { env: "prod" } as any;

    (text as unknown as jest.Mock).mockResolvedValueOnce("slug");
    (isCancel as unknown as jest.Mock)
      .mockReturnValueOnce(false) // slug
      .mockReturnValueOnce(true); // PROD confirm
    (confirm as unknown as jest.Mock).mockResolvedValueOnce(true);

    await runJournalPublishFlow(prodState);

    expect(cancel).toHaveBeenCalledWith("Publish cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("cancels if PROD confirmation is declined", async () => {
    const prodState = { env: "prod" } as any;

    (text as unknown as jest.Mock).mockResolvedValueOnce("slug");
    (isCancel as unknown as jest.Mock).mockReturnValue(false); // not cancelled
    (confirm as unknown as jest.Mock).mockResolvedValueOnce(false);

    await runJournalPublishFlow(prodState);

    expect(cancel).toHaveBeenCalledWith("Publish cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("calls validate and publish in normal flow (non-PROD)", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("slug");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runJournalPublishFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledTimes(2);
    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(1, {
      env: "dev",
      entity: "journal",
      action: "validate",
      slug: "slug",
    });
    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(2, {
      env: "dev",
      entity: "journal",
      action: "publish",
      slug: "slug",
    });
  });

  it("calls validate and publish in normal flow (PROD)", async () => {
    const prodState = { env: "prod" } as any;

    (text as unknown as jest.Mock).mockResolvedValueOnce("slug");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);
    (confirm as unknown as jest.Mock).mockResolvedValueOnce(true);

    await runJournalPublishFlow(prodState);

    expect(runInteractiveContentCommand).toHaveBeenCalledTimes(2);
    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(1, {
      env: "prod",
      entity: "journal",
      action: "validate",
      slug: "slug",
    });
    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(2, {
      env: "prod",
      entity: "journal",
      action: "publish",
      slug: "slug",
    });
  });
});
