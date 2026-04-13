// tests/src/app-state/test-support/factories/resolve/links/internal-link.factory.test.ts

import {
  makeAppStateInternalLink,
  makeAuthoredInternalLink,
  makeAuthoredInternalLinkWithSvg,
} from "@tests/src/app-state/test-support/factories/resolve/links/internal-link.factory";

describe("internal link test-support factory", () => {
  it("builds default authored and app-state internal links", () => {
    expect(makeAuthoredInternalLink()).toEqual({
      kind: "internal",
      id: "home",
    });

    expect(makeAppStateInternalLink()).toEqual({
      kind: "internal",
      id: "home",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    });
  });

  it("builds an authored internal link with a default svgId helper", () => {
    expect(makeAuthoredInternalLinkWithSvg()).toEqual({
      kind: "internal",
      id: "home",
      svgId: "icon-home",
    });
  });
});
