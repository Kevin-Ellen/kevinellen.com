// src/pages/public/static/authored.home.public.page.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredHomePublicPage: AuthoredPublicPageDefinition = deepFreeze({
  id: "home",
  kind: "home",
  slug: "/",
  label: "Home",

  metadata: {
    pageTitle: "Kevin Ellen | Wildlife Photography & Technical Work",
    metaDescription:
      "Wildlife photography, field notes, and technical work exploring observation, behaviour, and edge-native publishing.",
  },

  breadcrumbs: ["home"],

  content: {
    header: {
      eyebrow: "Kevin Ellen",
      title: "Nature photography, writing, and technical architecture",
      intro:
        "A personal platform for photography, journal entries, articles, and transparent technical thinking.",
    },

    content: [
      {
        kind: "articleSection",
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
