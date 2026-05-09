// src/app-context/resolve/page-content/block/pre.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStatePreBlock } from "@shared-types/page-content/block/pre/app-state.pre.block.types";

import { appContextResolvePreBlock } from "@app-context/resolve/page-content/block/pre.resolve.app-context";

describe("appContextResolvePreBlock", () => {
  it("returns the pre block unchanged", () => {
    const context = {} as AppContextPageContentResolverContext;

    const block: AppStatePreBlock = {
      kind: "pre",
      flow: "content",
      value: "const hello = 'world';",
    };

    const result = appContextResolvePreBlock(block, context);

    expect(result).toEqual(block);
    expect(result).toBe(block);
  });
});
