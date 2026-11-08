// src/tools/authored-content-generator/validate/validate.test.ts

import type {
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";

import { resolve } from "node:path";

import type { validatePhoto } from "./photo/photo.validate";
import type { validateJournal } from "./journal/journal.validate";
import type { importAuthored } from "./import-authored.validate";

jest.mock("node:fs/promises", () => ({
  mkdtemp: jest.fn(),
  readFile: jest.fn(),
  rename: jest.fn(),
  rm: jest.fn(),
  writeFile: jest.fn(),
}));

jest.mock("./import-authored.validate", () => ({
  importAuthored: jest.fn(),
}));

jest.mock("./photo/photo.validate", () => ({
  validatePhoto: jest.fn(),
}));

jest.mock("./journal/journal.validate", () => ({
  validateJournal: jest.fn(),
}));

type Dependencies = {
  mkdtemp: jest.MockedFunction<typeof mkdtemp>;
  readFile: jest.MockedFunction<typeof readFile>;
  rename: jest.MockedFunction<typeof rename>;
  rm: jest.MockedFunction<typeof rm>;
  writeFile: jest.MockedFunction<typeof writeFile>;
  importAuthored: jest.MockedFunction<typeof importAuthored>;
  validatePhoto: jest.MockedFunction<typeof validatePhoto>;
  validateJournal: jest.MockedFunction<typeof validateJournal>;
};

describe("Authored content validation CLI", () => {
  const workspace = "2026-11-04_09-07";

  const directory = resolve(
    process.cwd(),
    "authored-content",
    "journals",
    workspace,
  );

  const artifactsDirectory = resolve(directory, "artifacts");
  const stagingDirectory = resolve(directory, ".artifacts-test");
  const schemaPath = resolve(process.cwd(), "schema", "authored.schema.json");

  const schema = {
    definitions: {
      PhotoAssetAuthored: { type: "object" },
      ContentAuthored: { type: "object" },
    },
  };

  const journal = {
    id: workspace,
    photos: ["forest-fox", "wood-pigeon"],
  };

  const appInitJournal = { id: workspace, kind: "journal" };

  const originalArgv = process.argv;
  const originalExitCode = process.exitCode;

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

  const runValidation = async (
    args: string[] = [workspace],
    configure?: (mocks: Dependencies) => void,
  ): Promise<Dependencies> => {
    process.argv = [process.execPath, "validate.ts", ...args];

    let complete: () => void = () => {};

    const finished = new Promise<void>((resolveFinished) => {
      complete = resolveFinished;
    });

    logSpy.mockImplementation((message: unknown) => {
      if (
        typeof message === "string" &&
        message.startsWith("✓ Publication artifacts created:")
      ) {
        complete();
      }
    });

    errorSpy.mockImplementation(() => {
      complete();
    });

    let dependencies: Dependencies | undefined;

    await jest.isolateModulesAsync(async () => {
      const fs = jest.mocked(await import("node:fs/promises"));
      const importer = jest.mocked(await import("./import-authored.validate"));
      const photo = jest.mocked(await import("./photo/photo.validate"));
      const journalValidator = jest.mocked(
        await import("./journal/journal.validate"),
      );

      const mocks: Dependencies = {
        mkdtemp: fs.mkdtemp,
        readFile: fs.readFile,
        rename: fs.rename,
        rm: fs.rm,
        writeFile: fs.writeFile,
        importAuthored: importer.importAuthored,
        validatePhoto: photo.validatePhoto,
        validateJournal: journalValidator.validateJournal,
      };

      mocks.rm.mockResolvedValue(undefined);
      mocks.rename.mockResolvedValue(undefined);
      mocks.writeFile.mockResolvedValue(undefined);
      mocks.mkdtemp.mockResolvedValue(stagingDirectory);

      mocks.readFile.mockResolvedValue(JSON.stringify(schema));

      mocks.importAuthored.mockImplementation(async (filePath, exportName) => {
        if (exportName === "journal") {
          return journal;
        }

        const id = filePath.split("/").at(-1)?.replace(/\.ts$/, "");

        return { id };
      });

      mocks.validatePhoto.mockImplementation(
        ({ photo: authored }) =>
          ({
            authored,
            appInit: {
              id: (authored as { id: string }).id,
            },
          }) as ReturnType<typeof validatePhoto>,
      );

      mocks.validateJournal.mockReturnValue({
        authored: journal,
        appInit: appInitJournal,
      } as never);

      configure?.(mocks);

      dependencies = mocks;

      await import("./validate");
      await finished;
    });

    if (!dependencies) {
      throw new Error("Validation mocks were not initialised");
    }

    return dependencies;
  };

  describe("Workspace arguments", () => {
    it.each<{ args: string[] }>([
      { args: [] },
      { args: ["."] },
      { args: [".."] },
      { args: ["nested/workspace"] },
      { args: ["../other"] },
      { args: ["/absolute/path"] },
    ])("rejects invalid workspace arguments $args", async ({ args }) => {
      const mocks = await runValidation(args);

      expect(errorSpy).toHaveBeenCalledWith(
        new Error("Valid journal workspace argument is required"),
      );

      expect(process.exitCode).toBe(1);
      expect(mocks.rm).not.toHaveBeenCalled();
      expect(mocks.readFile).not.toHaveBeenCalled();
    });

    it("accepts a valid workspace argument", async () => {
      const mocks = await runValidation();

      expect(mocks.rm).toHaveBeenCalledWith(artifactsDirectory, {
        recursive: true,
        force: true,
      });

      expect(process.exitCode).toBe(0);
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe("Schema preparation", () => {
    it("reads the generated authored schema", async () => {
      const mocks = await runValidation();

      expect(mocks.readFile).toHaveBeenCalledWith(schemaPath, "utf8");
    });

    it("propagates schema read failures", async () => {
      const error = new Error("Schema file missing");

      const mocks = await runValidation([workspace], ({ readFile }) => {
        readFile.mockRejectedValue(error);
      });

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(process.exitCode).toBe(1);
      expect(mocks.importAuthored).not.toHaveBeenCalled();
      expect(mocks.mkdtemp).not.toHaveBeenCalled();
    });

    it("rejects malformed JSON schemas", async () => {
      const mocks = await runValidation([workspace], ({ readFile }) => {
        readFile.mockResolvedValue("{invalid");
      });

      expect(errorSpy).toHaveBeenCalledWith(expect.any(SyntaxError));

      expect(process.exitCode).toBe(1);
      expect(mocks.importAuthored).not.toHaveBeenCalled();
    });

    it("rejects schema compilation failures", async () => {
      const mocks = await runValidation([workspace], ({ readFile }) => {
        readFile.mockResolvedValue(JSON.stringify({ definitions: {} }));
      });

      expect(errorSpy).toHaveBeenCalledWith(expect.any(Error));

      expect(process.exitCode).toBe(1);
      expect(mocks.importAuthored).not.toHaveBeenCalled();
    });
  });

  describe("Journal and photo imports", () => {
    it("imports the journal from its workspace", async () => {
      const mocks = await runValidation();

      expect(mocks.importAuthored).toHaveBeenCalledWith(
        resolve(directory, "journal.ts"),
        "journal",
      );
    });

    it.each([
      null,
      "invalid",
      {},
      { photos: null },
      { photos: "forest-fox" },
      { photos: [123] },
      { photos: ["forest-fox", null] },
    ])("rejects invalid photo inventories %#", async (value) => {
      const mocks = await runValidation([workspace], ({ importAuthored }) => {
        importAuthored.mockResolvedValue(value);
      });

      expect(errorSpy).toHaveBeenCalledWith(
        new Error("Journal requires a valid photograph inventory"),
      );

      expect(process.exitCode).toBe(1);
      expect(mocks.validatePhoto).not.toHaveBeenCalled();
      expect(mocks.mkdtemp).not.toHaveBeenCalled();
    });

    it.each(["", ".", "..", "nested/photo", "nested\\photo"])(
      "rejects unsafe photo ID %s",
      async (id) => {
        const mocks = await runValidation([workspace], ({ importAuthored }) => {
          importAuthored.mockResolvedValue({
            ...journal,
            photos: [id],
          });
        });

        expect(errorSpy).toHaveBeenCalledWith(
          new Error(`Invalid photograph ID: "${id}"`),
        );

        expect(process.exitCode).toBe(1);
        expect(mocks.validatePhoto).not.toHaveBeenCalled();
      },
    );

    it("imports each photograph in inventory order", async () => {
      const mocks = await runValidation();

      expect(mocks.importAuthored).toHaveBeenNthCalledWith(
        1,
        resolve(directory, "journal.ts"),
        "journal",
      );

      expect(mocks.importAuthored).toHaveBeenNthCalledWith(
        2,
        resolve(directory, "forest-fox.ts"),
        "photo",
      );

      expect(mocks.importAuthored).toHaveBeenNthCalledWith(
        3,
        resolve(directory, "wood-pigeon.ts"),
        "photo",
      );
    });

    it("passes each photo through schema validation", async () => {
      const mocks = await runValidation();

      expect(mocks.validatePhoto).toHaveBeenCalledTimes(2);

      expect(mocks.validatePhoto).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          photo: { id: "forest-fox" },
          expectedId: "forest-fox",
          validateSchema: expect.any(Function),
        }),
      );

      expect(mocks.validatePhoto).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          photo: { id: "wood-pigeon" },
          expectedId: "wood-pigeon",
          validateSchema: expect.any(Function),
        }),
      );
    });

    it("passes the prepared inventory into journal validation", async () => {
      const mocks = await runValidation();

      expect(mocks.validateJournal).toHaveBeenCalledWith({
        journal,
        photos: [
          {
            authored: { id: "forest-fox" },
            appInit: { id: "forest-fox" },
          },
          {
            authored: { id: "wood-pigeon" },
            appInit: { id: "wood-pigeon" },
          },
        ],
        validateSchema: expect.any(Function),
      });
    });

    it("stops when a photo fails validation", async () => {
      const error = new Error("Photo validation failed");

      const mocks = await runValidation([workspace], ({ validatePhoto }) => {
        validatePhoto.mockImplementation(() => {
          throw error;
        });
      });

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(mocks.validateJournal).not.toHaveBeenCalled();
      expect(mocks.mkdtemp).not.toHaveBeenCalled();
    });

    it("stops when journal validation fails", async () => {
      const error = new Error("Journal validation failed");

      const mocks = await runValidation([workspace], ({ validateJournal }) => {
        validateJournal.mockImplementation(() => {
          throw error;
        });
      });

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(mocks.mkdtemp).not.toHaveBeenCalled();
    });

    it("supports an empty inventory at the orchestration boundary", async () => {
      const mocks = await runValidation([workspace], ({ importAuthored }) => {
        importAuthored.mockResolvedValue({
          ...journal,
          photos: [],
        });
      });

      expect(mocks.validatePhoto).not.toHaveBeenCalled();
      expect(mocks.validateJournal).toHaveBeenCalledTimes(1);
    });
  });

  describe("Artifact publication", () => {
    it("invalidates previous artifacts before validation", async () => {
      const mocks = await runValidation();

      expect(mocks.rm).toHaveBeenCalledWith(artifactsDirectory, {
        recursive: true,
        force: true,
      });

      expect(mocks.rm.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.readFile.mock.invocationCallOrder[0],
      );
    });

    it("creates staging only after successful validation", async () => {
      const mocks = await runValidation();

      expect(mocks.mkdtemp).toHaveBeenCalledWith(
        resolve(directory, ".artifacts-"),
      );

      expect(mocks.validateJournal.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.mkdtemp.mock.invocationCallOrder[0],
      );
    });

    it("writes journal and photo artifacts", async () => {
      const mocks = await runValidation();

      const writtenPaths = mocks.writeFile.mock.calls.map(
        ([filePath]) => filePath,
      );

      expect(writtenPaths).toEqual([
        resolve(stagingDirectory, "journal.authored.json"),
        resolve(stagingDirectory, "journal.app-init.json"),
        resolve(stagingDirectory, "forest-fox.authored.json"),
        resolve(stagingDirectory, "forest-fox.app-init.json"),
        resolve(stagingDirectory, "wood-pigeon.authored.json"),
        resolve(stagingDirectory, "wood-pigeon.app-init.json"),
      ]);

      expect(mocks.writeFile).toHaveBeenCalledWith(
        resolve(stagingDirectory, "journal.authored.json"),
        `${JSON.stringify(journal, null, 2)}\n`,
        "utf8",
      );

      expect(mocks.writeFile).toHaveBeenCalledWith(
        resolve(stagingDirectory, "journal.app-init.json"),
        `${JSON.stringify(appInitJournal, null, 2)}\n`,
        "utf8",
      );
    });

    it("publishes staging only after writes finish", async () => {
      const mocks = await runValidation();

      expect(mocks.rename).toHaveBeenCalledWith(
        stagingDirectory,
        artifactsDirectory,
      );

      const lastWrite = Math.max(...mocks.writeFile.mock.invocationCallOrder);

      expect(lastWrite).toBeLessThan(mocks.rename.mock.invocationCallOrder[0]);
    });

    it("logs successful artifact publication", async () => {
      await runValidation();

      expect(logSpy).toHaveBeenCalledWith(
        `✓ Publication artifacts created: ${artifactsDirectory}`,
      );

      expect(logSpy).toHaveBeenCalledWith(`  Journal: ${workspace}`);

      expect(logSpy).toHaveBeenCalledWith("  Photos: 2");

      expect(errorSpy).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(0);
    });

    it("removes staging when artifact writing fails", async () => {
      const error = new Error("Disk full");

      const mocks = await runValidation([workspace], ({ writeFile }) => {
        writeFile.mockRejectedValue(error);
      });

      expect(mocks.rm).toHaveBeenCalledWith(stagingDirectory, {
        recursive: true,
        force: true,
      });

      expect(mocks.rename).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(process.exitCode).toBe(1);
    });

    it("removes staging when publication rename fails", async () => {
      const error = new Error("Rename failed");

      const mocks = await runValidation([workspace], ({ rename }) => {
        rename.mockRejectedValue(error);
      });

      expect(mocks.rm).toHaveBeenCalledWith(stagingDirectory, {
        recursive: true,
        force: true,
      });

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(process.exitCode).toBe(1);
    });

    it("does not publish when staging creation fails", async () => {
      const error = new Error("Cannot create staging directory");

      const mocks = await runValidation([workspace], ({ mkdtemp }) => {
        mkdtemp.mockRejectedValue(error);
      });

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(mocks.writeFile).not.toHaveBeenCalled();
      expect(mocks.rename).not.toHaveBeenCalled();
    });

    it("stops when previous artifact removal fails", async () => {
      const error = new Error("Cannot remove old artifacts");

      const mocks = await runValidation([workspace], ({ rm }) => {
        rm.mockRejectedValue(error);
      });

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(mocks.readFile).not.toHaveBeenCalled();
      expect(mocks.mkdtemp).not.toHaveBeenCalled();
    });
  });
});
