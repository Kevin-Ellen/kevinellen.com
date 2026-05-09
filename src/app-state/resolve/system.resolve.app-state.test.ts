// src/app-state/resolve/system.resolve.app-state.test.ts

import { appStateResolveSystem } from "@app-state/resolve/system.resolve.app-state";
import { REDIRECT_RULES } from "@app-state/config/system/authored.redirect-rules.system.app-state";
import { GONE_RULES } from "@app-state/config/system/authored.gone-rules.system.app-state";

describe("appStateResolveSystem", () => {
  it("resolves authored system rules", () => {
    expect(appStateResolveSystem).toEqual({
      redirectRules: REDIRECT_RULES,
      goneRules: GONE_RULES,
    });
  });
});
