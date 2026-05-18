// packages/content-cli/src/content/journal/publish.journal.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";
import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";

import { publishContentWithBackfill } from "@content-cli/content/shared/publish-backfill.shared.content";
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

const toJournalPageId = (pageId: string): `journal:${string}` => {
  if (pageId.startsWith(JOURNAL_PAGE_ID_PREFIX)) {
    return pageId as `journal:${string}`;
  }

  return `${JOURNAL_PAGE_ID_PREFIX}${pageId}`;
};

const assertJournalWorkspaceMatchesSlug = (
  workspaceId: string,
  page: AuthoredPublicPageDefinition,
): void => {
  const expectedSlug = `/journal/${workspaceId}`;

  if (page.slug === expectedSlug) return;

  throw new Error(
    [
      "Journal slug/workspace mismatch.",
      "",
      `Workspace: ${workspaceId}`,
      `Expected slug: ${expectedSlug}`,
      `Actual slug: ${page.slug}`,
      "",
      "The workspace identifies the draft location, but the authored page owns the canonical slug.",
      "Update the draft slug or publish from the matching workspace.",
    ].join("\n"),
  );
};

/**
 * Normalise journal page identity without deriving the public slug from the workspace.
 */
const updateJournalIdentity = (
  page: AuthoredPublicPageDefinition,
): AuthoredPublicPageDefinition => {
  const journalPageId = toJournalPageId(page.id);

  return {
    ...page,
    id: journalPageId,
    kind: "journal",
    slug: page.slug,
    breadcrumbs: ["home", "journal", journalPageId],
  };
};

/**
 * Append a new updatedAt timestamp to the journalEntryFooter(s).
 */
const updateJournalFooter = (
  page: AuthoredPublicPageDefinition,
): AuthoredPublicPageDefinition => {
  const updatedAt = formatLocalDateTimeWithOffset(new Date());

  const updatedFooter = (page.content.footer ?? []).map((module) => {
    if (module.kind !== "journalEntryFooter") return module;

    return {
      ...module,
      publication: {
        ...module.publication,
        updatedAt: [...module.publication.updatedAt, updatedAt],
      },
    };
  });

  return {
    ...page,
    content: {
      ...page.content,
      footer: updatedFooter,
    },
  };
};

/**
 * Publish a journal: validate, check identity, publish photos, update KV, and move workspace.
 */
export const runPublishJournalCommand = async (
  args: ParsedJournalDirectCliArgs,
): Promise<JournalPublishCommandResult> => {
  const workspaceId = args.slug;

  if (!workspaceId) {
    throw new Error("Journal publish requires --slug <workspace-id>.");
  }

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

  // Step 4: validate and normalise identity before side effects
  assertJournalWorkspaceMatchesSlug(workspaceId, page);

  const publishedPage = updateJournalFooter(updateJournalIdentity(page));

  console.log(`\nPublishing journal ${workspaceId}...`);
  console.log(`Workspace path: ${workspacePath}`);
  console.log(`Journal file path: ${journalPath}\n`);

  // Step 5: publish photos
  const publishedPhotos = await publishPhotoDrafts(
    config,
    workspaceId,
    workspacePath,
    photosPath,
  );

  // Step 6: write to KV
  await publishContentWithBackfill({
    env: args.env,
    primaryConfig: config,
    getNamespaceId: (config) => config.cloudflareKvJournalsNamespaceId,
    key: `page:${publishedPage.id}`,
    value: publishedPage,
  });

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
