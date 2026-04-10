// packages/content-pipeline/src/journal/helpers/normalise.journal.draft.ts

import type { JournalEntryPageDefinition } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.definition";
import type { JournalDraft } from "@content-pipeline/journal/types/journal.types";

const DEFAULT_JOURNAL_CONFIG: JournalEntryPageDefinition["config"] = {
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
};

export const normaliseJournalDraft = (
  journal: JournalDraft,
): JournalEntryPageDefinition => {
  const slug = `/journal/${journal.id}`;

  return {
    core: {
      id: journal.id,
      kind: "journal-entry",
      slug,
      label: journal.content.head.title,
    },

    config: {
      ...DEFAULT_JOURNAL_CONFIG,
      ...journal.config,
      robots: {
        ...DEFAULT_JOURNAL_CONFIG.robots,
        ...journal.config?.robots,
      },
      robotsTxt: {
        ...DEFAULT_JOURNAL_CONFIG.robotsTxt,
        ...journal.config?.robotsTxt,
      },
      sitemap: {
        ...DEFAULT_JOURNAL_CONFIG.sitemap,
        ...journal.config?.sitemap,
      },
    },

    meta: {
      pageTitle: journal.meta.pageTitle,
      metaDescription: journal.meta.metaDescription,
    },

    breadcrumbs: ["home", "journal", journal.id],

    content: {
      head: {
        eyebrow: journal.content.head.eyebrow,
        title: journal.content.head.title,
        intro: journal.content.head.intro,
      },
      body: journal.content.body,
      footer: {
        publication: [],
        tags: journal.content.footer.tags,
      },
    },

    assets: {
      scripts: [],
      svgs: [],
    },

    structuredData: [],
  };
};
