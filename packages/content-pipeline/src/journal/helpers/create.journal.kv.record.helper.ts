// packages/content-pipeline/src/journal/helpers/create.journal.kv.record.helper.ts

import type { JournalEntryPageDefinition } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.definition";
import type { JournalDraft } from "@content-pipeline/journal/types/journal.draft.entry.types";
import type { JournalKvRecord } from "@content-pipeline/journal/types/journal.kv.record.types";

import { formatLocalDateTimeWithOffset } from "@content-pipeline/utils/format.local.date.time.with.offset.util";

const REQUIRED_PLACEHOLDER = "__REQUIRED__";
const DEFAULT_AUTHOR = "Kevin Ellen";

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

const getRequiredString = (
  value: string,
  fieldName: string,
  journalId: string,
): string => {
  if (value.trim().length === 0 || value === REQUIRED_PLACEHOLDER) {
    throw new Error(
      `Journal draft "${journalId}" is missing required field: ${fieldName}`,
    );
  }

  return value;
};

export const createJournalKvRecord = (
  journal: JournalDraft,
): JournalKvRecord => {
  const normalisedAt = formatLocalDateTimeWithOffset(new Date());

  return {
    core: {
      id: journal.id,
      kind: "journal-entry",
      slug: `/journal/${journal.id}`,
      label: getRequiredString(
        journal.content.head.title,
        "content.head.title",
        journal.id,
      ),
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
      pageTitle: getRequiredString(
        journal.meta.pageTitle,
        "meta.pageTitle",
        journal.id,
      ),
      metaDescription: getRequiredString(
        journal.meta.metaDescription,
        "meta.metaDescription",
        journal.id,
      ),
    },

    breadcrumbs: ["home", "journal", journal.id],

    content: {
      head: {
        eyebrow: journal.content.head.eyebrow,
        title: getRequiredString(
          journal.content.head.title,
          "content.head.title",
          journal.id,
        ),
        intro: getRequiredString(
          journal.content.head.intro,
          "content.head.intro",
          journal.id,
        ),
      },
      body: journal.content.body,
      footer: {
        publication: [
          {
            label: "Written by",
            value: DEFAULT_AUTHOR,
          },
          {
            label: "Published",
            value: normalisedAt,
          },
        ],
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
