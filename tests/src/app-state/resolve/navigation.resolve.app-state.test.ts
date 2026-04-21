// tests/src/app-state/resolve/navigation.resolve.app-state.test.ts

import { appStateResolveNavigation } from "@app-state/resolve/navigation.resolve.app-state";

describe("appStateResolveNavigation", () => {
  it("composes deterministic header and footer navigation", () => {
    expect(appStateResolveNavigation).toEqual({
      header: {
        primary: [
          {
            kind: "internal",
            id: "about",
            svgId: null,
            behaviour: {
              openInNewTab: false,
            },
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
          },
          {
            kind: "social",
            id: "instagram",
            svgId: "icon-instagram",
            behaviour: {
              openInNewTab: true,
            },
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
              },
            ],
          },
          {
            id: "practice",
            label: "Practice",
            items: [
              {
                kind: "internal",
                id: "about-equipment",
                svgId: null,
                behaviour: {
                  openInNewTab: false,
                },
              },
            ],
          },
          {
            id: "elsewhere",
            label: "Elsewhere",
            items: [
              {
                kind: "social",
                id: "github",
                svgId: null,
                behaviour: {
                  openInNewTab: true,
                },
              },
              {
                kind: "social",
                id: "instagram",
                svgId: null,
                behaviour: {
                  openInNewTab: true,
                },
              },
              {
                kind: "social",
                id: "linkedin",
                svgId: null,
                behaviour: {
                  openInNewTab: true,
                },
              },
            ],
          },
          {
            id: "legal",
            label: "Legal",
            items: [
              {
                kind: "internal",
                id: "privacy",
                svgId: null,
                behaviour: {
                  openInNewTab: false,
                },
              },
              {
                kind: "internal",
                id: "terms",
                svgId: null,
                behaviour: {
                  openInNewTab: false,
                },
              },
              {
                kind: "internal",
                id: "licensing",
                svgId: null,
                behaviour: {
                  openInNewTab: false,
                },
              },
            ],
          },
        ],
      },
    });
  });

  it("is deeply frozen", () => {
    expect(Object.isFrozen(appStateResolveNavigation)).toBe(true);
    expect(Object.isFrozen(appStateResolveNavigation.header)).toBe(true);
    expect(Object.isFrozen(appStateResolveNavigation.footer)).toBe(true);
  });

  it("prevents mutation of top-level properties", () => {
    expect(() => {
      (appStateResolveNavigation as Record<string, unknown>).header = [];
    }).toThrow();
  });
});
