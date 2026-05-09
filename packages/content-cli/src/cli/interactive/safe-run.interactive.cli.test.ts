// packages/content-cli/src/cli/interactive/safe-run.interactive.cli.test.ts

import { safeRunInteractiveStep } from "@content-cli/cli/interactive/safe-run.interactive.cli";
import { note } from "@clack/prompts";

jest.mock("@clack/prompts", () => ({
  note: jest.fn(),
}));

describe("safeRunInteractiveStep", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when step resolves successfully", async () => {
    const step = jest.fn(async () => {});
    const result = await safeRunInteractiveStep("Test Step", step);
    expect(result).toBe(true);
    expect(step).toHaveBeenCalled();
    expect(note).not.toHaveBeenCalled();
  });

  it("returns false and calls note when step throws an Error", async () => {
    const step = jest.fn(async () => {
      throw new Error("Boom");
    });
    const result = await safeRunInteractiveStep("Test Step", step);
    expect(result).toBe(false);
    expect(note).toHaveBeenCalledWith("Boom", "⚠ Test Step failed");
  });

  it("returns false and calls note when step throws a non-Error value", async () => {
    const step = jest.fn(async () => {
      throw "Something went wrong";
    });
    const result = await safeRunInteractiveStep("Test Step", step);
    expect(result).toBe(false);
    expect(note).toHaveBeenCalledWith(
      "Unknown interactive CLI error.",
      "⚠ Test Step failed",
    );
  });
});
