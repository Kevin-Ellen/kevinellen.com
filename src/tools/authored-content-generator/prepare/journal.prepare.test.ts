// src/tools/authored-content-generator/prepare/journal.prepare.test.ts

import { stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { PhotoAssetAuthored } from "../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";

import { importPhotoDraft } from "./import-photo-draft.journal.prepare";
import { prepareJournal } from "./journal.prepare";

jest.mock("node:fs/promises", () => ({
  stat: jest.fn(),
  writeFile: jest.fn(),
}));

jest.mock("./import-photo-draft.journal.prepare", () => ({
  importPhotoDraft: jest.fn(),
}));

const mockedStat = jest.mocked(stat);
const mockedWriteFile = jest.mocked(writeFile);
const mockedImportPhotoDraft = jest.mocked(importPhotoDraft);

describe("Journal preparation", () => {
  const directory = "/content/authored-content/journals/2026-11-04_09-07";
  const draftPath = resolve(directory, "journal.ts");

  const missingFile = Object.assign(new Error("File not found"), {
    code: "ENOENT",
  });

  const createPhoto = (
    id: string,
    cameraModel: string | null = "Canon EOS R7",
    lensModel: string | null = "RF 100-500mm",
  ): PhotoAssetAuthored =>
    ({
      id,
      cameraModel,
      lensModel,
    }) as PhotoAssetAuthored;

  const photos = [createPhoto("forest-fox"), createPhoto("wood-pigeon")];

  const prepare = (
    photoIds: readonly string[] = photos.map((photo) => photo.id),
  ): Promise<void> =>
    prepareJournal({
      directory,
      photoIds,
    });

  const getWrittenJournal = (): Record<string, unknown> => {
    const source = mockedWriteFile.mock.calls[0]?.[1];

    if (typeof source !== "string") {
      throw new Error("Expected a TypeScript journal source");
    }

    const prefix = "export const journal = ";
    const suffix = " as const satisfies ContentAuthored;";

    const start = source.indexOf(prefix);
    const end = source.lastIndexOf(suffix);

    if (start === -1 || end === -1) {
      throw new Error("Invalid generated journal source");
    }

    return JSON.parse(source.slice(start + prefix.length, end)) as Record<
      string,
      unknown
    >;
  };

  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-11-04T12:00:00.000Z"));

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    mockedStat.mockImplementation(async (filePath) => {
      if (filePath === draftPath) {
        throw missingFile;
      }

      return {} as Awaited<ReturnType<typeof stat>>;
    });

    mockedWriteFile.mockResolvedValue(undefined);

    mockedImportPhotoDraft.mockImplementation(async (filePath) => {
      const photo = photos.find(
        (item) => filePath === resolve(directory, `${item.id}.ts`),
      );

      if (!photo) {
        throw new Error(`Unexpected photo draft: ${filePath}`);
      }

      return photo;
    });
  });

  afterEach(() => {
    logSpy.mockRestore();
    jest.useRealTimers();
  });

  describe("Existing journal drafts", () => {
    it("skips generation when journal.ts already exists", async () => {
      mockedStat.mockResolvedValue({} as Awaited<ReturnType<typeof stat>>);

      await prepare();

      expect(mockedStat).toHaveBeenCalledWith(draftPath);
      expect(mockedImportPhotoDraft).not.toHaveBeenCalled();
      expect(mockedWriteFile).not.toHaveBeenCalled();

      expect(logSpy).toHaveBeenCalledWith("↷ Journal draft already exists");
    });

    it("skips an existing journal even with no photo IDs", async () => {
      mockedStat.mockResolvedValue({} as Awaited<ReturnType<typeof stat>>);

      await expect(prepare([])).resolves.toBeUndefined();

      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("propagates unexpected journal filesystem errors", async () => {
      const error = Object.assign(new Error("Permission denied"), {
        code: "EACCES",
      });

      mockedStat.mockRejectedValue(error);

      await expect(prepare()).rejects.toBe(error);

      expect(mockedImportPhotoDraft).not.toHaveBeenCalled();
    });
  });

  describe("Photo inventory validation", () => {
    it("rejects an empty photo inventory", async () => {
      await expect(prepare([])).rejects.toThrow(
        "Cannot prepare a journal without photographs",
      );

      expect(mockedImportPhotoDraft).not.toHaveBeenCalled();
      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("rejects duplicate photo IDs", async () => {
      await expect(prepare(["forest-fox", "forest-fox"])).rejects.toThrow(
        "Journal photo inventory contains duplicate IDs",
      );

      expect(mockedImportPhotoDraft).not.toHaveBeenCalled();
      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("rejects missing photo drafts", async () => {
      mockedStat.mockImplementation(async () => {
        throw missingFile;
      });

      await expect(prepare(["forest-fox"])).rejects.toThrow(
        `Missing photo draft: ${resolve(directory, "forest-fox.ts")}`,
      );

      expect(mockedImportPhotoDraft).not.toHaveBeenCalled();
      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("propagates unexpected photo stat errors", async () => {
      const error = Object.assign(new Error("Permission denied"), {
        code: "EACCES",
      });

      mockedStat.mockImplementation(async (filePath) => {
        if (filePath === draftPath) {
          throw missingFile;
        }

        throw error;
      });

      await expect(prepare()).rejects.toBe(error);

      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("rejects photo ID mismatches", async () => {
      mockedImportPhotoDraft.mockResolvedValue(createPhoto("incorrect-id"));

      await expect(prepare(["forest-fox"])).rejects.toThrow(
        'Photo ID mismatch: expected "forest-fox", received "incorrect-id"',
      );

      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("propagates photo import failures", async () => {
      const error = new Error("Cannot import photo draft");

      mockedImportPhotoDraft.mockRejectedValue(error);

      await expect(prepare()).rejects.toBe(error);

      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("loads photos in inventory order", async () => {
      await prepare(["wood-pigeon", "forest-fox"]);

      expect(mockedImportPhotoDraft).toHaveBeenNthCalledWith(
        1,
        resolve(directory, "wood-pigeon.ts"),
      );

      expect(mockedImportPhotoDraft).toHaveBeenNthCalledWith(
        2,
        resolve(directory, "forest-fox.ts"),
      );

      const journal = getWrittenJournal();

      expect(journal.photos).toEqual(["wood-pigeon", "forest-fox"]);
    });
  });

  describe("Journal draft generation", () => {
    it("creates the expected journal metadata", async () => {
      await prepare();

      const journal = getWrittenJournal();

      expect(journal).toMatchObject({
        kind: "public",
        id: "2026-11-04_09-07",
        slug: "/journal/2026-11-04_09-07",
        render: "composed",
        pageType: "journalEntry",

        label: "__REQUIRED__",

        breadcrumbs: ["home", "journal", "2026-11-04_09-07"],

        dates: {
          created: "2026-11-04",
        },

        metadata: {
          title: "__REQUIRED__",
          description: "__REQUIRED__",
          sitemap: true,
        },

        topics: [],
        scripts: [],

        photos: ["forest-fox", "wood-pigeon"],
      });
    });

    it("creates page introduction and rich content placeholders", async () => {
      await prepare();

      const journal = getWrittenJournal();

      expect(journal.body).toMatchObject({
        modules: [
          {
            kind: "pageIntro",
            eyebrow: "Field journal",
            title: "__REQUIRED__",
            description: "__REQUIRED__",
          },
          {
            kind: "richContent",
            components: [
              {
                kind: "paragraph",
                content: [
                  {
                    kind: "text",
                    value: "__REQUIRED__",
                  },
                ],
              },
            ],
          },
        ],
      });
    });

    it("generates camera and lens field notes", async () => {
      await prepare();

      const journal = getWrittenJournal();

      expect(journal.body).toMatchObject({
        footer: [
          {
            kind: "articleFooter",
            fieldNotes: {
              cameras: ["Canon EOS R7"],
              lenses: ["RF 100-500mm"],
            },
          },
        ],
      });
    });

    it("deduplicates cameras and lenses while preserving order", async () => {
      const differentPhotos = [
        createPhoto("first", "Canon EOS R7", "RF 100-500mm"),
        createPhoto("second", "Canon EOS R5", "RF 100-500mm"),
        createPhoto("third", "Canon EOS R7", "RF 70-200mm"),
      ];

      mockedImportPhotoDraft.mockImplementation(async (filePath) => {
        const photo = differentPhotos.find(
          (item) => filePath === resolve(directory, `${item.id}.ts`),
        );

        if (!photo) {
          throw new Error("Unexpected photo");
        }

        return photo;
      });

      await prepare(["first", "second", "third"]);

      const journal = getWrittenJournal();

      expect(journal.body).toMatchObject({
        footer: [
          {
            fieldNotes: {
              cameras: ["Canon EOS R7", "Canon EOS R5"],
              lenses: ["RF 100-500mm", "RF 70-200mm"],
            },
          },
        ],
      });
    });

    it("excludes null and whitespace-only equipment", async () => {
      const differentPhotos = [
        createPhoto("first", null, null),
        createPhoto("second", "  ", ""),
        createPhoto("third", "Canon EOS R7", "RF 100-500mm"),
      ];

      mockedImportPhotoDraft.mockImplementation(async (filePath) => {
        const photo = differentPhotos.find(
          (item) => filePath === resolve(directory, `${item.id}.ts`),
        );

        if (!photo) {
          throw new Error("Unexpected photo");
        }

        return photo;
      });

      await prepare(["first", "second", "third"]);

      expect(getWrittenJournal().body).toMatchObject({
        footer: [
          {
            fieldNotes: {
              cameras: ["Canon EOS R7"],
              lenses: ["RF 100-500mm"],
            },
          },
        ],
      });
    });

    it("writes the generated TypeScript with exclusive creation", async () => {
      await prepare();

      const [path, source, options] = mockedWriteFile.mock.calls[0];

      expect(path).toBe(draftPath);

      expect(options).toEqual({
        encoding: "utf8",
        flag: "wx",
      });

      expect(source).toEqual(expect.any(String));

      expect(source).toContain(
        'import type { ContentAuthored } from "../../../src/content-schema/content/content.content-schema.authored.type";',
      );

      expect(source).toContain("export const journal = ");

      expect(source).toContain(" as const satisfies ContentAuthored;");

      expect(mockedWriteFile).toHaveBeenCalledTimes(1);
    });

    it("uses the current UTC date", async () => {
      jest.setSystemTime(new Date("2025-12-31T23:59:00.000Z"));

      await prepare();

      expect(getWrittenJournal().dates).toEqual({
        created: "2025-12-31",
      });
    });

    it("logs the generated journal summary", async () => {
      await prepare();

      expect(logSpy).toHaveBeenCalledWith(
        `✓ Prepared journal draft: ${draftPath}`,
      );

      expect(logSpy).toHaveBeenCalledWith("  Photographs: 2");

      expect(logSpy).toHaveBeenCalledWith("  Cameras: 1");

      expect(logSpy).toHaveBeenCalledWith("  Lenses: 1");
    });

    it("propagates write failures without logging success", async () => {
      const error = Object.assign(new Error("File already exists"), {
        code: "EEXIST",
      });

      mockedWriteFile.mockRejectedValue(error);

      await expect(prepare()).rejects.toBe(error);

      expect(logSpy).not.toHaveBeenCalledWith(
        `✓ Prepared journal draft: ${draftPath}`,
      );
    });
  });
});
