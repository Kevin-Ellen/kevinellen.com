// tests/src/app-context/resolve/page-content/global-footer.resolve.app-context.test.ts

import { resolveGlobalFooterAppContext } from "@app-context/resolve/page-content/global-footer.resolve.app-context";

describe("resolveGlobalFooterAppContext", () => {
  const globalFooter = {
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
      ],
    },
    colophon: {
      kind: "colophon",
      copyrightName: "Kevin Ellen",
      copyrightYear: 2026,
      allRightsReserved: true,
    },
  } as const;

  it("returns the expected global footer shape", () => {
    const result = resolveGlobalFooterAppContext(globalFooter);

    expect(result).toEqual({
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
        ],
      },
      colophon: {
        kind: "colophon",
        copyrightName: "Kevin Ellen",
        copyrightYear: 2026,
        allRightsReserved: true,
      },
    });
  });

  it("returns a new top-level object", () => {
    const result = resolveGlobalFooterAppContext(globalFooter);

    expect(result).not.toBe(globalFooter);
  });

  it("returns new nested objects and arrays", () => {
    const result = resolveGlobalFooterAppContext(globalFooter);

    expect(result.affiliations).not.toBe(globalFooter.affiliations);
    expect(result.affiliations.items).not.toBe(globalFooter.affiliations.items);
    expect(result.affiliations.items[0]).not.toBe(
      globalFooter.affiliations.items[0],
    );
    expect(result.affiliations.items[1]).not.toBe(
      globalFooter.affiliations.items[1],
    );
    expect(result.colophon).not.toBe(globalFooter.colophon);
  });
});
