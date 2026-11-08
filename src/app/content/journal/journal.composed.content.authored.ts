// src/app/content/journal/journal.composed.content.authored.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";

export const journalContentAuthored = {
  kind: "public",
  render: "composed",
  pageType: "standard",
  id: "journal",
  slug: "/journal",
  label: "Journal",
  breadcrumbs: ["home", "journal"],
  dates: {
    created: "2026-04-26",
    lastUpdated: "2026-10-27",
  },

  metadata: {
    title: "Wildlife Photography Journal & Field Notes",
    description:
      "Wildlife photography, nature observations and field notes by Kevin Ellen. Stories from Epping Forest, Essex, and journeys further afield.",
    sitemap: true,
  },

  body: {
    modules: [
      {
        kind: "editorialIntro",
        eyebrow: "Field notes",
        title: "Stories from the field.",
        statement:
          "Wildlife encounters, wild places, and the moments in between.",
        description:
          "From familiar paths through Epping Forest to journeys further afield, these are the stories behind my photographs. Observations of wildlife, changing landscapes, unexpected encounters, and the occasional adventure along the way.",
      },
      {
        kind: "journalListing",
        heading: {
          id: "journal-listing-title",
          level: 2,
          text: "From the journal",
        },
        eyebrow: "Latest entry",
        photoLimit: 3,
        pageSize: 12,
      },
    ],
  },
} as const satisfies PublicContentAuthored;
