// src/pages/public/static/authored.notes.public.page.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredNotesPublicPage: AuthoredPublicPageDefinition = deepFreeze(
  {
    id: "notes",
    kind: "listing",
    slug: "/notes",
    label: "Notes",

    metadata: {
      pageTitle: "Technical Notes | Kevin Ellen",
      metaDescription:
        "Technical notes on architecture, engineering, SEO, development, automation, and the practical decisions behind building maintainable systems.",
    },

    breadcrumbs: ["home", "notes"],

    content: {
      head: {
        eyebrow: "Engineering",
        title: "Notes",
        intro:
          "A collection of technical notes, architectural thinking, experiments, and working ideas — documenting systems, implementation details, and observations along the way.",
      },

      content: [
        {
          kind: "articleSection",
          heading: {
            text: "Notes",
            visuallyHidden: true,
            level: 2,
          },
          modules: [
            {
              kind: "noteListing",
              flow: "content",
              pagination: {
                pageSize: 12,
              },
            },
          ],
        },
      ],
    },
  },
);
