// tests/src/app-state/resolve/page-content/block/pre.resolve.app-state.test.ts

import { appStateResolvePreBlockContentModule } from "@app-state/resolve/page-content/block/pre.resolve.app-state";

import type { AuthoredPreBlockContentModule } from "@shared-types/page-content/block/pre/authored.pre.block.page-content.types";
import type { AppStatePreBlockContentModule } from "@shared-types/page-content/block/pre/app-state.pre.block.page-content.types";

describe("appStateResolvePreBlockContentModule", () => {
  it("returns pre block content with deterministic flow", () => {
    const module: AuthoredPreBlockContentModule = {
      kind: "pre",
      value: "const answer = 42;",
    };

    const result = appStateResolvePreBlockContentModule(module);

    const expected: AppStatePreBlockContentModule = {
      kind: "pre",
      value: "const answer = 42;",
      flow: "content",
    };

    expect(result).toEqual(expected);
  });

  it("preserves authored flow when provided", () => {
    const module: AuthoredPreBlockContentModule = {
      kind: "pre",
      value: "console.log('hello');",
      flow: "breakout",
    };

    const result = appStateResolvePreBlockContentModule(module);

    expect(result).toEqual({
      kind: "pre",
      value: "console.log('hello');",
      flow: "breakout",
    });
  });
});
