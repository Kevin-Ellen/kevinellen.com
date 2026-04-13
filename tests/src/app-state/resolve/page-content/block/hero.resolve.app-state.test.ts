// tests/src/app-state/resolve/page-content/block/hero.resolve.app-state.test.ts

import { appStateResolveHeroBlockContentModule } from "@app-state/resolve/page-content/block/hero.resolve.app-state";

import type { AuthoredHeroBlockContentModule } from "@shared-types/page-content/block/hero/authored.hero.block.page-content.types";
import type { AppStateHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-state.hero.block.page-content.types";

describe("appStateResolveHeroBlockContentModule", () => {
  it("defaults immersive to false and flow to content when omitted", () => {
    const module: AuthoredHeroBlockContentModule = {
      kind: "hero",
      photoId: "hero-photo",
    };

    const result = appStateResolveHeroBlockContentModule(module);

    const expected: AppStateHeroBlockContentModule = {
      kind: "hero",
      photoId: "hero-photo",
      immersive: false,
      flow: "content",
    };

    expect(result).toEqual(expected);
  });

  it("preserves immersive when provided", () => {
    const module: AuthoredHeroBlockContentModule = {
      kind: "hero",
      photoId: "hero-photo",
      immersive: true,
    };

    const result = appStateResolveHeroBlockContentModule(module);

    expect(result.immersive).toBe(true);
  });

  it("preserves flow when provided", () => {
    const module: AuthoredHeroBlockContentModule = {
      kind: "hero",
      photoId: "hero-photo",
      flow: "breakout",
    };

    const result = appStateResolveHeroBlockContentModule(module);

    expect(result.flow).toBe("breakout");
  });

  it("returns the expected AppState hero shape", () => {
    const module: AuthoredHeroBlockContentModule = {
      kind: "hero",
      photoId: "hero-photo",
      immersive: true,
      flow: "breakout",
    };

    const result = appStateResolveHeroBlockContentModule(module);

    const expected: AppStateHeroBlockContentModule = {
      kind: "hero",
      photoId: "hero-photo",
      immersive: true,
      flow: "breakout",
    };

    expect(result).toEqual(expected);
  });
});
