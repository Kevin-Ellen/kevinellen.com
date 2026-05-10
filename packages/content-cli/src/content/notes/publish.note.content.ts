// packages/content-cli/src/content/notes/publish.note.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";
import type { ParsedNoteDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";

import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

import {
  getNoteFilePath,
  getNoteWorkspacePath,
} from "@content-cli/content/notes/path.note.content";

import { importNoteDraft } from "@content-cli/content/notes/utils/import.draft.note.util.content";
import { runValidateNoteCommand } from "@content-cli/content/notes/validate.note.content";

import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

type NotePublishCommandResult = Readonly<
  ContentCommandResult & {
    ok: true;
    workspaceId: string;
    noteId: string;
    workspacePath: string;
    uploadedWorkspacePath: string;
  }
>;

const assertValidNoteIdentity = (page: AuthoredPublicPageDefinition): void => {
  if (page.kind !== "note") {
    throw new Error(
      `Note publish requires kind "note". Received: ${page.kind}`,
    );
  }

  if (!page.id.startsWith("note:")) {
    throw new Error(`Note id must start with "note:". Received: ${page.id}`);
  }

  if (!page.slug.startsWith("/notes/")) {
    throw new Error(
      `Note slug must start with "/notes/". Received: ${page.slug}`,
    );
  }
};

const updateNoteFooter = (
  page: AuthoredPublicPageDefinition,
): AuthoredPublicPageDefinition => {
  const updatedAt = formatLocalDateTimeWithOffset(new Date());
  const footer = page.content.footer ?? [];

  return {
    ...page,
    content: {
      ...page.content,
      footer: footer.map((module) => {
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

export const runPublishNoteCommand = async (
  args: ParsedNoteDirectCliArgs,
): Promise<NotePublishCommandResult> => {
  const workspaceId = args.slug;

  if (!workspaceId) {
    throw new Error("Note publish requires --slug <workspace-id>.");
  }

  await runValidateNoteCommand(args);

  const config = loadContentCliConfig(args.env);

  const workspacePath = getNoteWorkspacePath(
    args.env,
    args.bucket,
    workspaceId,
  );

  const uploadedWorkspacePath = getNoteWorkspacePath(
    args.env,
    "uploaded",
    workspaceId,
  );

  const notePath = getNoteFilePath(args.env, args.bucket, workspaceId);
  const page = await importNoteDraft(notePath);

  assertValidNoteIdentity(page);

  const publishedPage = updateNoteFooter(page);

  console.log(`\nPublishing note ${workspaceId}...`);
  console.log(`Workspace path: ${workspacePath}`);
  console.log(`Note file path: ${notePath}\n`);

  await writeCloudflareKvValue(
    config,
    config.cloudflareKvNotesNamespaceId,
    `page:${publishedPage.id}`,
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

  console.log(`Note KV: page:${publishedPage.id}`);
  console.log(`Workspace moved: ${workspacePath} → ${uploadedWorkspacePath}\n`);

  return {
    ok: true,
    workspaceId,
    noteId: publishedPage.id,
    workspacePath,
    uploadedWorkspacePath,
  };
};
