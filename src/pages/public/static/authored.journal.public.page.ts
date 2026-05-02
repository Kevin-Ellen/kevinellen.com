// src/pages/public/static/authored.home.public.page.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredJournalPublicPage: AuthoredPublicPageDefinition =
  deepFreeze({
    id: "journal",
    kind: "listing",
    slug: "/journal",
    label: "Journal",

    metadata: {
      pageTitle: "Journal",
      metaDescription:
        "Nature photography, field notes, journal writing, and technical architecture.",
    },

    breadcrumbs: ["home", "journal"],

    content: {
      header: {
        eyebrow: "Journal",
        title: "Journal",
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
