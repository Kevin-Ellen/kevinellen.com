// packages/content-cli/src/content/journal/publish.journal.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";
import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

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

const updateJournalFooter = (
  page: AuthoredPublicPageDefinition,
): AuthoredPublicPageDefinition => {
  const updatedAt = formatLocalDateTimeWithOffset(new Date());

  return {
    ...page,
    content: {
      ...page.content,
      footer: (page.content.footer ?? []).map((module) => {
        if (module.kind !== "journalEntryFooter") {
          return module;
        }

        return {
          ...module,
          publication: {
            ...module.publication,
            updatedAt: [...module.publication.updatedAt, updatedAt],
          },
        };
      }),
    },
  };
};

export const runPublishJournalCommand: ContentCommandHandler = async (args) => {
  const workspaceId = args.slug;

  if (!workspaceId) {
    throw new Error("Journal publish requires --slug <workspace-id>.");
  }

  await runValidateJournalCommand(args);

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
  const page = await importJournalDraft(journalPath);

  console.log("\nPublish journal draft\n");
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Path: ${workspacePath}\n`);

  const publishedPhotos = await publishPhotoDrafts(
    config,
    workspaceId,
    workspacePath,
    photosPath,
  );

  const publishedPage = updateJournalFooter(page);

  await writeCloudflareKvValue(
    config,
    config.cloudflareKvJournalsNamespaceId,
    `journal:${publishedPage.id}`,
    publishedPage,
  );

  await fs.rm(uploadedWorkspacePath, {
    recursive: true,
    force: true,
  });

  await fs.mkdir(path.dirname(uploadedWorkspacePath), {
    recursive: true,
  });

  await fs.rename(workspacePath, uploadedWorkspacePath);

  console.log(`Journal KV: journal:${publishedPage.id}`);
  console.log(`Photos published: ${publishedPhotos.length}`);
  console.log(`\nWorkspace moved:`);
  console.log(`  ${workspacePath}`);
  console.log(`  → ${uploadedWorkspacePath}\n`);

  return { ok: true };
};
