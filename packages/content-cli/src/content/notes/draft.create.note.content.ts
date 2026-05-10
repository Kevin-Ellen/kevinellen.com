// packages/content-cli/src/content/notes/draft.create.note.content.ts

import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

export const createDraftNoteDefinition = (
  workspaceId: string,
): AuthoredPublicPageDefinition => {
  const publishedAt = formatLocalDateTimeWithOffset(new Date());

  return {
    id: "note:__REQUIRED__",
    kind: "note",
    slug: `/notes/${workspaceId}`,
    label: "__REQUIRED__",

    metadata: {
      pageTitle: "__REQUIRED__",
      metaDescription: "__REQUIRED__",
    },

    breadcrumbs: ["home"],

    content: {
      head: {
        eyebrow: "Note",
        title: "__REQUIRED__",
        intro: "__REQUIRED__",
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
            publishedAt,
            updatedAt: [publishedAt],
          },
          tags: [],
        },
      ],
    },
  };
};
