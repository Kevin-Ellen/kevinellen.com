// tests/src/app-context/resolve/page/content/block/hero.resolve.app-context.test.ts

import { appContextResolveHeroBlockContentModule } from "@app-context/resolve/page/content/block/hero.resolve.app-context";

describe("appContextResolveHeroBlockContentModule", () => {
  it("returns the hero module unchanged", () => {
    const module = {
      kind: "hero",
      photoId: "photo-hero-about",
      immersive: false,
      flow: "breakout",
    } as const;

    const result = appContextResolveHeroBlockContentModule(module, {} as never);

    expect(result).toBe(module);
  });
});
