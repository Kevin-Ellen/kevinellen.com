// packages/content-cli/src/content/journal/publish.journal.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";
import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";

import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";
import {
  getJournalFilePath,
  getJournalWorkspacePath,
} from "@content-cli/content/journal/path.journal.content";
import { importJournalDraft } from "@content-cli/content/journal/utils/import.draft.journal.util.content";
import { publishPhotoDrafts } from "@content-cli/content/shared/publish-drafts.photo.content";
import { runValidateJournalCommand } from "@content-cli/content/journal/validate.journal.content";
import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

type JournalPublishCommandResult = Readonly<
  ContentCommandResult & {
    ok: true;
    workspaceId: string;
    journalId: string;
    publishedPhotos: number;
    workspacePath: string;
    uploadedWorkspacePath: string;
  }
>;

const JOURNAL_PAGE_ID_PREFIX = "journal:";

const toJournalPageId = (workspaceId: string): `journal:${string}` =>
  `${JOURNAL_PAGE_ID_PREFIX}${workspaceId}`;

/**
 * Update the page identity (id, slug, breadcrumbs)
 */
const updateJournalIdentity = (
  page: AuthoredPublicPageDefinition,
  workspaceId: string,
): AuthoredPublicPageDefinition => ({
  ...page,
  id: toJournalPageId(workspaceId),
  kind: "journal",
  slug: `/journal/${workspaceId}`,
  breadcrumbs: ["home", "journal", toJournalPageId(workspaceId)],
});

/**
 * Append a new updatedAt timestamp to the journalEntryFooter(s)
 */
const updateJournalFooter = (
  page: AuthoredPublicPageDefinition,
): AuthoredPublicPageDefinition => {
  const updatedAt = formatLocalDateTimeWithOffset(new Date());

  const footer = page.content.footer ?? [];
  const updatedFooter = [];

  for (const module of footer) {
    if (module.kind === "journalEntryFooter") {
      updatedFooter.push({
        ...module,
        publication: {
          ...module.publication,
          updatedAt: [...module.publication.updatedAt, updatedAt],
        },
      });
    } else {
      updatedFooter.push(module);
    }
  }

  return {
    ...page,
    content: {
      ...page.content,
      footer: updatedFooter,
    },
  };
};
/**
 * Publish a journal: validate, publish photos, update KV, and move workspace.
 */
export const runPublishJournalCommand = async (
  args: ParsedJournalDirectCliArgs,
): Promise<JournalPublishCommandResult> => {
  const workspaceId = args.slug;
  if (!workspaceId)
    throw new Error("Journal publish requires --slug <workspace-id>.");

  // Step 1: validate the draft
  await runValidateJournalCommand(args);

  // Step 2: load config and define paths
  const config = loadContentCliConfig(args.env);

  const workspacePath = getJournalWorkspacePath(
    args.env,
    args.bucket,
    workspaceId,
  );
  const photosPath = path.join(workspacePath, "photos");
  const uploadedWorkspacePath = getJournalWorkspacePath(
    args.env,
    "uploaded",
    workspaceId,
  );
  const journalPath = getJournalFilePath(args.env, args.bucket, workspaceId);

  // Step 3: import the draft
  const page = await importJournalDraft(journalPath);

  console.log(`\nPublishing journal ${workspaceId}...`);
  console.log(`Workspace path: ${workspacePath}`);
  console.log(`Journal file path: ${journalPath}\n`);

  // Step 4: publish photos
  const publishedPhotos = await publishPhotoDrafts(
    config,
    workspaceId,
    workspacePath,
    photosPath,
  );

  // Step 5: update page identity and footer
  const publishedPage = updateJournalFooter(
    updateJournalIdentity(page, workspaceId),
  );

  // Step 6: write to KV
  await writeCloudflareKvValue(
    config,
    config.cloudflareKvJournalsNamespaceId,
    `page:${publishedPage.id}`,
    publishedPage,
  );

  // Step 7: move workspace to "uploaded"
  await fs.rm(uploadedWorkspacePath, { recursive: true, force: true });
  await fs.mkdir(path.dirname(uploadedWorkspacePath), { recursive: true });
  await fs.rename(workspacePath, uploadedWorkspacePath);

  console.log(`Journal KV: page:${publishedPage.id}`);
  console.log(`Photos published: ${publishedPhotos.length}`);
  console.log(`Workspace moved: ${workspacePath} → ${uploadedWorkspacePath}\n`);

  return {
    ok: true,
    workspaceId,
    journalId: publishedPage.id,
    publishedPhotos: publishedPhotos.length,
    workspacePath,
    uploadedWorkspacePath,
  };
};
