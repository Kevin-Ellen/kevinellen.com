// src/app-state/resolve/page-content/block/hero.resolve.app-state.test.ts

import { appStateResolveHeroBlock } from "@app-state/resolve/page-content/block/hero/hero.resolve.app-state";

describe("appStateResolveHeroBlock", () => {
  it("applies deterministic defaults", () => {
    expect(
      appStateResolveHeroBlock({
        kind: "hero",
        photoId: "hero-photo",
      } as never),
    ).toEqual({
      kind: "hero",
      photoId: "hero-photo",
      immersive: false,
      flow: "content",
    });
  });

  it("preserves authored values", () => {
    expect(
      appStateResolveHeroBlock({
        kind: "hero",
        photoId: "hero-photo",
        immersive: true,
        flow: "breakout",
      } as never),
    ).toEqual({
      kind: "hero",
      photoId: "hero-photo",
      immersive: true,
      flow: "breakout",
    });
  });
});
