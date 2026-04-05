// src/app/appContext/resolvers/footer.resolve.appContext.test.ts

import { resolveFooterAppContext } from "@app/appContext/resolvers/footer.resolve.appContext";
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
        },
        {
          id: "national-trust",
          label: "National Trust",
          href: "https://www.nationaltrust.org.uk/",
          svgId: "logo-national-trust",
        },
        {
          id: "vogelbescherming-nederland",
          label: "Vogelbescherming Nederland",
          href: "https://www.vogelbescherming.nl/",
          svgId: "logo-vogelbescherming-nederland",
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
});
