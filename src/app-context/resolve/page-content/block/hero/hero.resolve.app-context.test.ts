// src/app-context/resolve/page-content/block/hero/hero.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateHeroBlock } from "@shared-types/page-content/block/hero/app-state.hero.block.types";
import type { PhotoId } from "@shared-types/media/photo/id.photo.types";

import { appContextResolveHeroBlock } from "@app-context/resolve/page-content/block/hero/hero.resolve.app-context";

describe("appContextResolveHeroBlock", () => {
  it("resolves the hero photo from context photos", () => {
    const block: AppStateHeroBlock = {
      kind: "hero",
      flow: "breakout",
      immersive: true,
      photoId: "coot" as PhotoId,
    };

    const photo = {
      id: "coot",
      title: "Coot",
    };

    const context = {
      resolvePhoto: jest.fn((photoId: PhotoId) => {
        if (photoId === ("coot" as PhotoId)) return photo;

        return null;
      }),
    } as unknown as AppContextPageContentResolverContext;

    const result = appContextResolveHeroBlock(block, context);

    expect(result).toEqual({
      kind: "hero",
      photoId: "coot",
      immersive: true,
      flow: "breakout",
      photo,
    });
  });

  it("throws when the hero photo is not resolved in context", () => {
    const block: AppStateHeroBlock = {
      kind: "hero",
      photoId: "missing-photo",
      immersive: false,
      flow: "content",
    };

    const context = {
      resolvePhoto: jest.fn(() => null),
    } as unknown as AppContextPageContentResolverContext;

    expect(() => appContextResolveHeroBlock(block, context)).toThrow(
      "No AppContext photo resolved for hero photoId: missing-photo",
    );
    expect(context.resolvePhoto).toHaveBeenCalledWith("missing-photo");
  });
});
