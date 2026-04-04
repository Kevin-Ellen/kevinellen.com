// src/app/appContext/resolvers/footer.resolve.appContext.test.ts

import { resolveFooterAppContext } from "@app/appContext/resolvers/footer.resolve.appContext";
import { AppState } from "@app/appState/class.appState";
import { createAppState } from "@app/appState/create.appState";

describe("resolveFooterAppContext", () => {
  const appState = createAppState();

  it("resolves affiliations and colophon from footer config", () => {
    const result = resolveFooterAppContext(appState);

    expect(result.affiliations).toEqual({
      title: "Conservation",
      description:
        "Supporting organisations that protect habitats, species, and access to nature.",
      items: [
        {
          id: "rspb",
          label: "RSPB",
          href: "https://www.rspb.org.uk/",
          svgId: "logo-rspb",
          viewBox: "0 0 81 81",
          width: 81,
          height: 81,
        },
        {
          id: "national-trust",
          label: "National Trust",
          href: "https://www.nationaltrust.org.uk/",
          svgId: "logo-national-trust",
          viewBox: "0 0 48 48",
          width: 48,
          height: 48,
        },
        {
          id: "vogelbescherming-nederland",
          label: "Vogelbescherming Nederland",
          href: "https://www.vogelbescherming.nl/",
          svgId: "logo-vogelbescherming-nederland",
          viewBox: "0 0 829 392",
          width: 829,
          height: 392,
        },
      ],
    });

    expect(result.colophon).toEqual({
      copyrightName: "Kevin Ellen",
      copyrightYear: 2026,
    });
  });

  it("returns a frozen footer context object", () => {
    const result = resolveFooterAppContext(appState);

    expect(Object.isFrozen(result)).toBe(true);
  });

  it("throws when a footer affiliation svg asset cannot be resolved", () => {
    const brokenAppState = Object.create(appState) as AppState;

    brokenAppState.getAssetsConfig = () => ({
      ...appState.getAssetsConfig(),
      svgs: appState
        .getAssetsConfig()
        .svgs.filter((svg) => svg.id !== "logo-rspb"),
    });

    expect(() => resolveFooterAppContext(brokenAppState)).toThrow(
      "Missing SVG asset for footer affiliation: logo-rspb",
    );
  });

  it("throws when a footer affiliation svg has an invalid viewBox shape", () => {
    const brokenAppState = Object.create(appState) as AppState;

    brokenAppState.getAssetsConfig = () => ({
      ...appState.getAssetsConfig(),
      svgs: appState.getAssetsConfig().svgs.map((svg) =>
        svg.id === "logo-rspb"
          ? {
              ...svg,
              viewBox: "0 0 76",
            }
          : svg,
      ),
    });

    expect(() => resolveFooterAppContext(brokenAppState)).toThrow(
      "Invalid viewBox: 0 0 76",
    );
  });

  it("throws when a footer affiliation svg has invalid viewBox dimensions", () => {
    const brokenAppState = Object.create(appState) as AppState;

    brokenAppState.getAssetsConfig = () => ({
      ...appState.getAssetsConfig(),
      svgs: appState.getAssetsConfig().svgs.map((svg) =>
        svg.id === "logo-rspb"
          ? {
              ...svg,
              viewBox: "0 0 0 81",
            }
          : svg,
      ),
    });

    expect(() => resolveFooterAppContext(brokenAppState)).toThrow(
      "Invalid viewBox dimensions: 0 0 0 81",
    );
  });
});
