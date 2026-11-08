// src/tools/authored-content-generator/publish/ledger/ledger.publish.test.ts

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { publishJournalLedger } from "./ledger.publish";

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

type WranglerResult = {
  stdout: string;
  stderr: string;
};

const mockWrangler = jest.fn<Promise<WranglerResult>, [readonly string[]]>();

jest.mock("node:util", () => ({
  ...jest.requireActual("node:util"),
  promisify: jest.fn(
    () =>
      async (_command: string, args: string[]): Promise<WranglerResult> =>
        mockWrangler(args.slice(4)),
  ),
}));

const mockedReadFile = jest.mocked(readFile);
const mockedWriteFile = jest.mocked(writeFile);

describe("Journal ledger publishing", () => {
  const directory = "/journals/example";
  const artifacts = resolve(directory, "artifacts");

  const authoredPath = resolve(artifacts, "journal.authored.json");

  const appInitPath = resolve(artifacts, "journal.app-init.json");

  const ledgerAuthoredPath = resolve(artifacts, "ledger.authored.json");

  const ledgerAppInitPath = resolve(artifacts, "ledger.app-init.json");

  const authoredKey = "ledger:authored:journal";
  const appInitKey = "ledger:appInit:journal";

  const createAuthored = (overrides: Record<string, unknown> = {}) => ({
    id: "forest-journal",
    kind: "public",
    pageType: "journalEntry",
    slug: "/journal/forest-journal",
    photos: ["forest-fox"],
    dates: { created: "2026-11-04" },
    label: "Forest journal",
    metadata: {
      title: "Woodland encounters",
      sitemap: true,
    },
    breadcrumbs: ["home", "journal", "forest-journal"],
    topics: ["wildlife"],
    body: {
      modules: [
        {
          kind: "pageIntro",
          description: "An autumn walk through the forest",
        },
      ],
    },
    ...overrides,
  });

  const createAppInit = (overrides: Record<string, unknown> = {}) => ({
    id: "forest-journal",
    kind: "public",
    pageType: "journalEntry",
    slug: "/journal/forest-journal",
    metadata: {
      title: "Woodland encounters",
      sitemap: true,
    },
    breadcrumbs: ["home", "journal", "forest-journal"],
    topics: ["wildlife"],
    ...overrides,
  });

  let authored: ReturnType<typeof createAuthored>;
  let appInit: ReturnType<typeof createAppInit>;

  let stored: Map<string, unknown>;
  let files: Map<string, string>;
  let logSpy: jest.SpiedFunction<typeof console.log>;

  const publish = (mode: "--local" | "--remote" = "--local") =>
    publishJournalLedger({ directory, mode });

  const wranglerArgs = (
    operation: string,
    key: string,
    mode: "--local" | "--remote",
  ): string[] => [operation, key, "--binding", "CONTENT_KV", mode, "--text"];

  beforeEach(() => {
    jest.resetAllMocks();

    authored = createAuthored();
    appInit = createAppInit();

    stored = new Map();
    files = new Map();

    mockedReadFile.mockImplementation(async (path) => {
      const key = String(path);

      if (key === authoredPath) {
        return JSON.stringify(authored);
      }

      if (key === appInitPath) {
        return JSON.stringify(appInit);
      }

      const value = files.get(key);

      if (value !== undefined) {
        return value;
      }

      throw new Error(`Unknown file: ${key}`);
    });

    mockedWriteFile.mockImplementation(async (path, content) => {
      files.set(String(path), String(content));
    });

    mockWrangler.mockImplementation(async (args) => {
      const [operation, key] = args;

      if (operation === "list") {
        return {
          stdout: JSON.stringify([...stored.keys()].map((name) => ({ name }))),
          stderr: "",
        };
      }

      if (operation === "get") {
        return {
          stdout: JSON.stringify(stored.get(key)),
          stderr: "",
        };
      }

      if (operation === "put") {
        const path = args[3];
        const value = files.get(path);

        if (value === undefined) {
          throw new Error(`Missing ledger file: ${path}`);
        }

        stored.set(key, JSON.parse(value));

        return { stdout: "", stderr: "" };
      }

      throw new Error(`Unexpected Wrangler operation: ${operation}`);
    });

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it.each([
    ["null response", null],
    ["object instead of array", {}],
    ["string instead of array", "invalid"],
    ["null entry", [null]],
    ["primitive entry", ["invalid"]],
    ["array entry", [[]]],
    ["missing name", [{}]],
    ["numeric name", [{ name: 123 }]],
    ["null name", [{ name: null }]],
  ])("rejects an invalid KV key list: %s", async (_scenario, keys) => {
    mockWrangler.mockImplementation(async (args) => {
      if (args[0] === "list") {
        return {
          stdout: JSON.stringify(keys),
          stderr: "",
        };
      }

      throw new Error(`Unexpected Wrangler operation: ${args[0]}`);
    });

    await expect(publish()).rejects.toThrow("Invalid KV key list");

    expect(mockWrangler).toHaveBeenCalledWith([
      "list",
      "--binding",
      "CONTENT_KV",
      "--local",
    ]);

    expect(mockedWriteFile).not.toHaveBeenCalled();

    expect(mockWrangler.mock.calls.some(([args]) => args[0] === "put")).toBe(
      false,
    );
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe("Artifact validation", () => {
    it.each([
      ["authored kind", { kind: "private" }, {}],
      ["AppInit kind", {}, { kind: "private" }],
      ["authored page type", { pageType: "page" }, {}],
      ["AppInit page type", {}, { pageType: "page" }],
      ["ID", {}, { id: "different-id" }],
      ["slug", {}, { slug: "/journal/other" }],
    ])(
      "rejects an invalid %s",
      async (_name, authoredOverrides, appInitOverrides) => {
        authored = createAuthored(authoredOverrides);
        appInit = createAppInit(appInitOverrides);

        await expect(publish()).rejects.toThrow(
          "Invalid journal content for ledger publication",
        );

        expect(mockWrangler).not.toHaveBeenCalled();
        expect(mockedWriteFile).not.toHaveBeenCalled();
      },
    );

    it("rejects an empty photo inventory", async () => {
      authored = createAuthored({ photos: [] });

      await expect(publish()).rejects.toThrow(
        'Journal "forest-journal" has no photograph inventory',
      );
    });

    it("rejects duplicate photograph IDs", async () => {
      authored = createAuthored({
        photos: ["forest-fox", "forest-fox"],
      });

      await expect(publish()).rejects.toThrow(
        'Journal "forest-journal" contains duplicate photographs',
      );
    });

    it("rejects missing introductions", async () => {
      authored = createAuthored({
        body: { modules: [] },
      });

      await expect(publish()).rejects.toThrow(
        "Missing journal introduction: forest-journal",
      );
    });

    it("rejects empty introduction descriptions", async () => {
      authored = createAuthored({
        body: {
          modules: [
            {
              kind: "pageIntro",
              description: "   ",
            },
          ],
        },
      });

      await expect(publish()).rejects.toThrow(
        "Missing journal introduction description: forest-journal",
      );
    });

    it("propagates artifact read failures", async () => {
      const error = new Error("Artifact unavailable");

      mockedReadFile.mockRejectedValue(error);

      await expect(publish()).rejects.toBe(error);

      expect(mockWrangler).not.toHaveBeenCalled();
    });

    it("rejects malformed artifact JSON", async () => {
      mockedReadFile.mockResolvedValue("{invalid");

      await expect(publish()).rejects.toThrow(SyntaxError);
    });
  });

  describe("Ledger construction", () => {
    it("creates both ledgers when no KV ledgers exist", async () => {
      await publish();

      const authoredLedger = JSON.parse(
        files.get(ledgerAuthoredPath) ?? "null",
      );

      const appInitLedger = JSON.parse(files.get(ledgerAppInitPath) ?? "null");

      expect(authoredLedger).toMatchObject({
        version: 1,
        entries: [
          {
            id: "forest-journal",
            kind: "journal",
            slug: "/journal/forest-journal",
            dateCreated: "2026-11-04",
            label: "Forest journal",
            sitemap: true,
            title: "Woodland encounters",
            intro: "An autumn walk through the forest",
            photos: ["forest-fox"],
            topics: ["wildlife"],
          },
        ],
      });

      expect(appInitLedger).toMatchObject({
        version: 1,
        entries: [
          {
            id: "forest-journal",
            kind: "journal",
            topics: ["wildlife"],
          },
        ],
      });
    });

    it("uses AppInit-specific presentation metadata", async () => {
      appInit = createAppInit({
        metadata: {
          title: "Resolved journal title",
          sitemap: false,
        },
        breadcrumbs: ["home", "journal", "resolved"],
        topics: ["nature"],
      });

      await publish();

      const ledger = JSON.parse(files.get(ledgerAppInitPath) ?? "null");

      expect(ledger.entries[0]).toMatchObject({
        title: "Resolved journal title",
        sitemap: false,
        breadcrumbs: ["home", "journal", "resolved"],
        topics: ["nature"],
      });
    });

    it("defaults missing authored topics to an empty array", async () => {
      authored = createAuthored({ topics: undefined });

      await publish();

      const ledger = JSON.parse(files.get(ledgerAuthoredPath) ?? "null");

      expect(ledger.entries[0].topics).toEqual([]);
    });

    it("replaces existing entries without duplicating them", async () => {
      stored.set(authoredKey, {
        version: 1,
        entries: [
          {
            id: "forest-journal",
            dateCreated: "2020-01-01",
            title: "Old title",
          },
        ],
      });

      stored.set(appInitKey, {
        version: 1,
        entries: [],
      });

      await publish();

      const ledger = JSON.parse(files.get(ledgerAuthoredPath) ?? "null");

      expect(ledger.entries).toHaveLength(1);
      expect(ledger.entries[0].title).toBe("Woodland encounters");
    });

    it("sorts entries by descending date and then ID", async () => {
      stored.set(authoredKey, {
        version: 1,
        entries: [
          { id: "older", dateCreated: "2024-01-01" },
          { id: "zebra", dateCreated: "2026-11-04" },
          { id: "alpha", dateCreated: "2026-11-04" },
          { id: "newer", dateCreated: "2026-12-01" },
        ],
      });

      await publish();

      const ledger = JSON.parse(files.get(ledgerAuthoredPath) ?? "null");

      expect(ledger.entries.map((entry: { id: string }) => entry.id)).toEqual([
        "newer",
        "alpha",
        "forest-journal",
        "zebra",
        "older",
      ]);
    });
  });

  describe("KV publication", () => {
    it("uses the selected Wrangler binding and mode", async () => {
      await publish("--remote");

      expect(mockWrangler).toHaveBeenCalledWith([
        "list",
        "--binding",
        "CONTENT_KV",
        "--remote",
      ]);

      expect(mockWrangler).toHaveBeenCalledWith(
        wranglerArgs("get", authoredKey, "--remote"),
      );

      expect(mockWrangler).toHaveBeenCalledWith([
        "put",
        authoredKey,
        "--path",
        ledgerAuthoredPath,
        "--binding",
        "CONTENT_KV",
        "--remote",
      ]);

      expect(logSpy).toHaveBeenCalledWith(
        "✓ Remote journal ledger publication complete",
      );
    });

    it("writes and verifies both ledger representations", async () => {
      await publish();

      expect(mockedWriteFile).toHaveBeenCalledTimes(2);

      expect(mockedWriteFile).toHaveBeenCalledWith(
        ledgerAuthoredPath,
        expect.any(String),
        "utf8",
      );

      expect(mockedWriteFile).toHaveBeenCalledWith(
        ledgerAppInitPath,
        expect.any(String),
        "utf8",
      );

      expect(logSpy).toHaveBeenCalledWith(
        `✓ Published and verified: ${authoredKey}`,
      );

      expect(logSpy).toHaveBeenCalledWith(
        `✓ Published and verified: ${appInitKey}`,
      );

      expect(logSpy).toHaveBeenCalledWith(
        "✓ Local journal ledger publication complete",
      );
    });

    it("rejects malformed stored ledgers", async () => {
      stored.set(authoredKey, {
        version: 2,
        entries: [],
      });

      await expect(publish()).rejects.toThrow(
        `Invalid journal ledger: ${authoredKey}`,
      );

      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("rejects stored ledgers without entries", async () => {
      stored.set(appInitKey, {
        version: 1,
      });

      await expect(publish()).rejects.toThrow(
        `Invalid journal ledger: ${appInitKey}`,
      );
    });

    it("rejects KV verification mismatches", async () => {
      mockWrangler.mockImplementation(async (args) => {
        const [operation, key] = args;

        if (operation === "list") {
          return { stdout: "[]", stderr: "" };
        }

        if (operation === "put") {
          return { stdout: "", stderr: "" };
        }

        if (operation === "get") {
          return {
            stdout: JSON.stringify({
              version: 1,
              entries: [],
            }),
            stderr: "",
          };
        }

        throw new Error(`Unexpected command: ${key}`);
      });

      await expect(publish()).rejects.toThrow(
        `Ledger verification failed: ${authoredKey}`,
      );

      expect(logSpy).not.toHaveBeenCalledWith(
        "✓ Local journal ledger publication complete",
      );
    });

    it("stops when a ledger file cannot be written", async () => {
      const error = new Error("Disk full");

      mockedWriteFile.mockRejectedValue(error);

      await expect(publish()).rejects.toBe(error);

      expect(mockWrangler.mock.calls.some(([args]) => args[0] === "put")).toBe(
        false,
      );
    });

    it("propagates Wrangler failures", async () => {
      const error = new Error("Wrangler unavailable");

      mockWrangler.mockRejectedValue(error);

      await expect(publish()).rejects.toBe(error);

      expect(mockedWriteFile).not.toHaveBeenCalled();
    });
  });
});
