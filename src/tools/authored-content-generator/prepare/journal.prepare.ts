// src/tools/authored-content-generator/prepare/journal.prepare.ts

import { stat, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

import type { ContentAuthored } from "../../../content-schema/content/content.content-schema.authored.type";
import type { PhotoAssetAuthored } from "../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";

import { importPhotoDraft } from "./import-photo-draft.journal.prepare";

type Input = Readonly<{
  directory: string;
  photoIds: readonly string[];
}>;

const REQUIRED_PLACEHOLDER = "__REQUIRED__";

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }

    throw error;
  }
};

const loadPhotos = async ({
  directory,
  photoIds,
}: Input): Promise<readonly PhotoAssetAuthored[]> => {
  const photos: PhotoAssetAuthored[] = [];

  for (const id of photoIds) {
    const filePath = resolve(directory, `${id}.ts`);

    if (!(await fileExists(filePath))) {
      throw new Error(`Missing photo draft: ${filePath}`);
    }

    const photo = await importPhotoDraft(filePath);

    if (photo.id !== id) {
      throw new Error(
        `Photo ID mismatch: expected "${id}", received "${photo.id}"`,
      );
    }

    photos.push(photo);
  }

  return photos;
};

const uniqueValues = (values: readonly (string | null)[]): string[] => [
  ...new Set(
    values.filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    ),
  ),
];

const createJournalAuthored = ({
  directory,
  photos,
}: Readonly<{
  directory: string;
  photos: readonly PhotoAssetAuthored[];
}>): ContentAuthored => {
  const id = basename(directory);
  const slug = `/journal/${id}`;
  const created = new Date().toISOString().slice(0, 10);

  const cameras = uniqueValues(photos.map((photo) => photo.cameraModel));

  const lenses = uniqueValues(photos.map((photo) => photo.lensModel));

  return {
    kind: "public",
    id,
    slug,
    render: "composed",
    pageType: "journalEntry",

    label: REQUIRED_PLACEHOLDER,

    breadcrumbs: ["home", "journal", id],

    dates: {
      created,
    },

    metadata: {
      title: REQUIRED_PLACEHOLDER,
      description: REQUIRED_PLACEHOLDER,
      sitemap: true,
    },

    topics: [],
    scripts: [],

    photos: photos.map((photo) => photo.id),

    body: {
      modules: [
        {
          kind: "pageIntro",
          eyebrow: "Field journal",
          title: REQUIRED_PLACEHOLDER,
          description: REQUIRED_PLACEHOLDER,
        },
        {
          kind: "richContent",
          components: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value: REQUIRED_PLACEHOLDER,
                },
              ],
            },
          ],
        },
      ],

      footer: [
        {
          kind: "articleFooter",
          fieldNotes: {
            cameras,
            lenses,
          },
        },
      ],
    },
  };
};

export const prepareJournal = async ({
  directory,
  photoIds,
}: Input): Promise<void> => {
  const draftPath = resolve(directory, "journal.ts");

  if (await fileExists(draftPath)) {
    console.log("↷ Journal draft already exists");
    return;
  }

  if (photoIds.length === 0) {
    throw new Error("Cannot prepare a journal without photographs");
  }

  if (new Set(photoIds).size !== photoIds.length) {
    throw new Error("Journal photo inventory contains duplicate IDs");
  }

  const photos = await loadPhotos({
    directory,
    photoIds,
  });

  const authored = createJournalAuthored({
    directory,
    photos,
  });

  const source = [
    'import type { ContentAuthored } from "../../../src/content-schema/content/content.content-schema.authored.type";',
    "",
    `export const journal = ${JSON.stringify(authored, null, 2)} as const satisfies ContentAuthored;`,
    "",
  ].join("\n");

  await writeFile(draftPath, source, {
    encoding: "utf8",
    flag: "wx",
  });

  console.log(`✓ Prepared journal draft: ${draftPath}`);
  console.log(`  Photographs: ${photos.length}`);
  console.log(
    `  Cameras: ${uniqueValues(photos.map((photo) => photo.cameraModel)).length}`,
  );
  console.log(
    `  Lenses: ${uniqueValues(photos.map((photo) => photo.lensModel)).length}`,
  );
};
