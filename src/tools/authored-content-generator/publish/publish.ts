// src/tools/authored-content-generator/publish/publish.ts

import { loadEnvFile } from "node:process";

import { execFile } from "node:child_process";
import { mkdir, readFile, rename } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { promisify } from "node:util";

import type { ContentAuthored } from "../../../content-schema/content/content.content-schema.authored.type";
import type { PhotoAppInit } from "../../../shared/types/assets/photo.asset.shared.app-init.type";

import { publishPhoto } from "./photo/photo.publish";
import { publishJournal } from "./journal/journal.publish";
import { publishJournalLedger } from "./ledger/ledger.publish";

loadEnvFile(".env.publisher");

type PublishMode = "--local" | "--remote";

type PhotoPublisher = Parameters<typeof publishPhoto>[0]["publisher"];
type JournalPublisher = Parameters<typeof publishJournal>[0]["publisher"];

type CloudflareImageResponse = Readonly<{
  success: boolean;
  errors?: readonly { message: string }[];
  result?: Readonly<{
    id: string;
    uploaded: string;
  }>;
}>;

const execFileAsync = promisify(execFile);

type KvBinding = "CONTENT_KV" | "PHOTO_KV";

const bindingArgs = (mode: PublishMode, binding: KvBinding): string[] => [
  "--binding",
  binding,
  mode,
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const runWrangler = async (args: string[]): Promise<string> => {
  const {
    CLOUDFLARE_API_TOKEN: _unused,
    CLOUDFLARE_API_KEY: _unusedKey,
    CLOUDFLARE_EMAIL: _unusedEmail,
    ...wranglerEnv
  } = process.env;

  const { stdout } = await execFileAsync(
    "npx",
    ["--no-install", "wrangler", "kv", "key", ...args],
    {
      maxBuffer: 10 * 1024 * 1024,
      env: wranglerEnv,
    },
  );

  return stdout;
};

const getKv = async <T>(
  key: string,
  mode: PublishMode,
  binding: KvBinding,
): Promise<T | null> => {
  const keysValue: unknown = JSON.parse(
    await runWrangler(["list", "--prefix", key, ...bindingArgs(mode, binding)]),
  );

  if (
    !Array.isArray(keysValue) ||
    !keysValue.every(
      (entry: unknown) => isRecord(entry) && typeof entry.name === "string",
    )
  ) {
    throw new Error("Invalid KV key list");
  }

  const keys: readonly { name: string }[] = keysValue;

  if (!keys.some((entry) => entry.name === key)) {
    return null;
  }

  const value = await runWrangler([
    "get",
    key,
    ...bindingArgs(mode, binding),
    "--text",
  ]);

  return JSON.parse(value) as T;
};

const putKv = async (
  key: string,
  value: unknown,
  mode: PublishMode,
  binding: KvBinding,
): Promise<void> => {
  await runWrangler([
    "put",
    key,
    JSON.stringify(value),
    ...bindingArgs(mode, binding),
  ]);
};

const uploadImage = async (
  photo: PhotoAppInit,
  image: Buffer,
): Promise<{
  id: string;
  uploadedAt: string;
}> => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_IMAGES_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error(
      "CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_IMAGES_API_TOKEN are required for image uploads",
    );
  }

  const form = new FormData();

  form.append(
    "file",
    new Blob([new Uint8Array(image)], {
      type: "image/jpeg",
    }),
    photo.sourceFileName,
  );

  form.append("id", photo.id);
  form.append("creator", photo.photographer);

  form.append(
    "metadata",
    JSON.stringify({
      source: "content-cli",
      photoId: photo.id,
    }),
  );

  form.append("requireSignedURLs", "false");

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      body: form,
    },
  );

  const result = await response.json<CloudflareImageResponse>();

  if (
    !response.ok ||
    !result.success ||
    !result.result?.id ||
    !result.result.uploaded
  ) {
    throw new Error(
      `Cloudflare Images upload failed for "${photo.id}": ${
        result.errors?.map((error) => error.message).join(", ") ??
        response.statusText
      }`,
    );
  }

  return {
    id: result.result.id,
    uploadedAt: result.result.uploaded,
  };
};

const createPhotoPublisher = (mode: PublishMode): PhotoPublisher => ({
  getPhoto: (id) => getKv<PhotoAppInit>(`photo:${id}`, mode, "PHOTO_KV"),

  putPhoto: (photo) => putKv(`photo:${photo.id}`, photo, mode, "PHOTO_KV"),

  uploadImage: (photo, image) => uploadImage(photo, image),
});

const createJournalPublisher = (mode: PublishMode): JournalPublisher => ({
  getAuthored: (id) =>
    getKv<ContentAuthored>(`journal:authored:${id}`, mode, "CONTENT_KV"),

  putAuthored: (journal) =>
    putKv(`journal:authored:${journal.id}`, journal, mode, "CONTENT_KV"),

  getAppInit: (id) => getKv(`journal:appInit:${id}`, mode, "CONTENT_KV"),

  putAppInit: (journal) =>
    putKv(`journal:appInit:${journal.id}`, journal, mode, "CONTENT_KV"),
});

const readJournalInventory = async (
  directory: string,
): Promise<
  Readonly<{
    id: string;
    photoIds: readonly string[];
  }>
> => {
  const artifactPath = resolve(directory, "artifacts", "journal.authored.json");

  const content = await readFile(artifactPath, "utf8");
  const journal: unknown = JSON.parse(content);

  if (
    !isRecord(journal) ||
    journal.kind !== "public" ||
    journal.pageType !== "journalEntry" ||
    typeof journal.id !== "string" ||
    journal.id.length === 0
  ) {
    throw new Error("Expected a validated public journal entry");
  }

  if (
    !Array.isArray(journal.photos) ||
    journal.photos.length === 0 ||
    !journal.photos.every(
      (id: unknown): id is string => typeof id === "string" && id.length > 0,
    )
  ) {
    throw new Error(`Journal "${journal.id}" has no photograph inventory`);
  }

  const photos: string[] = journal.photos;

  if (new Set(photos).size !== photos.length) {
    throw new Error(`Journal "${journal.id}" contains duplicate photographs`);
  }

  return {
    id: journal.id,
    photoIds: photos,
  };
};

const archiveWorkspace = async (directory: string): Promise<void> => {
  const workspace = basename(directory);

  const destination = resolve(
    process.cwd(),
    "authored-content",
    "uploaded",
    "journals",
    workspace,
  );

  await mkdir(dirname(destination), {
    recursive: true,
  });

  await rename(directory, destination);

  console.log(`✓ Workspace archived: ${destination}`);
};

export const publishWorkspace = async ({
  directory,
  mode,
  replaceImage = false,
}: Readonly<{
  directory: string;
  mode: PublishMode;
  replaceImage?: boolean;
}>): Promise<void> => {
  const journal = await readJournalInventory(directory);

  const photoPublisher = createPhotoPublisher(mode);
  const journalPublisher = createJournalPublisher(mode);

  console.log(`Publishing: ${journal.id}`);
  console.log(`Mode: ${mode}`);
  console.log(`Photographs: ${journal.photoIds.length}`);

  // 1. Publish and verify photographs.
  for (const photoId of journal.photoIds) {
    await publishPhoto({
      directory,
      photoId,
      publisher: photoPublisher,
      replaceImage,
    });
  }

  console.log("✓ Photographs published");

  // 2. Publish both journal KV representations.
  await publishJournal({
    directory,
    publisher: journalPublisher,
  });

  // 3. Update the journal ledgers.
  await publishJournalLedger({
    directory,
    mode,
  });

  console.log(`✓ Publication complete: ${journal.id}`);
  // 4. Archive only after successful remote publication.
  if (mode === "--remote") {
    await archiveWorkspace(directory);
  } else {
    console.log("↷ Local publication: workspace retained");
  }
};

const main = async (): Promise<void> => {
  const [workspace, ...options] = process.argv.slice(2);

  if (
    !workspace ||
    workspace === "." ||
    workspace === ".." ||
    basename(workspace) !== workspace
  ) {
    throw new Error("Valid journal workspace argument required");
  }

  const modes = options.filter(
    (option) => option === "--local" || option === "--remote",
  );

  if (
    modes.length !== 1 ||
    options.some(
      (option) =>
        option !== "--local" &&
        option !== "--remote" &&
        option !== "--replace-image",
    )
  ) {
    throw new Error(
      "Usage: content:publish <workspace> --local|--remote [--replace-image]",
    );
  }

  const mode = modes[0];

  const directory = resolve(
    process.cwd(),
    "authored-content",
    "journals",
    workspace,
  );

  await publishWorkspace({
    directory,
    mode,
    replaceImage: options.includes("--replace-image"),
  });
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
