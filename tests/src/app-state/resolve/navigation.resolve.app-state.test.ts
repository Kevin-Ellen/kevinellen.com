// tests/src/app-state/resolve/navigation.resolve.app-state.test.ts

import { appStateResolveNavigation } from "@app-state/resolve/navigation.resolve.app-state";

import { authoredHeaderNavigation } from "@app-state/config/navigation/authored.header.navigation.app-state";
import { authoredFooterNavigation } from "@app-state/config/navigation/authored.footer.navigation.app-state";

describe("appStateResolveNavigation", () => {
  it("composes navigation from authored header and footer navigation", () => {
    expect(appStateResolveNavigation).toEqual({
      header: authoredHeaderNavigation,
      footer: authoredFooterNavigation,
    });
  });

  it("preserves references to authored navigation config", () => {
    expect(appStateResolveNavigation.header).toBe(authoredHeaderNavigation);
    expect(appStateResolveNavigation.footer).toBe(authoredFooterNavigation);
  });

  it("is deeply frozen", () => {
    expect(Object.isFrozen(appStateResolveNavigation)).toBe(true);
    expect(Object.isFrozen(appStateResolveNavigation.header)).toBe(true);
    expect(Object.isFrozen(appStateResolveNavigation.footer)).toBe(true);
  });

  it("prevents mutation of top-level properties", () => {
    expect(() => {
      (appStateResolveNavigation as Record<string, unknown>).header = [];
    }).toThrow();
  });
});
