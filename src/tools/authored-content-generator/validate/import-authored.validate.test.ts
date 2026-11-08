// src/tools/authored-content-generator/validate/import-authored.validate.test.ts

import { pathToFileURL } from "node:url";

import { importAuthored } from "./import-authored.validate";

jest.mock("node:url", () => ({
  ...jest.requireActual("node:url"),
  pathToFileURL: jest.fn(),
}));

jest.mock(
  "./import-authored.fixture",
  () => ({
    journal: {
      id: "2026-11-04_09-07",
      kind: "public",
    },
    photo: {
      id: "forest-fox",
      sourceFileName: "forest-fox.jpg",
    },
  }),
  { virtual: true },
);

const mockedPathToFileURL = jest.mocked(pathToFileURL);

describe("Authored module importer", () => {
  const directory = "/authored-content/journals/example";

  const setModulePath = (modulePath: string): void => {
    mockedPathToFileURL.mockReturnValue({
      href: modulePath,
    } as ReturnType<typeof pathToFileURL>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setModulePath("./import-authored.fixture");
  });

  it("converts the filesystem path into a module URL", async () => {
    const filePath = `${directory}/journal.ts`;

    await importAuthored(filePath, "journal");

    expect(mockedPathToFileURL).toHaveBeenCalledWith(filePath);

    expect(mockedPathToFileURL).toHaveBeenCalledTimes(1);
  });

  it("imports the journal export", async () => {
    const result = await importAuthored(`${directory}/journal.ts`, "journal");

    expect(result).toEqual({
      id: "2026-11-04_09-07",
      kind: "public",
    });
  });

  it("imports the photo export", async () => {
    const result = await importAuthored(`${directory}/forest-fox.ts`, "photo");

    expect(result).toEqual({
      id: "forest-fox",
      sourceFileName: "forest-fox.jpg",
    });
  });

  it("rejects missing named exports", async () => {
    const filePath = `${directory}/journal.ts`;

    await expect(importAuthored(filePath, "missing")).rejects.toThrow(
      `Missing "missing" export in ${filePath}`,
    );
  });

  it("propagates module import failures", async () => {
    setModulePath("./missing-authored.fixture");

    await expect(
      importAuthored(`${directory}/missing.ts`, "photo"),
    ).rejects.toThrow();
  });
});
