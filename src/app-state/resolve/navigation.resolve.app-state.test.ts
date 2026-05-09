// src/app-state/resolve/navigation.resolve.app-state.test.ts

import { appStateResolveNavigation } from "@app-state/resolve/navigation.resolve.app-state";
import { authoredHeaderNavigation } from "@app-state/config/navigation/authored.header.navigation.app-state";
import { authoredFooterNavigation } from "@app-state/config/navigation/authored.footer.navigation.app-state";
import { resolveLinkAppState } from "@app-state/resolve/links/link.resolve.app-state";

jest.mock("@app-state/resolve/links/link.resolve.app-state", () => ({
  resolveLinkAppState: jest.fn((link) => ({
    ...link,
    resolved: true,
  })),
}));

describe("appStateResolveNavigation", () => {
  it("resolves header and footer navigation links", () => {
    expect(appStateResolveNavigation.header.primary).toEqual(
      authoredHeaderNavigation.primary.map((link) => ({
        ...link,
        resolved: true,
      })),
    );

    expect(appStateResolveNavigation.header.social).toEqual(
      authoredHeaderNavigation.social.map((link) => ({
        ...link,
        resolved: true,
      })),
    );

    expect(appStateResolveNavigation.footer.sections).toEqual(
      authoredFooterNavigation.sections.map((section) => ({
        ...section,
        items: section.items.map((link) => ({
          ...link,
          resolved: true,
        })),
      })),
    );

    expect(resolveLinkAppState).toHaveBeenCalled();
  });
});
