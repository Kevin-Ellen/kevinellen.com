// src/shared/resolvers/assets/scripts/scripts.asset.resolver.app-init.test.ts

import { resolveScriptsAssetConfigAppInit } from "./scripts.asset.resolver.app-init";

type Input = Parameters<typeof resolveScriptsAssetConfigAppInit>[0];
type Authored = Input["authored"];
type Registry = Authored["registry"];
type Script = Registry[keyof Registry];

describe("Scripts assets config AppInit resolver", () => {
  const createScript = (overrides: Partial<Script> = {}): Script =>
    ({
      kind: "external",
      src: "/assets/scripts/header-headroom.js",
      ...overrides,
    }) as Script;

  const createAuthored = (overrides: Partial<Authored> = {}): Authored => ({
    registry: {},
    global: [],
    ...overrides,
  });

  const resolve = (authored: Authored) =>
    resolveScriptsAssetConfigAppInit({ authored });

  describe("Registry resolution", () => {
    it("resolves an empty registry", () => {
      const result = resolve(createAuthored());

      expect(result.registry).toEqual({});
      expect(result.global).toEqual([]);
    });

    it("resolves a script using its registry key as the ID", () => {
      const result = resolve(
        createAuthored({
          registry: {
            "header-headroom": createScript(),
          },
        }),
      );

      expect(result.registry["header-headroom"]).toMatchObject({
        id: "header-headroom",
        kind: "external",
        src: "/assets/scripts/header-headroom.js",
      });
    });

    it("defaults scriptType to module", () => {
      const result = resolve(
        createAuthored({
          registry: {
            "header-headroom": createScript(),
          },
        }),
      );

      expect(result.registry["header-headroom"]?.scriptType).toBe("module");
    });

    it("preserves an explicit scriptType", () => {
      const result = resolve(
        createAuthored({
          registry: {
            "header-headroom": createScript({
              scriptType: "classic",
            }),
          },
        }),
      );

      expect(result.registry["header-headroom"]?.scriptType).toBe("classic");
    });

    it("normalises omitted loading to null", () => {
      const result = resolve(
        createAuthored({
          registry: {
            "header-headroom": createScript(),
          },
        }),
      );

      expect(result.registry["header-headroom"]?.loading).toBeNull();
    });

    it("preserves explicitly configured loading", () => {
      const result = resolve(
        createAuthored({
          registry: {
            "header-headroom": createScript({
              loading: "defer",
            }),
          },
        }),
      );

      expect(result.registry["header-headroom"]?.loading).toBe("defer");
    });

    it("resolves multiple scripts independently", () => {
      const result = resolve(
        createAuthored({
          registry: {
            "header-headroom": createScript(),
            "gallery-navigation": createScript({
              src: "/assets/scripts/gallery-navigation.js",
            }),
          },
        }),
      );

      expect(Object.keys(result.registry)).toEqual([
        "header-headroom",
        "gallery-navigation",
      ]);

      expect(result.registry["header-headroom"]?.id).toBe("header-headroom");

      expect(Object.values(result.registry)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "gallery-navigation",
          }),
        ]),
      );
    });

    it("preserves additional authored script properties", () => {
      const script = {
        ...createScript(),
        customProperty: "preserved",
      };

      const result = resolve(
        createAuthored({
          registry: {
            "header-headroom": script,
          },
        }),
      );

      expect(result.registry["header-headroom"]).toMatchObject({
        customProperty: "preserved",
      });
    });
  });

  describe("Inline script validation", () => {
    const createInlineScript = (
      overrides: Record<string, unknown> = {},
    ): Script =>
      ({
        kind: "inline",
        content: "console.log('initialised')",
        ...overrides,
      }) as Script;

    it("accepts an inline script without loading", () => {
      const result = resolve(
        createAuthored({
          registry: {
            "inline-bootstrap": createInlineScript(),
          },
        }),
      );

      expect(Object.values(result.registry)).toEqual([
        expect.objectContaining({
          id: "inline-bootstrap",
          kind: "inline",
          scriptType: "module",
          loading: null,
        }),
      ]);
    });

    it("rejects an inline script with defer loading", () => {
      expect(() =>
        resolve(
          createAuthored({
            registry: {
              "inline-bootstrap": createInlineScript({
                loading: "defer",
              }),
            },
          }),
        ),
      ).toThrow("Inline script cannot specify loading: inline-bootstrap");
    });

    it("rejects an inline script with async loading", () => {
      expect(() =>
        resolve(
          createAuthored({
            registry: {
              "inline-bootstrap": createInlineScript({
                loading: "async",
              }),
            },
          }),
        ),
      ).toThrow("Inline script cannot specify loading: inline-bootstrap");
    });

    it("accepts an explicitly undefined loading property", () => {
      const result = resolve(
        createAuthored({
          registry: {
            "inline-bootstrap": createInlineScript({
              loading: undefined,
            }),
          },
        }),
      );

      expect(Object.values(result.registry)[0]?.loading).toBeNull();
    });
  });

  describe("Global script resolution", () => {
    it("resolves registered global scripts", () => {
      const result = resolve(
        createAuthored({
          registry: {
            "header-headroom": createScript(),
          },
          global: ["header-headroom"] as Authored["global"],
        }),
      );

      expect(result.global).toEqual(["header-headroom"]);
    });

    it("preserves global script ordering", () => {
      const result = resolve(
        createAuthored({
          registry: {
            "header-headroom": createScript(),
            "gallery-navigation": createScript(),
          },
          global: [
            "gallery-navigation",
            "header-headroom",
          ] as Authored["global"],
        }),
      );

      expect(result.global).toEqual(["gallery-navigation", "header-headroom"]);
    });

    it("preserves duplicate global script references", () => {
      const result = resolve(
        createAuthored({
          registry: {
            "header-headroom": createScript(),
          },
          global: ["header-headroom", "header-headroom"] as Authored["global"],
        }),
      );

      expect(result.global).toEqual(["header-headroom", "header-headroom"]);
    });

    it("rejects a global script missing from the registry", () => {
      expect(() =>
        resolve(
          createAuthored({
            global: ["missing-script"] as Authored["global"],
          }),
        ),
      ).toThrow("Unknown global script: missing-script");
    });

    it("validates global scripts after resolving the registry", () => {
      expect(() =>
        resolve(
          createAuthored({
            registry: {
              "inline-bootstrap": {
                kind: "inline",
                content: "console.log('test')",
                loading: "defer",
              },
            } as unknown as Registry,
            global: ["missing-script"] as Authored["global"],
          }),
        ),
      ).toThrow("Inline script cannot specify loading: inline-bootstrap");
    });

    it("uses own properties rather than inherited registry keys", () => {
      const registry = Object.create({
        "inherited-script": createScript(),
      }) as Registry;

      expect(() =>
        resolve(
          createAuthored({
            registry,
            global: ["inherited-script"] as Authored["global"],
          }),
        ),
      ).toThrow("Unknown global script: inherited-script");
    });
  });

  describe("Data integrity", () => {
    it("does not mutate authored configuration", () => {
      const authored = createAuthored({
        registry: {
          "header-headroom": createScript(),
        },
        global: ["header-headroom"] as Authored["global"],
      });

      const original = {
        ...authored,
        registry: { ...authored.registry },
        global: [...authored.global],
      };

      resolve(authored);

      expect(authored).toEqual(original);
    });

    it("returns new registry and global objects", () => {
      const authored = createAuthored({
        registry: {
          "header-headroom": createScript(),
        },
        global: ["header-headroom"] as Authored["global"],
      });

      const result = resolve(authored);

      expect(result.registry).not.toBe(authored.registry);
      expect(result.global).not.toBe(authored.global);
      expect(result.registry["header-headroom"]).not.toBe(
        authored.registry["header-headroom"],
      );
    });

    it("preserves unrelated nested script properties", () => {
      const metadata = {
        owner: "site",
      };

      const script = {
        ...createScript(),
        metadata,
      };

      const result = resolve(
        createAuthored({
          registry: {
            "header-headroom": script,
          },
        }),
      );

      expect(result.registry["header-headroom"]).toEqual(
        expect.objectContaining({
          metadata,
        }),
      );
    });

    it("supports frozen authored configuration", () => {
      const registry = Object.freeze({
        "header-headroom": Object.freeze(createScript()),
      });

      const authored = Object.freeze(
        createAuthored({
          registry: registry,
          global: Object.freeze<Authored["global"]>(["header-headroom"]),
        }),
      );

      const result = resolve(authored);

      expect(result.global).toEqual(["header-headroom"]);
      expect(result.registry["header-headroom"]?.scriptType).toBe("module");
    });
  });
});
