// src/app-render-context/resolve/body-content/block/pre/pre.resolve.app-render-context.test.ts

import type { AppContextPreBlock } from "@shared-types/page-content/block/pre/app-context.pre.block.types";

import { appRenderContextResolvePreBlock } from "@app-render-context/resolve/body-content/block/pre/pre.resolve.app-render-context";

describe("appRenderContextResolvePreBlock", () => {
  it("returns the pre block unchanged", () => {
    const block: AppContextPreBlock = {
      kind: "pre",
      flow: "content",
      value: "const coot = true;",
    };

    expect(appRenderContextResolvePreBlock(block)).toEqual(block);
  });
});
