// tests/src/app-state/resolve/pages/public/assets.resolve.app-state.test.ts

import { appStateResolvePageAssets } from "@app-state/resolve/pages/public/assets.resolve.app-state";

import type { AuthoredAssets } from "@shared-types/pages/shared/assets/authored.assets.shared.page.types";
import type { AppStateAssets } from "@shared-types/pages/shared/assets/app-state.assets.shared.page.types";

describe("appStateResolvePageAssets", () => {
  it("defaults scripts and svg to empty arrays when assets are omitted", () => {
    const result = appStateResolvePageAssets(undefined);

    const expected: AppStateAssets = {
      scripts: [],
      svg: [],
    };

    expect(result).toEqual(expected);
  });

  it("preserves provided scripts and svg assets", () => {
    const scripts = [{ id: "header-condense" }] as never[];
    const svg = [{ id: "icon-home" }] as never[];

    const assets: AuthoredAssets = {
      scripts,
      svg,
    };

    const result = appStateResolvePageAssets(assets);

    expect(result).toEqual({
      scripts,
      svg,
    });
  });

  it("defaults missing scripts to an empty array", () => {
    const svg = [{ id: "icon-home" }] as never[];

    const result = appStateResolvePageAssets({
      svg,
    });

    expect(result).toEqual({
      scripts: [],
      svg,
    });
  });

  it("defaults missing svg to an empty array", () => {
    const scripts = [{ id: "header-condense" }] as never[];

    const result = appStateResolvePageAssets({
      scripts,
    });

    expect(result).toEqual({
      scripts,
      svg: [],
    });
  });
});
