// src/app-state/resolve/pages/public/assets.resolve.app-state.test.ts

import { appStateResolvePageAssets } from "@app-state/resolve/pages/public/assets.resolve.app-state";

describe("appStateResolvePageAssets", () => {
  it("defaults missing assets to empty arrays", () => {
    expect(appStateResolvePageAssets(undefined)).toEqual({
      scripts: [],
      svg: [],
    });
  });

  it("preserves authored assets", () => {
    expect(
      appStateResolvePageAssets({
        scripts: ["article"],
        svg: ["arrow"],
      } as never),
    ).toEqual({
      scripts: ["article"],
      svg: ["arrow"],
    });
  });
});
