// src/pages/public/static/authored.home.public.page.ts

import type { AuthoredHomePublicPage } from "@shared-types/pages/definitions/public/home/authored.home.public.definition.page.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredHomePublicPage: AuthoredHomePublicPage = deepFreeze({
  id: "home",
  kind: "home",
  slug: "/",
  label: "Home",

  metadata: {
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
  },
});
