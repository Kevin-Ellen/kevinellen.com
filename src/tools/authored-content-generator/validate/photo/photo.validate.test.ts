// src/tools/authored-content-generator/validate/photo/photo.validate.test.ts

import type { ValidateFunction } from "ajv";
import type { PhotoAssetAuthored } from "../../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";

import { validatePhotoAppInit } from "../app-init/app-init.validate";
import { validatePhoto } from "./photo.validate";

jest.mock("../app-init/app-init.validate", () => ({
  validatePhotoAppInit: jest.fn(),
}));

const mockedAppInit = jest.mocked(validatePhotoAppInit);

describe("Photo validation", () => {
  const expectedId = "forest-fox";

  const validateSchema =
    jest.fn() as unknown as jest.MockedFunction<ValidateFunction>;

  const createPhoto = (
    overrides: Record<string, unknown> = {},
  ): PhotoAssetAuthored =>
    ({
      id: expectedId,
      title: "Fox in Epping Forest",
      alt: "A red fox standing among woodland trees",
      commentary: "An encounter during an early woodland walk",
      species: [
        {
          scientificName: "Vulpes vulpes",
        },
      ],
      ...overrides,
    }) as unknown as PhotoAssetAuthored;

  const validate = (photo: unknown = createPhoto(), id = expectedId) =>
    validatePhoto({
      photo,
      expectedId: id,
      validateSchema,
    });

  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    jest.resetAllMocks();

    validateSchema.mockReturnValue(true);
    validateSchema.errors = null;

    mockedAppInit.mockReturnValue({
      id: expectedId,
    } as never);

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe("Schema validation", () => {
    it("passes the photo to the schema validator", () => {
      const photo = createPhoto();

      validate(photo);

      expect(validateSchema).toHaveBeenCalledWith(photo);
      expect(validateSchema).toHaveBeenCalledTimes(1);
    });

    it("rejects schema validation failures", () => {
      validateSchema.mockReturnValue(false);

      validateSchema.errors = [
        {
          instancePath: "/title",
          keyword: "minLength",
          params: { limit: 1 },
          message: "must NOT have fewer than 1 characters",
          schemaPath: "#/properties/title/minLength",
        },
      ];

      expect(() => validate({})).toThrow(
        `Photo "${expectedId}" schema validation failed:`,
      );

      expect(() => validate({})).toThrow('"instancePath": "/title"');

      expect(mockedAppInit).not.toHaveBeenCalled();
    });

    it("handles schema failures without error details", () => {
      validateSchema.mockReturnValue(false);
      validateSchema.errors = null;

      expect(() => validate({})).toThrow(
        `Photo "${expectedId}" schema validation failed:\nnull`,
      );
    });
  });

  describe("Photo identity", () => {
    it("rejects mismatched photo IDs", () => {
      const photo = createPhoto({
        id: "different-photo",
      });

      expect(() => validate(photo)).toThrow(
        'Photo ID mismatch: expected "forest-fox", received "different-photo"',
      );

      expect(mockedAppInit).not.toHaveBeenCalled();
    });

    it("accepts the expected photo ID", () => {
      expect(() => validate()).not.toThrow();
    });
  });

  describe("Required editorial text", () => {
    it.each(["title", "alt", "commentary"])("rejects an empty %s", (field) => {
      expect(() => validate(createPhoto({ [field]: "" }))).toThrow(
        `Photo "${expectedId}" requires a valid ${field}`,
      );
    });

    it.each(["title", "alt", "commentary"])(
      "rejects whitespace-only %s",
      (field) => {
        expect(() => validate(createPhoto({ [field]: "   " }))).toThrow(
          `Photo "${expectedId}" requires a valid ${field}`,
        );
      },
    );

    it.each(["title", "alt", "commentary"])(
      "rejects placeholders in %s",
      (field) => {
        expect(() =>
          validate(
            createPhoto({
              [field]: "Pending __REQUIRED__ content",
            }),
          ),
        ).toThrow(`Photo "${expectedId}" requires a valid ${field}`);
      },
    );

    it("accepts completed editorial fields", () => {
      const photo = createPhoto({
        title: "Red Fox",
        alt: "A fox in woodland",
        commentary: "Photographed at dawn",
      });

      expect(() => validate(photo)).not.toThrow();
    });
  });

  describe("Species validation", () => {
    it("rejects duplicate scientific names", () => {
      const photo = createPhoto({
        species: [
          { scientificName: "Vulpes vulpes" },
          { scientificName: "Vulpes vulpes" },
        ],
      });

      expect(() => validate(photo)).toThrow(
        'Photo "forest-fox" contains duplicate species',
      );

      expect(mockedAppInit).not.toHaveBeenCalled();
    });

    it("accepts distinct scientific names", () => {
      const photo = createPhoto({
        species: [
          { scientificName: "Vulpes vulpes" },
          { scientificName: "Sciurus carolinensis" },
        ],
      });

      expect(() => validate(photo)).not.toThrow();
    });

    it("accepts an empty species array", () => {
      expect(() => validate(createPhoto({ species: [] }))).not.toThrow();
    });

    it("accepts absent species metadata", () => {
      expect(() => validate(createPhoto({ species: undefined }))).not.toThrow();
    });
  });

  describe("AppInit resolution", () => {
    it("resolves the validated photo", () => {
      const photo = createPhoto();

      validate(photo);

      expect(mockedAppInit).toHaveBeenCalledWith(photo);
      expect(mockedAppInit).toHaveBeenCalledTimes(1);
    });

    it("returns authored and resolved metadata", () => {
      const photo = createPhoto();

      const result = validate(photo);

      expect(result).toEqual({
        authored: photo,
        appInit: {
          id: expectedId,
        },
      });

      expect(result.authored).toBe(photo);
    });

    it("propagates AppInit validation errors", () => {
      const error = new Error("Invalid photo AppInit");

      mockedAppInit.mockImplementation(() => {
        throw error;
      });

      expect(() => validate()).toThrow(error);
    });

    it("logs successful validation", () => {
      validate();

      expect(logSpy).toHaveBeenCalledWith("✓ Photo valid: forest-fox");

      expect(logSpy).toHaveBeenCalledWith(
        "✓ Photo AppInit resolved: forest-fox",
      );
    });

    it("does not log success when validation fails", () => {
      expect(() => validate(createPhoto({ title: "" }))).toThrow();

      expect(logSpy).not.toHaveBeenCalled();
    });
  });
});
