// src/shared/config/assets/scripts.assets.config.shared.app-init.test.ts

import { AUTHORED_SCRIPT_ASSETS } from "../../../app/assets/scripts/registry.scripts.assets";

import { scriptsAssetsConfigAuthored } from "./scripts.assets.config.shared.app-init";

describe("Scripts assets configuration", () => {
  describe("Registry", () => {
    it("registers every authored script asset", () => {
      expect(Object.keys(scriptsAssetsConfigAuthored.registry)).toHaveLength(
        AUTHORED_SCRIPT_ASSETS.length,
      );
    });

    it("indexes scripts by their authored IDs", () => {
      for (const asset of AUTHORED_SCRIPT_ASSETS) {
        expect(scriptsAssetsConfigAuthored.registry[asset.id]).toBe(asset);
      }
    });

    it("does not contain duplicate script IDs", () => {
      const ids = AUTHORED_SCRIPT_ASSETS.map((asset) => asset.id);

      expect(new Set(ids).size).toBe(ids.length);
    });

    it("does not contain unexpected registry entries", () => {
      const authoredIds = AUTHORED_SCRIPT_ASSETS.map((asset) => asset.id);

      expect(Object.keys(scriptsAssetsConfigAuthored.registry).sort()).toEqual(
        [...authoredIds].sort(),
      );
    });
  });

  describe("Global scripts", () => {
    it("registers the header headroom script globally", () => {
      expect(scriptsAssetsConfigAuthored.global).toContain("header-headroom");
    });

    it("references only scripts present in the registry", () => {
      for (const id of scriptsAssetsConfigAuthored.global) {
        expect(scriptsAssetsConfigAuthored.registry).toHaveProperty(id);
      }
    });

    it("does not register duplicate global scripts", () => {
      const ids = scriptsAssetsConfigAuthored.global;

      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
