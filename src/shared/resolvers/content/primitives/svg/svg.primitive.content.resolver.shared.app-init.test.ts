// src/shared/resolvers/content/primitives/svg/svg.primitive.content.resolver.shared.app-init.test.ts

import { resolveSvgReferenceAppInit } from "./svg.primitive.content.resolver.shared.app-init";

type Input = Parameters<typeof resolveSvgReferenceAppInit>[0];
type Registry = Input["registry"];
type Authored = Input["authored"];

describe("SVG reference AppInit resolver", () => {
  const registry = {
    "icon-camera": {
      id: "icon-camera",
      width: 24,
      height: 24,
    },
    "icon-calendar": {
      id: "icon-calendar",
      width: 16,
      height: 12,
    },
  } as unknown as Registry;

  const createReference = (id: string): Authored => ({ id });

  const resolve = (authored: Authored, assets: Registry = registry) =>
    resolveSvgReferenceAppInit({
      authored,
      registry: assets,
    });

  describe("Registered SVG assets", () => {
    it("resolves a registered SVG reference", () => {
      expect(resolve(createReference("icon-camera"))).toEqual({
        id: "icon-camera",
        width: 24,
        height: 24,
      });
    });

    it("resolves different SVG dimensions correctly", () => {
      expect(resolve(createReference("icon-calendar"))).toEqual({
        id: "icon-calendar",
        width: 16,
        height: 12,
      });
    });

    it("returns only the public SVG reference properties", () => {
      const result = resolve(createReference("icon-camera"));

      expect(Object.keys(result).sort()).toEqual(["height", "id", "width"]);

      expect(result).not.toHaveProperty("markup");
    });

    it("uses the registered asset ID in the result", () => {
      const assets = {
        alias: {
          id: "icon-camera",
          width: 32,
          height: 32,
        },
      } as unknown as Registry;

      const result = resolve(createReference("alias"), assets);

      expect(result.id).toBe("icon-camera");
    });
  });

  describe("Unknown SVG assets", () => {
    it("rejects an unknown SVG ID", () => {
      expect(() => resolve(createReference("missing"))).toThrow(
        "Unknown SVG asset: missing",
      );
    });

    it("rejects an empty SVG registry", () => {
      expect(() => resolve(createReference("camera"), {} as Registry)).toThrow(
        "Unknown SVG asset: camera",
      );
    });

    it("rejects inherited object property names", () => {
      expect(() => resolve(createReference("constructor"))).toThrow(
        "Unknown SVG asset: constructor",
      );

      expect(() => resolve(createReference("toString"))).toThrow(
        "Unknown SVG asset: toString",
      );
    });

    it("rejects properties inherited from a registry prototype", () => {
      const prototype = {
        inherited: {
          id: "inherited",
          width: 24,
          height: 24,
        },
      };

      const assets = Object.create(prototype) as Registry;

      expect(() => resolve(createReference("inherited"), assets)).toThrow(
        "Unknown SVG asset: inherited",
      );
    });
  });

  describe("Data integrity", () => {
    it("does not mutate the authored reference", () => {
      const authored = createReference("icon-camera");
      const original = { ...authored };

      resolve(authored);

      expect(authored).toEqual(original);
    });

    it("does not mutate the registry asset", () => {
      const asset = registry["icon-camera"];
      const original = { ...asset };

      resolve(createReference("icon-camera"));

      expect(registry["icon-camera"]).toEqual(original);
    });

    it("returns a new object rather than the registry asset", () => {
      const result = resolve(createReference("icon-camera"));

      expect(result).not.toBe(registry["icon-camera"]);
    });

    it("returns a fresh reference for repeated lookups", () => {
      const authored = createReference("icon-camera");

      const first = resolve(authored);
      const second = resolve(authored);

      expect(first).toEqual(second);
      expect(first).not.toBe(second);
    });

    it("supports frozen registry assets", () => {
      const assets = {
        "icon-camera": Object.freeze({
          id: "icon-camera",
          width: 24,
          height: 24,
        }),
      } as unknown as Registry;

      expect(resolve(createReference("icon-camera"), assets)).toEqual({
        id: "icon-camera",
        width: 24,
        height: 24,
      });
    });
  });
});
