// src/app/pages/public/journal.page.ts

import type { PageDefinition } from "@app/pages/page.definition";

export const journalPage: PageDefinition = {
  core: {
    id: "journal",
    kind: "listing",
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
    pageTitle: "Journal",
    metaDescription:
      "Field notes, observations, photography moments, and personal journal entries from nature and beyond.",
  },

  navigation: {
    breadcrumbs: ["home", "journal"],
  },

  content: {
    head: {
      eyebrow: "Kevin Ellen",
      title: "Journal",
      intro:
        "A growing collection of field notes, observations, reflections, and moments gathered through photography, writing, and time outdoors.",
    },
    body: [
      {
        kind: "paragraph",
        inlines: [
          {
            kind: "text",
            text: "The journal will bring together shorter entries from the field, small observations, photography moments, and personal reflections.",
          },
        ],
      },
      {
        kind: "paragraph",
        inlines: [
          {
            kind: "text",
            text: "Over time this section will grow into a chronological record of nature, places, experiences, and the thinking behind the work.",
          },
        ],
      },
      {
        kind: "paragraph",
        inlines: [
          { kind: "text", text: "Go back to " },
          { kind: "internal-link", pageId: "home", label: "homepage" },
          { kind: "text", text: "." },
        ],
      },
    ],
    footer: [
      "More journal entries and archive views will be added here over time.",
    ],
  },

  assets: {
    scripts: [],
    svgs: [],
  },

  structuredData: [],
};
