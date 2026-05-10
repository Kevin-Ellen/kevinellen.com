// packages/content-cli/src/cli/content.cli.test.ts

import { runCli } from "@content-cli/cli/run.cli";
import { jest } from "@jest/globals";

jest.mock("@content-cli/cli/run.cli", () => ({
  runCli: jest.fn(),
}));

describe("content CLI entrypoint", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls runCli with process.argv arguments sliced", () => {
    const mockArgv = ["node", "content.js", "arg1", "arg2"];
    const originalArgv = process.argv;
    process.argv = mockArgv;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    require("./content.cli");

    expect(runCli).toHaveBeenCalledWith(["arg1", "arg2"]);

    process.argv = originalArgv;
  });
});
