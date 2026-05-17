// tests/src/cli/interactive/flows/photo/status.photo.flow.interactive.cli.test.ts

import { runPhotoStatusFlow } from "@content-cli/cli/interactive/flows/photo/status.photo.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runPhotoStatusFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls runInteractiveContentCommand with correct parameters", async () => {
    await runPhotoStatusFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledTimes(1);
    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "photo",
      action: "status",
    });
  });
});
