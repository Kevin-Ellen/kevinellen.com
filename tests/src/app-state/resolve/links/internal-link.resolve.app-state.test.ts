// tests/src/app-state/resolve/links/internal-link.resolve.app-state.test.ts

import { appStateResolveInternalLink } from "@app-state/resolve/links/internal.link.resolve.app-state";

import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import {
  makeAuthoredInternalLink,
  makeAppStateInternalLink,
} from "@tests/src/app-state/test-support/factories/resolve/links/internal-link.factory";

const SVG_ID: SvgAssetId = "icon-home";

describe("appStateResolveInternalLink", () => {
  it("defaults svgId to null when omitted", () => {
    const result = appStateResolveInternalLink(
      makeAuthoredInternalLink({
        id: "about",
      }),
    );

    expect(result.svgId).toBeNull();
  });

  it("preserves svgId when provided", () => {
    const result = appStateResolveInternalLink(
      makeAuthoredInternalLink({
        id: "about",
        svgId: SVG_ID,
      }),
    );

    expect(result.svgId).toBe(SVG_ID);
  });

  it("defaults behaviour to openInNewTab false when omitted", () => {
    const result = appStateResolveInternalLink(
      makeAuthoredInternalLink({
        id: "about",
      }),
    );

    expect(result.behaviour).toEqual({
      openInNewTab: false,
    });
  });

  it("preserves authored behaviour when provided", () => {
    const result = appStateResolveInternalLink(
      makeAuthoredInternalLink({
        id: "about",
        behaviour: {
          openInNewTab: true,
        },
      }),
    );

    expect(result.behaviour).toEqual({
      openInNewTab: true,
    });
  });

  it("returns the expected AppState link shape", () => {
    const result = appStateResolveInternalLink(
      makeAuthoredInternalLink({
        id: "about",
        svgId: SVG_ID,
      }),
    );

    expect(result).toEqual(
      makeAppStateInternalLink({
        id: "about",
        svgId: SVG_ID,
      }),
    );
  });
});
