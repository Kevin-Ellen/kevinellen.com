// packages/content-cli/src/content/journal/draft.create.journal.content.ts

import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

export const createDraftJournalDefinition = (
  workspaceId: string,
  firstPhotoId: string | null,
): AuthoredPublicPageDefinition => {
  const publishedAt = formatLocalDateTimeWithOffset(new Date());

  return {
    id: "__REQUIRED__",
    kind: "journal",
    slug: `/journal/${workspaceId}`,
    label: "__REQUIRED__",

    metadata: {
      pageTitle: "__REQUIRED__",
      metaDescription: "__REQUIRED__",
    },

    breadcrumbs: ["home", "journal"],

    content: {
      header: {
        eyebrow: "Journal",
        title: "__REQUIRED__",
        intro: "__REQUIRED__",
      },

      content: [
        {
          kind: "articleSection",
          heading: {
            text: "Featured image",
            visuallyHidden: true,
            level: 2,
          },
          modules: firstPhotoId
            ? [
                {
                  kind: "hero",
                  photoId: firstPhotoId,
                  immersive: true,
                },
              ]
            : [],
        },
        {
          kind: "articleSection",
          heading: {
            text: "Journal entry",
            visuallyHidden: true,
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value: "__REQUIRED__",
                },
              ],
            },
          ],
        },
      ],

      footer: [
        {
          kind: "journalEntryFooter",
          publication: {
            author: "Kevin Ellen",
            published: publishedAt,
            updatedAt: [publishedAt],
          },
          tags: [],
        },
      ],
    },
  };
};
