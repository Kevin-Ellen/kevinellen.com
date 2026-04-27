// packages/content-pipeline/src/journal/helpers/render.journal.draft.file.ts

const renderArray = (value: unknown[]): string =>
  JSON.stringify(value, null, 2);

export const renderJournalDraftFile = (photoIds: string[]): string => {
  const initialBody =
    photoIds.length > 0
      ? `[
  {
    kind: "articleSection",
    modules: [
      {
        kind: "hero",
        photoId: "${photoIds[0]}",
        immersive: true
      }
    ]
  }
]`
      : "[]";

  return `import type { JournalDraft } from "@content-pipeline/journal/types/journal.draft.entry.types";

export const journal = {
  id: "hello-world",

  meta: {
    pageTitle: "__REQUIRED__",
    metaDescription: "__REQUIRED__",
  },

  content: {
    head: {
      eyebrow: "Field Notes",
      title: "__REQUIRED__",
      intro: "__REQUIRED__",
    },

    body: ${initialBody},

    footer: {
      tags: [],
    },
  },

  photoIds: ${renderArray(photoIds)},
} satisfies JournalDraft;
`;
};
