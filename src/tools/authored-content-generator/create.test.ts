// src/tools/authored-content-generator/create.test.ts

import type { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

jest.mock("node:fs/promises", () => ({
  mkdir: jest.fn(),
}));

type MockedMkdir = jest.MockedFunction<typeof mkdir>;

describe("Authored content generator", () => {
  const draftsDirectory = resolve(
    process.cwd(),
    "authored-content",
    "journals",
  );

  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    jest.setSystemTime(new Date(2026, 10, 4, 9, 7));

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    jest.useRealTimers();
  });

  const runGenerator = async (): Promise<MockedMkdir> => {
    let complete: () => void = () => {};

    const finished = new Promise<void>((resolve) => {
      complete = resolve;
    });

    logSpy.mockImplementation(() => {
      complete();
    });

    let mkdirMock: MockedMkdir | undefined;

    await jest.isolateModulesAsync(async () => {
      const fs = jest.mocked(await import("node:fs/promises"));

      mkdirMock = fs.mkdir;

      await import("./create");
      await finished;
    });

    if (!mkdirMock) {
      throw new Error("Filesystem mock was not initialised");
    }

    return mkdirMock;
  };

  it("creates the journal draft directory structure", async () => {
    const mockedMkdir = await runGenerator();

    const draft = resolve(draftsDirectory, "2026-11-04_09-07");

    expect(mockedMkdir).toHaveBeenNthCalledWith(1, draftsDirectory, {
      recursive: true,
    });

    expect(mockedMkdir).toHaveBeenNthCalledWith(2, draft);

    expect(mockedMkdir).toHaveBeenNthCalledWith(3, resolve(draft, "photos"));

    expect(mockedMkdir).toHaveBeenCalledTimes(3);
  });

  it("logs the created journal directory", async () => {
    await runGenerator();

    expect(logSpy).toHaveBeenCalledWith(
      `Created journal folder: ${resolve(draftsDirectory, "2026-11-04_09-07")}`,
    );

    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("zero-pads single-digit dates and times", async () => {
    jest.setSystemTime(new Date(2026, 0, 3, 4, 5));

    const mockedMkdir = await runGenerator();

    expect(mockedMkdir).toHaveBeenNthCalledWith(
      2,
      resolve(draftsDirectory, "2026-01-03_04-05"),
    );
  });

  it("uses the current date for each execution", async () => {
    const firstMkdir = await runGenerator();

    expect(firstMkdir).toHaveBeenNthCalledWith(
      2,
      resolve(draftsDirectory, "2026-11-04_09-07"),
    );

    jest.setSystemTime(new Date(2026, 11, 25, 16, 30));

    const secondMkdir = await runGenerator();

    expect(secondMkdir).toHaveBeenNthCalledWith(
      2,
      resolve(draftsDirectory, "2026-12-25_16-30"),
    );

    expect(firstMkdir).not.toBe(secondMkdir);
  });
});
