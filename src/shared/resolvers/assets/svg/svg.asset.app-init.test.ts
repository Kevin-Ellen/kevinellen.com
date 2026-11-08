// src/shared/resolvers/assets/svg/svg.asset.app-init.test.ts

import { resolveSvgAssetsConfigAppInit } from "./svg.asset.app-init";

type Input = Parameters<typeof resolveSvgAssetsConfigAppInit>[0];
type Asset = Input["authored"][string];

describe("SVG assets config AppInit resolver", () => {
  const createAsset = (overrides: Partial<Asset> = {}): Asset =>
    ({
      id: "icon-camera",
      viewBox: "0 0 24 24",
      ...overrides,
    }) as Asset;

  const resolve = (authored: Input["authored"]) =>
    resolveSvgAssetsConfigAppInit({ authored });

  describe("ViewBox parsing", () => {
    it("extracts width and height from a standard viewBox", () => {
      const result = resolve({
        "icon-camera": createAsset(),
      });

      expect(result["icon-camera"]).toMatchObject({
        id: "icon-camera",
        width: 24,
        height: 24,
      });
    });

    it("supports non-square dimensions", () => {
      const result = resolve({
        "icon-camera": createAsset({
          viewBox: "0 0 48 32",
        }),
      });

      expect(result["icon-camera"]?.width).toBe(48);
      expect(result["icon-camera"]?.height).toBe(32);
    });

    it("supports decimal dimensions", () => {
      const result = resolve({
        "icon-camera": createAsset({
          viewBox: "0 0 24.5 18.75",
        }),
      });

      expect(result["icon-camera"]?.width).toBe(24.5);
      expect(result["icon-camera"]?.height).toBe(18.75);
    });

    it("supports comma-separated coordinates", () => {
      const result = resolve({
        "icon-camera": createAsset({
          viewBox: "0,0,24,32",
        }),
      });

      expect(result["icon-camera"]?.width).toBe(24);
      expect(result["icon-camera"]?.height).toBe(32);
    });

    it("supports mixed whitespace and comma separators", () => {
      const result = resolve({
        "icon-camera": createAsset({
          viewBox: "  0, 0   24,\t32  ",
        }),
      });

      expect(result["icon-camera"]?.width).toBe(24);
      expect(result["icon-camera"]?.height).toBe(32);
    });

    it("extracts dimensions independently of the origin", () => {
      const result = resolve({
        "icon-camera": createAsset({
          viewBox: "-10 -20 100 50",
        }),
      });

      expect(result["icon-camera"]?.width).toBe(100);
      expect(result["icon-camera"]?.height).toBe(50);
    });

    it("allows positive fractional dimensions", () => {
      const result = resolve({
        "icon-camera": createAsset({
          viewBox: "0 0 0.5 0.25",
        }),
      });

      expect(result["icon-camera"]?.width).toBe(0.5);
      expect(result["icon-camera"]?.height).toBe(0.25);
    });

    it("allows scientific notation", () => {
      const result = resolve({
        "icon-camera": createAsset({
          viewBox: "0 0 1e2 2e2",
        }),
      });

      expect(result["icon-camera"]?.width).toBe(100);
      expect(result["icon-camera"]?.height).toBe(200);
    });
  });

  describe("Invalid viewBox dimensions", () => {
    it.each([
      "0 0 0 24",
      "0 0 24 0",
      "0 0 -24 24",
      "0 0 24 -24",
      "0 0 -24 -24",
      "0 0 NaN 24",
      "0 0 24 NaN",
      "0 0 Infinity 24",
      "0 0 24 Infinity",
      "0 0 -Infinity 24",
      "0 0 24 -Infinity",
      "0 0 abc 24",
      "0 0 24 abc",
      "0 0 24",
      "0 0",
      "",
    ])("rejects invalid viewBox %j", (viewBox) => {
      expect(() =>
        resolve({
          "icon-camera": createAsset({ viewBox }),
        }),
      ).toThrow("Invalid SVG viewBox: icon-camera");
    });

    it("includes the asset ID in the error message", () => {
      expect(() =>
        resolve({
          "icon-calendar": createAsset({
            id: "icon-calendar",
            viewBox: "0 0 -1 24",
          }),
        }),
      ).toThrow("Invalid SVG viewBox: icon-calendar");
    });

    it("stops processing at the first invalid asset", () => {
      expect(() =>
        resolve({
          "icon-camera": createAsset(),
          "icon-calendar": createAsset({
            id: "icon-calendar",
            viewBox: "0 0 0 24",
          }),
          "icon-aperture": createAsset({
            id: "icon-aperture",
            viewBox: "0 0 24 0",
          }),
        }),
      ).toThrow("Invalid SVG viewBox: icon-calendar");
    });
  });

  describe("Registry resolution", () => {
    it("returns an empty registry when no assets exist", () => {
      expect(resolve({})).toEqual({});
    });

    it("resolves multiple assets", () => {
      const result = resolve({
        "icon-camera": createAsset(),
        "icon-aperture": createAsset({
          id: "icon-aperture",
          viewBox: "0 0 32 16",
        }),
        "icon-calendar": createAsset({
          id: "icon-calendar",
          viewBox: "0 0 16 32",
        }),
      });

      expect(Object.keys(result)).toEqual([
        "icon-camera",
        "icon-aperture",
        "icon-calendar",
      ]);

      expect(result["icon-camera"]).toMatchObject({
        width: 24,
        height: 24,
      });

      expect(result["icon-aperture"]).toMatchObject({
        width: 32,
        height: 16,
      });

      expect(result["icon-calendar"]).toMatchObject({
        width: 16,
        height: 32,
      });
    });

    it("preserves registry keys independently of asset IDs", () => {
      const result = resolve({
        customKey: createAsset({
          id: "icon-camera",
        }),
      });

      expect(result).toHaveProperty("customKey");
      expect(result.customKey?.id).toBe("icon-camera");
    });

    it("preserves additional asset metadata", () => {
      const asset = {
        ...createAsset(),
        path: "M0 0L24 24",
        customMetadata: "preserved",
      };

      const result = resolve({
        "icon-camera": asset,
      });

      expect(result["icon-camera"]).toMatchObject({
        path: "M0 0L24 24",
        customMetadata: "preserved",
      });
    });

    it("overrides authored dimensions with parsed viewBox dimensions", () => {
      const asset = {
        ...createAsset({
          viewBox: "0 0 48 32",
        }),
        width: 999,
        height: 999,
      };

      const result = resolve({
        "icon-camera": asset,
      });

      expect(result["icon-camera"]?.width).toBe(48);
      expect(result["icon-camera"]?.height).toBe(32);
    });

    it("does not mutate authored assets", () => {
      const asset = createAsset();
      const authored = {
        "icon-camera": asset,
      };

      const original = {
        ...asset,
      };

      resolve(authored);

      expect(asset).toEqual(original);
      expect(authored["icon-camera"]).toBe(asset);
    });

    it("creates new resolved asset objects", () => {
      const asset = createAsset();

      const result = resolve({
        "icon-camera": asset,
      });

      expect(result["icon-camera"]).not.toBe(asset);
    });

    it("returns a new registry object on every invocation", () => {
      const authored = {
        "icon-camera": createAsset(),
      };

      const first = resolve(authored);
      const second = resolve(authored);

      expect(first).not.toBe(second);
      expect(first["icon-camera"]).not.toBe(second["icon-camera"]);
      expect(first).toEqual(second);
    });

    it("supports frozen authored assets and registries", () => {
      const asset = Object.freeze(createAsset());

      const authored = Object.freeze({
        "icon-camera": asset,
      });

      const result = resolve(authored);

      expect(result["icon-camera"]).toMatchObject({
        id: "icon-camera",
        width: 24,
        height: 24,
      });
    });
  });
});
