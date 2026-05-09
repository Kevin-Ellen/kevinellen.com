// src/app-state/resolve/links/internal.link.resolve.app-state.test.ts

import { appStateResolveInternalLink } from "@app-state/resolve/links/internal.link.resolve.app-state";

describe("appStateResolveInternalLink", () => {
  it("resolves internal links with deterministic defaults", () => {
    expect(
      appStateResolveInternalLink({
        kind: "internal",
        id: "home",
      } as never),
    ).toEqual({
      kind: "internal",
      id: "home",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    });
  });

  it("preserves authored optional fields", () => {
    expect(
      appStateResolveInternalLink({
        kind: "internal",
        id: "journal",
        text: "Journal",
        svgId: "book",
        behaviour: {
          openInNewTab: true,
        },
      } as never),
    ).toEqual({
      kind: "internal",
      id: "journal",
      text: "Journal",
      svgId: "book",
      behaviour: {
        openInNewTab: true,
      },
    });
  });
});
