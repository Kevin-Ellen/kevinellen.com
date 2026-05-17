// packages/content-cli/src/cli/run.cli.test.ts

import { runCli } from "@content-cli/cli/run.cli";
import { parseCliArgs } from "@content-cli/cli/parse-args.cli";
import { runDirectCli } from "@content-cli/cli/direct.run.cli";
import { runInteractiveCli } from "@content-cli/cli/interactive.run.cli";

jest.mock("@content-cli/cli/parse-args.cli", () => ({
  parseCliArgs: jest.fn(),
}));
jest.mock("@content-cli/cli/direct.run.cli", () => ({
  runDirectCli: jest.fn(),
}));
jest.mock("@content-cli/cli/interactive.run.cli", () => ({
  runInteractiveCli: jest.fn(),
}));

describe("runCli", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls runInteractiveCli when mode is interactive", async () => {
    (parseCliArgs as jest.Mock).mockReturnValue({
      mode: "interactive",
      env: "dev",
    });

    await runCli(["arg1"]);

    expect(runInteractiveCli).toHaveBeenCalledWith({
      mode: "interactive",
      env: "dev",
    });
    expect(runDirectCli).not.toHaveBeenCalled();
  });

  it("calls runDirectCli when mode is direct", async () => {
    (parseCliArgs as jest.Mock).mockReturnValue({
      mode: "direct",
      entity: "journal",
      action: "create",
      env: "dev",
      bucket: "drafts",
    });

    await runCli(["arg1"]);

    expect(runDirectCli).toHaveBeenCalledWith({
      mode: "direct",
      entity: "journal",
      action: "create",
      env: "dev",
      bucket: "drafts",
    });
    expect(runInteractiveCli).not.toHaveBeenCalled();
  });
});
