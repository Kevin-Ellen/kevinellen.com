// src/tools/authored-content-generator/publish/journal/journal.publish.test.ts

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { ContentAuthored } from "../../../../content-schema/content/content.content-schema.authored.type";
import type { ContentAppInit } from "../../../../shared/types/content/content.shared.app-init.type";

import { publishJournal } from "./journal.publish";

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

const mockedReadFile = jest.mocked(readFile);

type Publisher = Parameters<typeof publishJournal>[0]["publisher"];

describe("Journal publishing", () => {
  const directory = "/journals/example";

  const authoredPath = resolve(directory, "artifacts", "journal.authored.json");

  const appInitPath = resolve(directory, "artifacts", "journal.app-init.json");

  const createAuthored = (
    overrides: Record<string, unknown> = {},
  ): ContentAuthored =>
    ({
      id: "journal-example",
      kind: "public",
      pageType: "journalEntry",
      ...overrides,
    }) as ContentAuthored;

  const createAppInit = (
    overrides: Record<string, unknown> = {},
  ): ContentAppInit =>
    ({
      id: "journal-example",
      kind: "public",
      pageType: "journalEntry",
      ...overrides,
    }) as ContentAppInit;

  let authored: ContentAuthored;
  let appInit: ContentAppInit;
  let publisher: {
    getAuthored: jest.MockedFunction<Publisher["getAuthored"]>;
    putAuthored: jest.MockedFunction<Publisher["putAuthored"]>;
    getAppInit: jest.MockedFunction<Publisher["getAppInit"]>;
    putAppInit: jest.MockedFunction<Publisher["putAppInit"]>;
  };

  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    jest.resetAllMocks();

    authored = createAuthored();
    appInit = createAppInit();

    mockedReadFile.mockImplementation(async (path) => {
      if (String(path) === authoredPath) {
        return JSON.stringify(authored);
      }

      if (String(path) === appInitPath) {
        return JSON.stringify(appInit);
      }

      throw new Error(`Unexpected artifact: ${String(path)}`);
    });

    publisher = {
      getAuthored: jest.fn<
        ReturnType<Publisher["getAuthored"]>,
        Parameters<Publisher["getAuthored"]>
      >(async (_id) => null),

      putAuthored: jest.fn<
        ReturnType<Publisher["putAuthored"]>,
        Parameters<Publisher["putAuthored"]>
      >(async (_journal) => {}),

      getAppInit: jest.fn<
        ReturnType<Publisher["getAppInit"]>,
        Parameters<Publisher["getAppInit"]>
      >(async (_id) => null),

      putAppInit: jest.fn<
        ReturnType<Publisher["putAppInit"]>,
        Parameters<Publisher["putAppInit"]>
      >(async (_journal) => {}),
    };

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  const publish = async (): Promise<void> =>
    publishJournal({ directory, publisher });

  it("reads both journal artifacts", async () => {
    await publish();

    expect(mockedReadFile).toHaveBeenCalledWith(authoredPath, "utf8");

    expect(mockedReadFile).toHaveBeenCalledWith(appInitPath, "utf8");

    expect(mockedReadFile).toHaveBeenCalledTimes(2);
  });

  it("publishes both representations in order", async () => {
    await publish();

    expect(publisher.putAuthored).toHaveBeenCalledWith(authored);
    expect(publisher.putAppInit).toHaveBeenCalledWith(appInit);

    expect(publisher.putAuthored.mock.invocationCallOrder[0]).toBeLessThan(
      publisher.putAppInit.mock.invocationCallOrder[0],
    );
  });

  it("does not read existing KV values", async () => {
    await publish();

    expect(publisher.getAuthored).not.toHaveBeenCalled();
    expect(publisher.getAppInit).not.toHaveBeenCalled();
  });

  it.each([
    ["authored is null", "authored", null],
    ["authored is an array", "authored", []],
    ["AppInit is null", "appInit", null],
    ["AppInit is an array", "appInit", []],
    [
      "authored ID is missing",
      "authored",
      { kind: "public", pageType: "journalEntry" },
    ],
    ["authored ID is not a string", "authored", { id: 123 }],
    ["authored ID is empty", "authored", { id: "" }],
    [
      "AppInit ID is missing",
      "appInit",
      { kind: "public", pageType: "journalEntry" },
    ],
    ["AppInit ID is not a string", "appInit", { id: 123 }],
    ["AppInit ID is empty", "appInit", { id: "" }],
  ] as const)(
    "rejects invalid journal artifact identity: %s",
    async (_scenario, source, invalidValue) => {
      mockedReadFile.mockImplementation(async (path) => {
        if (String(path) === authoredPath) {
          return JSON.stringify(
            source === "authored" ? invalidValue : authored,
          );
        }

        if (String(path) === appInitPath) {
          return JSON.stringify(source === "appInit" ? invalidValue : appInit);
        }

        throw new Error(`Unexpected artifact: ${String(path)}`);
      });

      await expect(publish()).rejects.toThrow(
        "Invalid journal artifact identity",
      );

      expect(publisher.putAuthored).not.toHaveBeenCalled();
      expect(publisher.putAppInit).not.toHaveBeenCalled();
      expect(logSpy).not.toHaveBeenCalled();
    },
  );

  it("logs publication", async () => {
    await publish();

    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      "Publishing journal: journal-example",
    );

    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      "✓ Journal published: journal-example",
    );
  });

  it("rejects mismatched artifact IDs", async () => {
    appInit = createAppInit({ id: "wrong-id" });

    await expect(publish()).rejects.toThrow(
      'Journal artifact ID mismatch: "journal-example" !== "wrong-id"',
    );

    expect(publisher.putAuthored).not.toHaveBeenCalled();
    expect(publisher.putAppInit).not.toHaveBeenCalled();
  });

  it("rejects non-public journals", async () => {
    authored = createAuthored({ kind: "private" });

    await expect(publish()).rejects.toThrow("Expected a public journal entry");

    expect(publisher.putAuthored).not.toHaveBeenCalled();
  });

  it("rejects non-journal content", async () => {
    authored = createAuthored({ pageType: "page" });

    await expect(publish()).rejects.toThrow("Expected a public journal entry");

    expect(publisher.putAuthored).not.toHaveBeenCalled();
  });

  it.each(["authored", "appInit"])(
    "propagates %s artifact read failures",
    async (source) => {
      const error = new Error("File unavailable");

      mockedReadFile.mockImplementation(async (path) => {
        if (
          String(path) === (source === "authored" ? authoredPath : appInitPath)
        ) {
          throw error;
        }

        return JSON.stringify(source === "authored" ? appInit : authored);
      });

      await expect(publish()).rejects.toBe(error);

      expect(publisher.putAuthored).not.toHaveBeenCalled();
      expect(publisher.putAppInit).not.toHaveBeenCalled();
    },
  );

  it.each(["authored", "appInit"])(
    "rejects malformed %s JSON",
    async (source) => {
      mockedReadFile.mockImplementation(async (path) => {
        if (
          String(path) === (source === "authored" ? authoredPath : appInitPath)
        ) {
          return "{invalid";
        }

        return JSON.stringify(source === "authored" ? appInit : authored);
      });

      await expect(publish()).rejects.toThrow(SyntaxError);

      expect(publisher.putAuthored).not.toHaveBeenCalled();
    },
  );

  it("stops when authored KV publication fails", async () => {
    const error = new Error("Authored KV unavailable");

    publisher.putAuthored.mockRejectedValue(error);

    await expect(publish()).rejects.toBe(error);

    expect(publisher.putAppInit).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalledWith(
      "✓ Journal published: journal-example",
    );
  });

  it("propagates AppInit KV publication failures", async () => {
    const error = new Error("AppInit KV unavailable");

    publisher.putAppInit.mockRejectedValue(error);

    await expect(publish()).rejects.toBe(error);

    expect(publisher.putAuthored).toHaveBeenCalledTimes(1);

    expect(logSpy).not.toHaveBeenCalledWith(
      "✓ Journal published: journal-example",
    );
  });
});
