// src/app-state/resolve/links/social.link.resolve.app-state.test.ts

import { appStateResolveSocialLink } from "@app-state/resolve/links/social.link.resolve.app-state";

describe("appStateResolveSocialLink", () => {
  it("resolves social links with deterministic text, svg default, and behaviour", () => {
    expect(
      appStateResolveSocialLink({
        kind: "social",
        id: "github",
      } as never),
    ).toEqual({
      kind: "social",
      id: "github",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    });
  });

  it("preserves authored svg id", () => {
    expect(
      appStateResolveSocialLink({
        kind: "social",
        id: "github",
        svgId: "github",
      } as never),
    ).toEqual({
      kind: "social",
      id: "github",
      text: null,
      svgId: "github",
      behaviour: {
        openInNewTab: true,
      },
    });
  });
});
