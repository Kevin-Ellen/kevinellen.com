// src/app-state/config/global-footer/authored.global-footer.app-state.test.ts

import { appStateGlobalFooterAuthored } from "@app-state/config/global-footer/authored.global-footer.app-state";

describe("appStateGlobalFooterAuthored", () => {
  it("defines conservation affiliations", () => {
    expect(appStateGlobalFooterAuthored).toEqual({
      affiliations: {
        kind: "affiliations",
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
      },
    });
  });

  it("contains three affiliation entries", () => {
    expect(appStateGlobalFooterAuthored.affiliations.items).toHaveLength(3);
  });

  it("uses unique affiliation ids", () => {
    const ids = appStateGlobalFooterAuthored.affiliations.items.map(
      (item) => item.id,
    );

    expect(new Set(ids).size).toBe(ids.length);
  });
});
