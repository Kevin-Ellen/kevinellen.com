// src/shared/config/assets/svg.assets.config.shared.app-init.test.ts

import { AUTHORED_SVG_ASSETS } from "../../../app/assets/svg/registry.svg.assets";
import { svgAssetsConfigAuthored } from "./svg.assets.config.shared.app-init";

describe("SVG assets configuration", () => {
  it("registers every authored SVG asset", () => {
    expect(Object.keys(svgAssetsConfigAuthored)).toHaveLength(
      AUTHORED_SVG_ASSETS.length,
    );

    for (const asset of AUTHORED_SVG_ASSETS) {
      expect(svgAssetsConfigAuthored[asset.id]).toEqual(asset);
    }
  });

  it("uses SVG asset IDs as registry keys", () => {
    expect(Object.keys(svgAssetsConfigAuthored)).toEqual(
      AUTHORED_SVG_ASSETS.map((asset) => asset.id),
    );
  });

  it("preserves the original SVG asset references", () => {
    for (const asset of AUTHORED_SVG_ASSETS) {
      expect(svgAssetsConfigAuthored[asset.id]).toBe(asset);
    }
  });

  it("does not contain duplicate SVG asset IDs", () => {
    const ids = AUTHORED_SVG_ASSETS.map((asset) => asset.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not introduce additional registry entries", () => {
    const expected = Object.fromEntries(
      AUTHORED_SVG_ASSETS.map((asset) => [asset.id, asset]),
    );

    expect(svgAssetsConfigAuthored).toEqual(expected);
  });

  it("contains no undefined asset values", () => {
    expect(
      Object.values(svgAssetsConfigAuthored).every(
        (asset) => asset !== undefined,
      ),
    ).toBe(true);
  });
});
