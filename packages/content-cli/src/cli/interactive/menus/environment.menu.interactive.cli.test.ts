// tests/src/cli/interactive/menus/environment.menu.interactive.cli.test.ts

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

import { cancel, isCancel, select } from "@clack/prompts";

import { runEnvironmentInteractiveMenu } from "@content-cli/cli/interactive/menus/environment.menu.interactive.cli";

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  select: jest.fn(),
}));

describe("runEnvironmentInteractiveMenu", () => {
  let mockState: { env: ContentCliEnvironment };

  beforeEach(() => {
    mockState = { env: "dev" }; // dev is valid ContentCliEnvironment
    jest.clearAllMocks();
  });

  it("updates state.env when user selects an environment", async () => {
    (select as unknown as jest.Mock).mockResolvedValueOnce("stg");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runEnvironmentInteractiveMenu(mockState);

    expect(mockState.env).toBe("stg");
    expect(cancel).not.toHaveBeenCalled();
  });

  it("calls cancel if selection is cancelled", async () => {
    (select as unknown as jest.Mock).mockResolvedValueOnce("prod");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runEnvironmentInteractiveMenu(mockState);

    expect(mockState.env).toBe("dev"); // should remain unchanged
    expect(cancel).toHaveBeenCalledWith("Cancelled.");
  });
});
