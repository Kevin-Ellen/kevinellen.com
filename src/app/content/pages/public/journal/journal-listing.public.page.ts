// src/app/content/pages/public/journal-listing.public.page.ts

import type { JournalListingPageDefinition } from "@shared-types/content/pages/public/journal-listing/journal-listing.public.page.definition";

const PAGE_SIZE = 10;

export const journalListingPage: JournalListingPageDefinition = {
  core: {
    id: "journal",
    kind: "journal-listing",
    slug: "/journal",
    label: "Journal",
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
    pageTitle: "Journal | Kevin Ellen",
    metaDescription:
      "Field notes, reflections, and journal entries on photography, nature, and technical work.",
  },

  breadcrumbs: ["home", "journal"],

  content: {
    head: {
      eyebrow: "Field Notes",
      title: "Journal",
      intro:
        "A running collection of observations, thoughts, and quieter notes from photography, nature, and building things carefully.",
    },

    body: [
      {
        kind: "contentSection",
        heading: {
          text: "Journal entries",
          visuallyHidden: true,
          level: 2,
        },
        modules: [
          {
            kind: "journalListing",
            pagination: {
              pageSize: PAGE_SIZE,
            },
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
