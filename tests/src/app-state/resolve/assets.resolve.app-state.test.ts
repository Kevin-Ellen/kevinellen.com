// tests/src/app-state/resolve/assets.resolve.app-state.test.ts

import { appStateResolveAssets } from "@app-state/resolve/assets.resolve.app-state";

import { AUTHORED_SCRIPT_ASSETS } from "@app-state/config/assets/authored.scripts.assets.app-state";
import { AUTHORED_SVG_ASSETS } from "@app-state/config/assets/authored.svg.assets.app-state";

describe("appStateResolveAssets", () => {
  it("composes assets from authored sources", () => {
    expect(appStateResolveAssets).toEqual({
      scripts: AUTHORED_SCRIPT_ASSETS,
      svg: AUTHORED_SVG_ASSETS,
    });
  });

  it("preserves references to authored assets", () => {
    expect(appStateResolveAssets.scripts).toBe(AUTHORED_SCRIPT_ASSETS);
    expect(appStateResolveAssets.svg).toBe(AUTHORED_SVG_ASSETS);
  });

  it("is deeply frozen", () => {
    expect(Object.isFrozen(appStateResolveAssets)).toBe(true);
    expect(Object.isFrozen(appStateResolveAssets.scripts)).toBe(true);
    expect(Object.isFrozen(appStateResolveAssets.svg)).toBe(true);
  });

  it("prevents mutation of top-level properties", () => {
    expect(() => {
      (appStateResolveAssets as any).scripts = [];
    }).toThrow();
  });

  it("prevents mutation of nested structures", () => {
    if (appStateResolveAssets.scripts.length > 0) {
      expect(() => {
        (appStateResolveAssets.scripts as any)[0] = {};
      }).toThrow();
    }

    if (appStateResolveAssets.svg.length > 0) {
      expect(() => {
        (appStateResolveAssets.svg as any)[0] = {};
      }).toThrow();
    }
  });
});
