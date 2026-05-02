// src/pages/public/static/authored.journal.public.page.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredJournalPublicPage: AuthoredPublicPageDefinition =
  deepFreeze({
    id: "journal",
    kind: "listing",
    slug: "/journal",
    label: "Journal",

    metadata: {
      pageTitle: "Wildlife Journal",
      metaDescription:
        "Wildlife photography field notes and encounters, documenting moments in nature through observation, patience, and timing.",
    },

    breadcrumbs: ["home", "journal"],

    content: {
      header: {
        eyebrow: "Wildlife",
        title: "Journal",
        intro:
          "A field journal of wildlife encounters — capturing behaviour, fleeting moments, and the quiet details often missed at first glance.",
      },

      content: [
        {
          kind: "articleSection",
          heading: {
            text: "Journal entries",
            visuallyHidden: true,
            level: 2,
          },
          modules: [
            {
              kind: "journalListing",
              flow: "content",
              pagination: {
                pageSize: 12,
              },
            },
          ],
        },
      ],
    },
  });
