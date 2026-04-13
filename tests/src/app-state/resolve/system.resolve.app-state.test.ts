// tests/src/app-state/resolve/system.resolve.app-state.test.ts

import { appStateResolveSystem } from "@app-state/resolve/system.resolve.app-state";

import { REDIRECT_RULES } from "@app-state/config/system/authored.redirect-rules.system.app-state";
import { GONE_RULES } from "@app-state/config/system/authored.gone-rules.system.app-state";

describe("appStateResolveSystem", () => {
  it("composes system config from authored redirect and gone rules", () => {
    expect(appStateResolveSystem).toEqual({
      redirectRules: REDIRECT_RULES,
      goneRules: GONE_RULES,
    });
  });

  it("preserves references to authored rules", () => {
    expect(appStateResolveSystem.redirectRules).toBe(REDIRECT_RULES);
    expect(appStateResolveSystem.goneRules).toBe(GONE_RULES);
  });

  it("is deeply frozen", () => {
    expect(Object.isFrozen(appStateResolveSystem)).toBe(true);
    expect(Object.isFrozen(appStateResolveSystem.redirectRules)).toBe(true);
    expect(Object.isFrozen(appStateResolveSystem.goneRules)).toBe(true);
  });

  it("prevents mutation of top-level properties", () => {
    expect(() => {
      (appStateResolveSystem as Record<string, unknown>).redirectRules = [];
    }).toThrow();
  });
});
