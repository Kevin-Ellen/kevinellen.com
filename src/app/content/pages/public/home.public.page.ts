// src/app/content/pages/public/home.public.page.ts

// src/app/content/pages/public/home.public.page.ts

import type { HomePageDefinition } from "@shared-types/content/pages/public/home/home.public.page.definition";

export const homePage: HomePageDefinition = {
  core: {
    id: "home",
    kind: "home",
    slug: "/",
    label: "Home",
  },

  config: {
    robots: {
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    },
    robotsTxt: {
      disallow: false,
    },
    sitemap: {
      include: true,
    },
  },

  meta: {
    pageTitle: "Kevin Ellen",
    metaDescription:
      "Nature photography, field notes, journal writing, and technical architecture.",
  },

  breadcrumbs: ["home"],

  content: {
    head: {
      eyebrow: "Kevin Ellen",
      title: "Nature photography, writing, and technical architecture",
      intro:
        "A personal platform for photography, journal entries, articles, and transparent technical thinking.",
    },

    body: [
      {
        kind: "contentSection",
        heading: {
          text: "Introduction",
          visuallyHidden: true,
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              { kind: "text", value: "Homepage placeholder body content." },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "This section will later introduce featured photography, journal entries, and technical work.",
              },
            ],
          },
        ],
      },
    ],

    footer: [],
  },

  assets: {
    scripts: [],
    svgs: [],
  },

  structuredData: [],
};
