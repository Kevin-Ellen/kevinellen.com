// src/tools/authored-content-generator/prepare/prepare.test.ts

import type { stat } from "node:fs/promises";
import { resolve } from "node:path";

import type { preparePhotos } from "./photo/photo.prepare";
import type { prepareJournal } from "./journal.prepare";

jest.mock("node:fs/promises", () => ({
  stat: jest.fn(),
}));

jest.mock("./photo/photo.prepare", () => ({
  preparePhotos: jest.fn(),
}));

jest.mock("./journal.prepare", () => ({
  prepareJournal: jest.fn(),
}));

type MockDependencies = {
  stat: jest.MockedFunction<typeof stat>;
  preparePhotos: jest.MockedFunction<typeof preparePhotos>;
  prepareJournal: jest.MockedFunction<typeof prepareJournal>;
};

describe("Authored content preparation CLI", () => {
  const originalArgv = process.argv;
  const originalExitCode = process.exitCode;

  const workspace = "2026-11-04_09-07";

  const directory = resolve(
    process.cwd(),
    "authored-content",
    "journals",
    workspace,
  );

  let logSpy: jest.SpiedFunction<typeof console.log>;
  let errorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    jest.clearAllMocks();

    process.exitCode = 0;

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exitCode = originalExitCode;

    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  const runPrepare = async (
    args: string[],
    configure?: (dependencies: MockDependencies) => void,
  ): Promise<MockDependencies> => {
    process.argv = [process.execPath, "prepare.ts", ...args];

    let complete: () => void = () => {};

    const finished = new Promise<void>((resolveFinished) => {
      complete = resolveFinished;
    });

    logSpy.mockImplementation((message: unknown) => {
      if (message === "🦅 Preparation complete") {
        complete();
      }
    });

    errorSpy.mockImplementation(() => {
      complete();
    });

    const state: {
      dependencies: MockDependencies | null;
    } = {
      dependencies: null,
    };

    await jest.isolateModulesAsync(async () => {
      const fs = jest.mocked(await import("node:fs/promises"));

      const photos = jest.mocked(await import("./photo/photo.prepare"));

      const journal = jest.mocked(await import("./journal.prepare"));

      const dependencies: MockDependencies = {
        stat: fs.stat,
        preparePhotos: photos.preparePhotos,
        prepareJournal: journal.prepareJournal,
      };

      dependencies.stat.mockResolvedValue({
        isDirectory: () => true,
      } as Awaited<ReturnType<typeof stat>>);

      dependencies.preparePhotos.mockResolvedValue([
        "forest-fox",
        "wood-pigeon",
      ]);

      dependencies.prepareJournal.mockResolvedValue(undefined);

      configure?.(dependencies);

      state.dependencies = dependencies;

      await import("./prepare");
      await finished;
    });

    if (!state.dependencies) {
      throw new Error("Preparation mocks were not initialised");
    }

    return state.dependencies;
  };

  describe("CLI arguments", () => {
    it("rejects a missing workspace", async () => {
      const mocks = await runPrepare([]);

      expect(errorSpy).toHaveBeenCalledWith(
        new Error("Journal workspace argument is required"),
      );

      expect(process.exitCode).toBe(1);

      expect(mocks.stat).not.toHaveBeenCalled();
      expect(mocks.preparePhotos).not.toHaveBeenCalled();
      expect(mocks.prepareJournal).not.toHaveBeenCalled();
    });

    it("rejects a flag as the workspace", async () => {
      const mocks = await runPrepare(["--help"]);

      expect(errorSpy).toHaveBeenCalledWith(
        new Error("Journal workspace argument is required"),
      );

      expect(process.exitCode).toBe(1);
      expect(mocks.stat).not.toHaveBeenCalled();
    });

    it("rejects unsupported preparation flags", async () => {
      const mocks = await runPrepare([workspace, "--force", "--verbose"]);

      expect(errorSpy).toHaveBeenCalledWith(
        new Error("Unsupported preparation options: --force, --verbose"),
      );

      expect(process.exitCode).toBe(1);
      expect(mocks.stat).not.toHaveBeenCalled();
    });

    it("accepts a single workspace argument", async () => {
      const mocks = await runPrepare([workspace]);

      expect(mocks.stat).toHaveBeenCalledWith(directory);
      expect(process.exitCode).toBe(0);

      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe("Workspace validation", () => {
    it("rejects a missing workspace directory", async () => {
      const mocks = await runPrepare([workspace], ({ stat }) => {
        stat.mockRejectedValue(
          Object.assign(new Error("Not found"), {
            code: "ENOENT",
          }),
        );
      });

      expect(errorSpy).toHaveBeenCalledWith(
        new Error(`Journal workspace not found: ${directory}`),
      );

      expect(process.exitCode).toBe(1);

      expect(mocks.preparePhotos).not.toHaveBeenCalled();
      expect(mocks.prepareJournal).not.toHaveBeenCalled();
    });

    it("rejects a workspace path that is not a directory", async () => {
      const mocks = await runPrepare([workspace], ({ stat }) => {
        stat.mockResolvedValue({
          isDirectory: () => false,
        } as Awaited<ReturnType<typeof stat>>);
      });

      expect(errorSpy).toHaveBeenCalledWith(
        new Error(`Journal workspace not found: ${directory}`),
      );

      expect(process.exitCode).toBe(1);

      expect(mocks.preparePhotos).not.toHaveBeenCalled();
      expect(mocks.prepareJournal).not.toHaveBeenCalled();
    });

    it("handles workspace stat failures", async () => {
      const mocks = await runPrepare([workspace], ({ stat }) => {
        stat.mockRejectedValue(new Error("Permission denied"));
      });

      expect(errorSpy).toHaveBeenCalledWith(
        new Error(`Journal workspace not found: ${directory}`),
      );

      expect(process.exitCode).toBe(1);

      expect(mocks.preparePhotos).not.toHaveBeenCalled();
    });
  });

  describe("Preparation workflow", () => {
    it("prepares photographs before the journal", async () => {
      const mocks = await runPrepare([workspace]);

      expect(mocks.preparePhotos).toHaveBeenCalledWith({
        directory,
      });

      expect(mocks.prepareJournal).toHaveBeenCalledWith({
        directory,
        photoIds: ["forest-fox", "wood-pigeon"],
      });

      expect(mocks.preparePhotos.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.prepareJournal.mock.invocationCallOrder[0],
      );
    });

    it("passes an empty photo inventory through to journal preparation", async () => {
      const mocks = await runPrepare([workspace], ({ preparePhotos }) => {
        preparePhotos.mockResolvedValue([]);
      });

      expect(mocks.prepareJournal).toHaveBeenCalledWith({
        directory,
        photoIds: [],
      });
    });

    it("logs the workspace and successful completion", async () => {
      await runPrepare([workspace]);

      expect(logSpy).toHaveBeenCalledWith(
        `🦆 Preparing journal workspace: ${workspace}`,
      );

      expect(logSpy).toHaveBeenCalledWith("🦅 Preparation complete");

      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it("propagates photo preparation failures to the CLI handler", async () => {
      const error = new Error("EXIF extraction failed");

      const mocks = await runPrepare([workspace], ({ preparePhotos }) => {
        preparePhotos.mockRejectedValue(error);
      });

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(process.exitCode).toBe(1);

      expect(mocks.prepareJournal).not.toHaveBeenCalled();

      expect(logSpy).not.toHaveBeenCalledWith("🦅 Preparation complete");
    });

    it("propagates journal preparation failures to the CLI handler", async () => {
      const error = new Error("Journal draft failed");

      const mocks = await runPrepare([workspace], ({ prepareJournal }) => {
        prepareJournal.mockRejectedValue(error);
      });

      expect(mocks.preparePhotos).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(process.exitCode).toBe(1);

      expect(logSpy).not.toHaveBeenCalledWith("🦅 Preparation complete");
    });

    it("finishes successfully when both preparation stages resolve", async () => {
      const mocks = await runPrepare([workspace]);

      expect(mocks.preparePhotos).toHaveBeenCalledTimes(1);
      expect(mocks.prepareJournal).toHaveBeenCalledTimes(1);

      expect(process.exitCode).toBe(0);
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });
});
