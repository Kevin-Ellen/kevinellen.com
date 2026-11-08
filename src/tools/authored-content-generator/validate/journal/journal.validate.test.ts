// src/tools/authored-content-generator/validate/journal/journal.validate.test.ts

import type { ValidateFunction } from "ajv";
import type { ContentAuthored } from "../../../../content-schema/content/content.content-schema.authored.type";
import type { validatePhoto } from "../photo/photo.validate";

import { validateContentAppInit } from "../app-init/app-init.validate";
import { validateJournal } from "./journal.validate";

jest.mock("../app-init/app-init.validate", () => ({
  validateContentAppInit: jest.fn(),
}));

const mockedAppInit = jest.mocked(validateContentAppInit);

type ValidatedPhoto = ReturnType<typeof validatePhoto>;

describe("Journal validation", () => {
  const journalId = "2026-11-04_09-07";

  const validateSchema =
    jest.fn() as unknown as jest.MockedFunction<ValidateFunction>;

  const createJournal = (
    overrides: Record<string, unknown> = {},
  ): ContentAuthored =>
    ({
      kind: "public",
      pageType: "journalEntry",
      id: journalId,
      slug: `/journal/${journalId}`,
      breadcrumbs: ["home", "journal", journalId],
      photos: ["forest-fox", "wood-pigeon"],
      body: {
        modules: [
          {
            kind: "gallery",
            items: [{ photoId: "forest-fox" }, { photoId: "wood-pigeon" }],
          },
        ],
      },
      ...overrides,
    }) as unknown as ContentAuthored;

  const createPhoto = (id: string): ValidatedPhoto =>
    ({
      authored: { id },
      appInit: { id },
    }) as ValidatedPhoto;

  const preparedPhotos = [
    createPhoto("forest-fox"),
    createPhoto("wood-pigeon"),
  ];

  const validate = (
    journal: unknown = createJournal(),
    photos: readonly ValidatedPhoto[] = preparedPhotos,
  ) =>
    validateJournal({
      journal,
      photos,
      validateSchema,
    });

  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    jest.resetAllMocks();

    validateSchema.mockReturnValue(true);
    validateSchema.errors = null;

    mockedAppInit.mockReturnValue({
      id: journalId,
    } as never);

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe("Schema validation", () => {
    it("passes the journal to its schema validator", () => {
      const journal = createJournal();

      validate(journal);

      expect(validateSchema).toHaveBeenCalledWith(journal);
      expect(validateSchema).toHaveBeenCalledTimes(1);
    });

    it("rejects schema validation failures", () => {
      validateSchema.mockReturnValue(false);

      validateSchema.errors = [
        {
          instancePath: "/slug",
          schemaPath: "#/required",
          keyword: "required",
          params: { missingProperty: "slug" },
          message: "must have required property slug",
        },
      ];

      expect(() => validate({})).toThrow("Journal schema validation failed:");

      expect(() => validate({})).toThrow('"instancePath": "/slug"');

      expect(mockedAppInit).not.toHaveBeenCalled();
    });

    it("handles schema failures without error details", () => {
      validateSchema.mockReturnValue(false);
      validateSchema.errors = null;

      expect(() => validate({})).toThrow(
        "Journal schema validation failed:\nnull",
      );
    });
  });

  describe("Journal identity", () => {
    it("rejects non-public content", () => {
      expect(() => validate(createJournal({ kind: "private" }))).toThrow(
        "Expected a public journal entry",
      );
    });

    it("rejects other page types", () => {
      expect(() => validate(createJournal({ pageType: "page" }))).toThrow(
        "Expected a public journal entry",
      );
    });

    it("rejects required placeholders", () => {
      expect(() =>
        validate(
          createJournal({
            label: "__REQUIRED__",
          }),
        ),
      ).toThrow(`Journal "${journalId}" contains required placeholders`);
    });

    it("detects placeholders in nested content", () => {
      expect(() =>
        validate(
          createJournal({
            body: {
              modules: [
                {
                  kind: "pageIntro",
                  title: "__REQUIRED__",
                },
              ],
            },
          }),
        ),
      ).toThrow(`Journal "${journalId}" contains required placeholders`);
    });

    it("rejects inconsistent slugs", () => {
      expect(() =>
        validate(
          createJournal({
            slug: "/journal/wrong-slug",
          }),
        ),
      ).toThrow(`Journal "${journalId}" has an inconsistent slug`);
    });

    it("rejects inconsistent breadcrumbs", () => {
      expect(() =>
        validate(
          createJournal({
            breadcrumbs: ["home", "journal", "wrong-id"],
          }),
        ),
      ).toThrow(`Journal "${journalId}" has inconsistent breadcrumbs`);
    });

    it("accepts matching identity and breadcrumbs", () => {
      expect(() => validate()).not.toThrow();
    });
  });

  describe("Photo inventory", () => {
    it("rejects an empty inventory", () => {
      expect(() => validate(createJournal({ photos: [] }), [])).toThrow(
        "Journal has no photographs",
      );
    });

    it("rejects an absent inventory", () => {
      expect(() => validate(createJournal({ photos: undefined }), [])).toThrow(
        "Journal has no photographs",
      );
    });

    it("rejects duplicate photo IDs", () => {
      expect(() =>
        validate(
          createJournal({
            photos: ["forest-fox", "forest-fox"],
          }),
        ),
      ).toThrow("Journal contains duplicate photograph IDs");
    });

    it("rejects missing prepared photographs", () => {
      expect(() =>
        validate(createJournal(), [createPhoto("forest-fox")]),
      ).toThrow('Journal photograph "wood-pigeon" is missing');
    });

    it("rejects prepared photographs outside the inventory", () => {
      expect(() =>
        validate(createJournal(), [
          ...preparedPhotos,
          createPhoto("extra-photo"),
        ]),
      ).toThrow(
        'Prepared photograph "extra-photo" is not in the journal inventory',
      );
    });

    it("accepts a complete matching photo inventory", () => {
      expect(() => validate(createJournal(), preparedPhotos)).not.toThrow();
    });
  });

  describe("Photo references", () => {
    it("finds references in nested objects and arrays", () => {
      const journal = createJournal({
        body: {
          modules: [
            {
              kind: "gallery",
              items: [
                {
                  image: {
                    photoId: "forest-fox",
                  },
                },
                {
                  content: [
                    {
                      media: {
                        photoId: "wood-pigeon",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      });

      expect(() => validate(journal)).not.toThrow();

      expect(logSpy).toHaveBeenCalledWith("✓ Photo references valid: 2");
    });

    it("rejects references outside the inventory", () => {
      const journal = createJournal({
        body: {
          modules: [
            {
              kind: "gallery",
              photoId: "unknown-photo",
            },
          ],
        },
      });

      expect(() => validate(journal)).toThrow(
        'Journal references photo "unknown-photo" outside its inventory',
      );
    });

    it("ignores non-string photoId values", () => {
      const journal = createJournal({
        body: {
          modules: [
            {
              photoId: null,
            },
            {
              photoId: 123,
            },
            {
              photoId: false,
            },
          ],
        },
      });

      expect(() => validate(journal)).not.toThrow();

      expect(logSpy).toHaveBeenCalledWith("✓ Photo references valid: 0");
    });

    it("ignores strings in unrelated fields", () => {
      const journal = createJournal({
        body: {
          modules: [
            {
              description: "unknown-photo",
              title: "A woodland encounter",
            },
          ],
        },
      });

      expect(() => validate(journal)).not.toThrow();

      expect(logSpy).toHaveBeenCalledWith("✓ Photo references valid: 0");
    });

    it("accepts a journal with no body photo references", () => {
      const journal = createJournal({
        body: {
          modules: [],
          footer: [],
        },
      });

      expect(() => validate(journal)).not.toThrow();

      expect(logSpy).toHaveBeenCalledWith("✓ Photo references valid: 0");
    });

    it("counts repeated valid references independently", () => {
      const journal = createJournal({
        body: {
          modules: [
            { photoId: "forest-fox" },
            { photoId: "forest-fox" },
            { photoId: "wood-pigeon" },
          ],
        },
      });

      validate(journal);

      expect(logSpy).toHaveBeenCalledWith("✓ Photo references valid: 3");
    });

    it("handles null and primitive values during traversal", () => {
      const journal = createJournal({
        body: {
          modules: [
            null,
            "Plain text",
            123,
            false,
            {
              content: null,
              items: [null, "text", { photoId: "forest-fox" }],
            },
          ],
        },
      });

      validate(journal);

      expect(logSpy).toHaveBeenCalledWith("✓ Photo references valid: 1");
    });
  });

  describe("AppInit resolution", () => {
    it("resolves the validated journal", () => {
      const journal = createJournal();

      validate(journal);

      expect(mockedAppInit).toHaveBeenCalledWith(journal);
      expect(mockedAppInit).toHaveBeenCalledTimes(1);
    });

    it("returns authored and resolved content", () => {
      const journal = createJournal();

      const result = validate(journal);

      expect(result).toEqual({
        authored: journal,
        appInit: {
          id: journalId,
        },
      });

      expect(result.authored).toBe(journal);
    });

    it("propagates AppInit resolution failures", () => {
      const error = new Error("Content AppInit failed");

      mockedAppInit.mockImplementation(() => {
        throw error;
      });

      expect(() => validate()).toThrow(error);
    });

    it("logs successful validation and reference counts", () => {
      validate();

      expect(logSpy).toHaveBeenCalledWith(`✓ Journal valid: ${journalId}`);

      expect(logSpy).toHaveBeenCalledWith("✓ Photo references valid: 2");

      expect(logSpy).toHaveBeenCalledWith(`✓ AppInit resolved: ${journalId}`);

      expect(logSpy).toHaveBeenCalledTimes(3);
    });

    it("does not log success for invalid journals", () => {
      expect(() => validate(createJournal({ slug: "/invalid" }))).toThrow();

      expect(logSpy).not.toHaveBeenCalled();
    });
  });
});
