// src/app/content/topics/topics.composed.content.authored.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";

export const topicsContentAuthored = {
  kind: "public",
  render: "composed",
  pageType: "standard",
  id: "topics",
  slug: "/topics",
  label: "Topics",
  breadcrumbs: ["home", "topics"],
  dates: {
    created: "2026-04-26",
  },

  metadata: {
    title: "Topics",
    description:
      "Explore wildlife and nature photography, field notes, and journal entries organised by topic.",
    sitemap: true,
  },
  body: {
    modules: [
      {
        kind: "editorialIntro",
        eyebrow: "Explore",
        title: "A world of topics.",
        statement: "Birds, wild places, and everything in between.",
        description:
          "Follow the subjects, places and encounters that run through my photography and field notes. Some close to home, others a little further afield.",
      },

      {
        kind: "topicListing",
        heading: "Explore by topic",
        pageSize: 12,
        pagination: true,
      },
    ],
  },
} as const satisfies PublicContentAuthored;
