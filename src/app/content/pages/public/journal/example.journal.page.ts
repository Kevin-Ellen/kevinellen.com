// src/app/content/pages/public/journal/example.journal.page.ts

import type { JournalEntryPageDefinition } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.definition";

export const exampleJournalEntryPage: JournalEntryPageDefinition = {
  core: {
    id: "journal-example",
    kind: "journal-entry",
    slug: "/journal/example",
    label: "Journal Example",
  },

  config: {
    robots: {
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    },
    robotsTxt: {
      disallow: false,
    },
    sitemap: {
      include: true,
    },
  },

  meta: {
    pageTitle: "Journal Example | Kevin Ellen",
    metaDescription:
      "Example journal entry page used to validate the journal-entry page type and rendering flow.",
  },

  breadcrumbs: ["home", "journal", "journal-example"],

  content: {
    head: {
      eyebrow: "Field Notes",
      title: "Why quiet structure matters in a photography portfolio",
      intro:
        "A thoughtful portfolio does more than display images. It gives them space, context, and rhythm, allowing the work to feel intentional rather than simply uploaded.",
    },

    body: [
      {
        kind: "contentSection",
        modules: [
          {
            kind: "hero",
            photoId: "butterfly-in-flight",
            immersive: true,
          },
        ],
      },
      {
        kind: "contentSection",
        heading: {
          text: "The difference between showing and presenting",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "A gallery of strong photographs can still feel flat if every image is treated the same way. Presentation is what turns a collection into a body of work. Structure, spacing, typography, and sequencing all influence how a viewer reads an image before they have fully understood what they are looking at.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "That distinction matters even more on a personal site. Without care, a portfolio can quickly become a storage layer: useful, but emotionally thin. With a considered reading experience, however, the same images begin to feel deliberate.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Letting the content breathe",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Editorial content benefits from restraint. A clear heading, a well-paced introduction, and body text that is comfortable to read create trust immediately. When the structure is calm, the photographs gain authority.",
              },
            ],
          },
          {
            kind: "quote",
            id: "quiet-structure-quote",
            text: "A strong photograph does not always need a loud presentation. More often, it needs space, rhythm, and just enough structure to let the viewer stay with it a little longer.",
            attribution: "Field note on editorial presentation",
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "When the page settles down, the image has room to work. Fine detail, gesture, atmosphere, and scale all become easier to notice. The design should support that act of looking, not interrupt it.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Building hierarchy without noise",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "A good typographic system does not rely on constant novelty. It creates a hierarchy that the reader can learn almost immediately. Once this pattern becomes familiar, the interface starts to disappear and the content becomes easier to inhabit.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Photography pages often need to carry supporting information: location, equipment, settings, and personal observations. That information is useful, but it should remain secondary to the image and the writing.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "This will eventually sit alongside richer journal modules, but for now it is enough to validate the ",
              },
              {
                kind: "internalLink",
                pageId: "about-technology",
                text: "rendering architecture",
              },
              {
                kind: "text",
                value:
                  " and ensure the first journal-entry contract is shaped correctly.",
              },
            ],
          },
        ],
      },
    ],

    footer: {
      publication: [
        {
          label: "Written by",
          value: "Kevin Ellen",
        },
        {
          label: "Published",
          value: "15 March 2026",
        },
        {
          label: "Last update",
          value: "15 March 2026",
        },
      ],
      tags: ["field-notes", "portfolio", "structure"],
    },
  },

  assets: {
    scripts: [],
    svgs: [],
  },

  structuredData: [],
};
