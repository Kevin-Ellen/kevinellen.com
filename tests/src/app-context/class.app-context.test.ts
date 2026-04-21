// tests/src/app-context/class.app-context.test.ts

import { AppContext } from "@app-context/class.app-context";

import type { AppContextData } from "@app-context/app-context.types";

describe("AppContext", () => {
  /**
   * Important:
   * This fixture must reflect the real AppContext runtime contract.
   *
   * Do not weaken this test with `as unknown as AppContextData`.
   * AppContext is a runtime boundary, so the data shape used here
   * should match the real resolved structure as closely as possible.
   *
   * If this becomes cumbersome, extract proper AppContext test factories.
   *
   * `inspect` is intentionally DEV-only and exists for inspection
   * endpoints. It is not the general runtime access pattern.
   */
  const mockData: AppContextData = {
    navigation: {
      header: {
        primary: [
          {
            kind: "internal",
            id: "about",
            svgId: null,
            behaviour: {
              openInNewTab: false,
            },
            href: "/about",
            text: "About",
          },
        ],
        social: [
          {
            kind: "social",
            id: "github",
            svgId: "icon-github",
            behaviour: {
              openInNewTab: true,
            },
            href: "https://github.com/Kevin-Ellen",
            text: "GitHub",
          },
        ],
      },
      footer: {
        sections: [
          {
            id: "site",
            label: "Site",
            items: [
              {
                kind: "internal",
                id: "about",
                svgId: null,
                behaviour: {
                  openInNewTab: false,
                },
                href: "/about",
                text: "About",
              },
            ],
          },
        ],
      },
    },
    globalFooter: {
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
        ],
      },
      colophon: {
        kind: "colophon",
        copyrightName: "Kevin Ellen",
        copyrightYear: 2026,
        allRightsReserved: true,
      },
    },
    assets: {
      scripts: [
        {
          id: "header-condense",
          kind: "inline",
          content: "console.log('header');",
          location: "footer",
        },
      ],
      svg: [
        {
          id: "logo-monogram-ke",
          viewBox: "0 0 4020 4020",
          content: "<path />",
        },
      ],
    },
    structuredData: [
      {
        id: "website",
        json: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://dev.kevinellen.com/#website",
          url: "https://dev.kevinellen.com/",
          name: "Kevin Ellen",
          description:
            "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
          inLanguage: "en-GB",
          publisher: {
            "@id": "https://dev.kevinellen.com/about#person",
          },
        },
      },
    ],
    breadcrumbs: {
      items: [
        {
          kind: "internal",
          id: "home",
          svgId: null,
          behaviour: {
            openInNewTab: false,
          },
          href: "/",
          text: "Home",
        },
      ],
      current: "About",
    },
    page: {
      id: "about",
      kind: "static",
      slug: "/about",
      label: "About",
      content: {
        head: {
          eyebrow: "Kevin Ellen",
          title: "About me",
          intro:
            "This site brings together two long-standing interests: nature and technology.",
        },
        body: [
          {
            kind: "contentSection",
            heading: {
              text: "A bit about me",
              visuallyHidden: true,
              level: 2,
            },
            modules: [
              {
                kind: "paragraph",
                content: [
                  {
                    kind: "text",
                    value: "I am a technical SEO professional.",
                  },
                ],
              },
            ],
          },
        ],
        footer: [],
      },
    },
  };

  it("stores the provided app context data", () => {
    const appContext = new AppContext(mockData);

    expect(appContext.inspect).toBe(mockData);
  });

  it("returns navigation from the provided data", () => {
    const appContext = new AppContext(mockData);

    expect(appContext.navigation).toBe(mockData.navigation);
  });

  it("returns globalFooter from the provided data", () => {
    const appContext = new AppContext(mockData);

    expect(appContext.globalFooter).toBe(mockData.globalFooter);
  });

  it("returns structuredData from the provided data", () => {
    const appContext = new AppContext(mockData);

    expect(appContext.structuredData).toBe(mockData.structuredData);
  });

  it("returns the full original object through inspect", () => {
    const appContext = new AppContext(mockData);

    expect(appContext.inspect).toEqual(mockData);
  });

  it("returns stable references across repeated getter calls", () => {
    const appContext = new AppContext(mockData);

    expect(appContext.navigation).toBe(appContext.navigation);
    expect(appContext.globalFooter).toBe(appContext.globalFooter);
    expect(appContext.structuredData).toBe(appContext.structuredData);
    expect(appContext.inspect).toBe(appContext.inspect);
  });
});
