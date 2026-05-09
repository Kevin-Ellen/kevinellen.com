// src/app-state/resolve/assets.resolve.app-state.test.ts

import { appStateResolveAssets } from "@app-state/resolve/assets.resolve.app-state";
import { AUTHORED_SCRIPT_ASSETS } from "@app-state/config/assets/authored.scripts.assets.app-state";
import { AUTHORED_SVG_ASSETS } from "@app-state/config/assets/authored.svg.assets.app-state";

describe("appStateResolveAssets", () => {
  it("resolves authored script and SVG assets", () => {
    expect(appStateResolveAssets).toEqual({
      scripts: AUTHORED_SCRIPT_ASSETS,
      svg: AUTHORED_SVG_ASSETS,
    });
  });
});
