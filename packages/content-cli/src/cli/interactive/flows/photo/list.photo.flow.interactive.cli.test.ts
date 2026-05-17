// tests/src/cli/interactive/flows/photo/list.photo.flow.interactive.cli.test.ts

import { runPhotoListFlow } from "@content-cli/cli/interactive/flows/photo/list.photo.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runPhotoListFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls runInteractiveContentCommand with correct parameters", async () => {
    await runPhotoListFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledTimes(1);
    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "photo",
      action: "list",
    });
  });
});
