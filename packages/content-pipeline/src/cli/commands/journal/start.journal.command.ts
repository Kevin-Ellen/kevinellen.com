// packages/content-pipeline/src/cli/commands/journal/start.journal.command.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { ContentCommandOptions } from "@content-pipeline/cli/command.options.types";

import { getLatestJournalDraftFolder } from "@content-pipeline/journal/helpers/get.latest.journal.draft.folder";
import { generatePhotoDraftsForFolder } from "@content-pipeline/photos/helpers/generate.photo.drafts.for.folder";

const renderJournalDraftFile = (photoSlugs: string[]): string => {
  const initialBody =
    photoSlugs.length > 0
      ? `[
      {
        kind: "contentSection",
        modules: [
          {
            kind: "hero",
            photoId: "${photoSlugs[0]}",
            immersive: true
          }
        ]
      }
    ]`
      : "[]";

  return `/**
 * Journal Entry Draft
 *
 * Rules:
 * - id must be unique (used for KV + routing)
 * - slug is derived automatically: /journal/{id}
 * - content.body uses structured modules (see examples below)
 * - photoSlugs will be available as photoId in modules
 */

export const journal = {
  id: "hello-world",

  meta: {
    pageTitle: "",
    metaDescription: "",
  },

  content: {
    head: {
      eyebrow: "Field Notes",
      title: "",
      intro: "",
    },

    /**
     * Body structure
     *
     * Each section:
     * {
     *   kind: "contentSection",
     *   heading?: { text: string, level: 2 | 3 },
     *   modules: [...]
     * }
     *
     * Example modules:
     *
     * Paragraph:
     * {
     *   kind: "paragraph",
     *   content: [{ kind: "text", value: "..." }]
     * }
     *
     * Hero image:
     * {
     *   kind: "hero",
     *   photoId: "${photoSlugs[0] ?? "your-photo-id"}",
     *   immersive: true
     * }
     *
     * Quote:
     * {
     *   kind: "quote",
     *   id: "unique-id",
     *   text: "...",
     *   attribution: "..."
     * }
     */
    body: ${initialBody},

    footer: {
      tags: [],
    },
  },

  photoSlugs: ${JSON.stringify(photoSlugs, null, 2)},
};
`;
};

export const runStartJournalCommand = async (
  _options: ContentCommandOptions,
): Promise<void> => {
  const draftFolderPath = await getLatestJournalDraftFolder();

  const { photoSlugs } = await generatePhotoDraftsForFolder(draftFolderPath);

  const journalFilePath = path.join(draftFolderPath, "entry.journal.ts");

  try {
    await fs.access(journalFilePath);
  } catch {
    const journalContent = renderJournalDraftFile(photoSlugs);
    await fs.writeFile(journalFilePath, journalContent, "utf8");
  }

  console.log("\nJournal draft start complete");
  console.log(`→ Draft folder: ${draftFolderPath}`);
  console.log(`→ Photos detected: ${photoSlugs.length}`);

  console.log("\nNext steps:");
  console.log("1. Complete entry.journal.ts");
  console.log("2. Complete any .photo.ts files");
  console.log("3. Open the draft folder in your editor");
  console.log(`   code ${draftFolderPath}`);
  console.log("4. Run: content journal upload\n");
};
