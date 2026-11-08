// src/shared/resolvers/content/modules/metadata-bar/metadata-bar.module.content.resolver.shared.app-init.test.ts

import { resolveSvgReferenceAppInit } from "../../primitives/svg/svg.primitive.content.resolver.shared.app-init";

import { resolveMetadataBarModuleContentAppInit } from "./metadata-bar.module.content.resolver.shared.app-init";

jest.mock(
  "../../primitives/svg/svg.primitive.content.resolver.shared.app-init",
  () => ({
    resolveSvgReferenceAppInit: jest.fn(),
  }),
);

const mockedSvgResolver = jest.mocked(resolveSvgReferenceAppInit);

type Input = Parameters<typeof resolveMetadataBarModuleContentAppInit>[0];
type Authored = Input["authored"];
type ResolvedIcon = ReturnType<typeof resolveSvgReferenceAppInit>;

describe("Metadata bar module AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];

  const createAuthored = (overrides: Partial<Authored> = {}): Authored => ({
    kind: "metadataBar",
    cameras: ["Canon EOS R7"],
    lenses: ["Canon RF 100-500mm"],
    location: "Epping Forest, Essex",
    ...overrides,
  });

  const createResolvedIcon = (id: ResolvedIcon["id"]): ResolvedIcon => ({
    id,
    width: 24,
    height: 24,
  });

  const resolve = (authored: Authored) =>
    resolveMetadataBarModuleContentAppInit({
      authored,
      svgAssets,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedSvgResolver.mockImplementation(() =>
      createResolvedIcon("icon-calendar"),
    );
  });

  describe("Heading resolution", () => {
    it("uses the default heading when omitted", () => {
      const result = resolve(createAuthored());

      expect(result.heading).toBe("Equipment for this entry");
    });

    it("uses the default heading when explicitly undefined", () => {
      const result = resolve(
        createAuthored({
          heading: undefined,
        }),
      );

      expect(result.heading).toBe("Equipment for this entry");
    });

    it("preserves a custom heading", () => {
      const result = resolve(
        createAuthored({
          heading: "Equipment and location",
        }),
      );

      expect(result.heading).toBe("Equipment and location");
    });

    it("preserves an explicitly empty heading", () => {
      const result = resolve(
        createAuthored({
          heading: "",
        }),
      );

      expect(result.heading).toBe("");
    });
  });

  describe("Metadata groups", () => {
    it("creates all three metadata groups", () => {
      const result = resolve(createAuthored());

      expect(Object.keys(result)).toEqual([
        "kind",
        "heading",
        "cameras",
        "lenses",
        "location",
      ]);

      expect(result.kind).toBe("metadataBar");
    });

    it("resolves the camera icon", () => {
      resolve(createAuthored());

      expect(mockedSvgResolver).toHaveBeenNthCalledWith(1, {
        authored: {
          id: "icon-camera",
        },
        registry: svgAssets,
      });
    });

    it("resolves the lens icon", () => {
      resolve(createAuthored());

      expect(mockedSvgResolver).toHaveBeenNthCalledWith(2, {
        authored: {
          id: "icon-aperture",
        },
        registry: svgAssets,
      });
    });

    it("resolves the location icon", () => {
      resolve(createAuthored());

      expect(mockedSvgResolver).toHaveBeenNthCalledWith(3, {
        authored: {
          id: "icon-location-dot",
        },
        registry: svgAssets,
      });
    });

    it("resolves exactly three icons", () => {
      resolve(createAuthored());

      expect(mockedSvgResolver).toHaveBeenCalledTimes(3);
    });

    it("preserves camera, lens and location entries", () => {
      const authored = createAuthored();
      const result = resolve(authored);

      expect(result.cameras.entries).toEqual(["Canon EOS R7"]);
      expect(result.lenses.entries).toEqual(["Canon RF 100-500mm"]);
      expect(result.location.entries).toBe("Epping Forest, Essex");
    });

    it("preserves entry array references", () => {
      const authored = createAuthored();

      const result = resolve(authored);

      expect(result.cameras.entries).toBe(authored.cameras);
      expect(result.lenses.entries).toBe(authored.lenses);
      expect(result.location.entries).toBe(authored.location);
    });

    it("supports empty metadata collections", () => {
      const result = resolve(
        createAuthored({
          cameras: [],
          lenses: [],
          location: null,
        }),
      );

      expect(result.cameras.entries).toEqual([]);
      expect(result.lenses.entries).toEqual([]);
      expect(result.location.entries).toBeNull();

      expect(mockedSvgResolver).toHaveBeenCalledTimes(3);
    });

    it("preserves resolved icon references", () => {
      const camera = createResolvedIcon("icon-camera");
      const lens = createResolvedIcon("icon-aperture");
      const location = createResolvedIcon("icon-location-dot");

      mockedSvgResolver
        .mockReturnValueOnce(camera)
        .mockReturnValueOnce(lens)
        .mockReturnValueOnce(location);

      const result = resolve(createAuthored());

      expect(result.cameras.icon).toBe(camera);
      expect(result.lenses.icon).toBe(lens);
      expect(result.location.icon).toBe(location);
    });
  });

  describe("Data integrity", () => {
    it("does not mutate the authored module", () => {
      const authored = createAuthored();

      const original = {
        ...authored,
        cameras: [...authored.cameras],
        lenses: [...authored.lenses],
        location: authored.location,
      };

      resolve(authored);

      expect(authored).toEqual(original);
    });

    it("returns a new resolved module object", () => {
      const authored = createAuthored();

      const result = resolve(authored);

      expect(result).not.toBe(authored);
    });

    it("returns new metadata group objects on every resolution", () => {
      const authored = createAuthored();

      const first = resolve(authored);
      const second = resolve(authored);

      expect(first).not.toBe(second);
      expect(first.cameras).not.toBe(second.cameras);
      expect(first.lenses).not.toBe(second.lenses);
      expect(first.location).not.toBe(second.location);
    });

    it("does not copy unrelated authored properties", () => {
      const authored = {
        ...createAuthored(),
        customProperty: "not included",
      };

      const result = resolve(authored);

      expect(result).not.toHaveProperty("customProperty");
    });

    it("supports frozen authored collections", () => {
      const authored = Object.freeze(
        createAuthored({
          cameras: Object.freeze(["Canon EOS R7"]),
          lenses: Object.freeze(["Canon RF 100-500mm"]),
          location: "Epping Forest",
        }),
      );

      const result = resolve(authored);

      expect(result.cameras.entries).toEqual(["Canon EOS R7"]);
      expect(result.lenses.entries).toEqual(["Canon RF 100-500mm"]);
      expect(result.location.entries).toBe("Epping Forest");
    });
  });

  describe("Failure propagation", () => {
    it("propagates a camera icon resolution failure", () => {
      const error = new Error("Camera icon resolution failed");

      mockedSvgResolver.mockImplementation(() => {
        throw error;
      });

      expect(() => resolve(createAuthored())).toThrow(error);

      expect(mockedSvgResolver).toHaveBeenCalledTimes(1);
    });

    it("propagates a lens icon resolution failure", () => {
      const error = new Error("Lens icon resolution failed");

      mockedSvgResolver
        .mockReturnValueOnce(createResolvedIcon("icon-camera"))
        .mockImplementationOnce(() => {
          throw error;
        });

      expect(() => resolve(createAuthored())).toThrow(error);

      expect(mockedSvgResolver).toHaveBeenCalledTimes(2);
    });

    it("propagates a location icon resolution failure", () => {
      const error = new Error("Location icon resolution failed");

      mockedSvgResolver
        .mockReturnValueOnce(createResolvedIcon("icon-camera"))
        .mockReturnValueOnce(createResolvedIcon("icon-aperture"))
        .mockImplementationOnce(() => {
          throw error;
        });

      expect(() => resolve(createAuthored())).toThrow(error);

      expect(mockedSvgResolver).toHaveBeenCalledTimes(3);
    });
  });
});
