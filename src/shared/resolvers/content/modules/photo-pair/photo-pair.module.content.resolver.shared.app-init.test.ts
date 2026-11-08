// src/shared/resolvers/content/modules/photo-pair/photo-pair.module.content.resolver.shared.app-init.test.ts

import { resolvePhotoComponentContentAppInit } from "../../components/photo/photo.component.content.resolver.shared.app-init";

import { resolvePhotoPairModuleContentAppInit } from "./photo-pair.module.content.resolver.shared.app-init";

jest.mock(
  "../../components/photo/photo.component.content.resolver.shared.app-init",
  () => ({
    resolvePhotoComponentContentAppInit: jest.fn(),
  }),
);

const mockedPhotoResolver = jest.mocked(resolvePhotoComponentContentAppInit);

type Input = Parameters<typeof resolvePhotoPairModuleContentAppInit>[0];
type Authored = Input["authored"];
type Photo = Authored["photos"][number];
type ResolvedPhoto = ReturnType<typeof resolvePhotoComponentContentAppInit>;

describe("Photo pair module AppInit resolver", () => {
  const createPhoto = (id: string): Photo =>
    ({
      kind: "photo",
      photoId: id,
    }) as unknown as Photo;

  const createAuthored = (overrides: Partial<Authored> = {}): Authored =>
    ({
      kind: "photoPair",
      photos: [createPhoto("forest-fox"), createPhoto("wood-pigeon")],
      ...overrides,
    }) as unknown as Authored;

  const resolve = (authored: Authored) =>
    resolvePhotoPairModuleContentAppInit({ authored });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedPhotoResolver.mockImplementation(({ authored }) => ({ ...authored }));
  });

  describe("Photo resolution", () => {
    it("resolves the first photograph", () => {
      const authored = createAuthored();

      resolve(authored);

      expect(mockedPhotoResolver).toHaveBeenNthCalledWith(1, {
        authored: authored.photos[0],
      });
    });

    it("resolves the second photograph", () => {
      const authored = createAuthored();

      resolve(authored);

      expect(mockedPhotoResolver).toHaveBeenNthCalledWith(2, {
        authored: authored.photos[1],
      });
    });

    it("resolves exactly two photographs", () => {
      const result = resolve(createAuthored());

      expect(mockedPhotoResolver).toHaveBeenCalledTimes(2);
      expect(result.photos).toHaveLength(2);
    });

    it("preserves the resolved photo references and order", () => {
      const first = {
        kind: "photo",
        photoId: "resolved-first",
      } as unknown as ResolvedPhoto;

      const second = {
        kind: "photo",
        photoId: "resolved-second",
      } as unknown as ResolvedPhoto;

      mockedPhotoResolver
        .mockReturnValueOnce(first)
        .mockReturnValueOnce(second);

      const result = resolve(createAuthored());

      expect(result.photos[0]).toBe(first);
      expect(result.photos[1]).toBe(second);
    });

    it("preserves authored photo ordering", () => {
      const authored = createAuthored();

      const result = resolve(authored);

      expect(result.photos).toEqual([authored.photos[0], authored.photos[1]]);
    });
  });

  describe("Data integrity", () => {
    it("preserves unrelated module properties", () => {
      const authored = {
        ...createAuthored(),
        identifier: "woodland-photo-pair",
      };

      const result = resolve(authored);

      expect(result).toMatchObject({
        kind: "photoPair",
        identifier: "woodland-photo-pair",
      });
    });

    it("does not mutate the authored photographs", () => {
      const authored = createAuthored();

      const original = [...authored.photos];

      resolve(authored);

      expect(authored.photos).toEqual(original);
      expect(authored.photos[0]).toBe(original[0]);
      expect(authored.photos[1]).toBe(original[1]);
    });

    it("creates a new module and photo tuple", () => {
      const authored = createAuthored();

      const result = resolve(authored);

      expect(result).not.toBe(authored);
      expect(result.photos).not.toBe(authored.photos);
      expect(result.photos[0]).not.toBe(authored.photos[0]);
      expect(result.photos[1]).not.toBe(authored.photos[1]);
    });

    it("preserves unrelated nested property references", () => {
      const metadata = {
        location: "Epping Forest",
      };

      const authored = {
        ...createAuthored(),
        metadata,
      };

      const result = resolve(authored);

      expect(
        (
          result as typeof result & {
            metadata: typeof metadata;
          }
        ).metadata,
      ).toBe(metadata);
    });

    it("supports frozen authored photographs", () => {
      const photos = [
        Object.freeze(createPhoto("first")),
        Object.freeze(createPhoto("second")),
      ] as unknown as Authored["photos"];

      const authored = createAuthored({ photos });

      const result = resolve(authored);

      expect(result.photos).toHaveLength(2);
    });
  });

  describe("Failure propagation", () => {
    it("propagates a failure resolving the first photograph", () => {
      const error = new Error("First photograph failed");

      mockedPhotoResolver.mockImplementation(() => {
        throw error;
      });

      expect(() => resolve(createAuthored())).toThrow(error);

      expect(mockedPhotoResolver).toHaveBeenCalledTimes(1);
    });

    it("propagates a failure resolving the second photograph", () => {
      const error = new Error("Second photograph failed");

      mockedPhotoResolver
        .mockReturnValueOnce(createPhoto("resolved-first"))
        .mockImplementationOnce(() => {
          throw error;
        });

      expect(() => resolve(createAuthored())).toThrow(error);

      expect(mockedPhotoResolver).toHaveBeenCalledTimes(2);
    });

    it("stops resolution after the first photo fails", () => {
      const authored = createAuthored();

      mockedPhotoResolver.mockImplementation(() => {
        throw new Error("Resolution stopped");
      });

      expect(() => resolve(authored)).toThrow("Resolution stopped");

      expect(mockedPhotoResolver).not.toHaveBeenCalledWith({
        authored: authored.photos[1],
      });
    });
  });
});
