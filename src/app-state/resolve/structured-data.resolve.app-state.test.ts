// src/app-state/resolve/structured-data.resolve.app-state.test.ts

import { appStateResolveStructuredData } from "@app-state/resolve/structured-data.resolve.app-state";

describe("appStateResolveStructuredData", () => {
  it("resolves structured data from site config and social profiles", () => {
    expect(
      appStateResolveStructuredData(
        {
          siteName: "Kevin Ellen",
          author: "Kevin Ellen",
          description: "Nature, technical notes, and field journals.",
          language: "en-GB",

          person: {
            description: "Wildlife photographer and technical SEO specialist.",
            jobTitle: "Technical SEO Specialist",
            knowsAbout: ["Wildlife photography"],
            knowsLanguage: ["en-GB", "nl-NL"],
            additionalSameAs: ["https://www.imdb.com/name/nm5886775/"],
          },
        } as never,

        {
          github: {
            href: "https://github.com/Kevin-Ellen",
          },
          linkedin: {
            href: "https://www.linkedin.com/in/kevinellen/",
          },
        } as never,
      ),
    ).toEqual({
      website: {
        id: {
          pageId: "home",
          hash: "#website",
        },
        url: {
          pageId: "home",
        },
        name: "Kevin Ellen",
        description: "Nature, technical notes, and field journals.",
        inLanguage: "en-GB",
        publisherId: {
          pageId: "about",
          hash: "#person",
        },
      },

      person: {
        id: {
          pageId: "about",
          hash: "#person",
        },
        url: {
          pageId: "about",
        },
        name: "Kevin Ellen",
        description: "Wildlife photographer and technical SEO specialist.",
        jobTitle: "Technical SEO Specialist",
        knowsAbout: ["Wildlife photography"],
        knowsLanguage: ["en-GB", "nl-NL"],
        sameAs: [
          "https://github.com/Kevin-Ellen",
          "https://www.linkedin.com/in/kevinellen/",
          "https://www.imdb.com/name/nm5886775/",
        ],
      },
    });
  });
});
