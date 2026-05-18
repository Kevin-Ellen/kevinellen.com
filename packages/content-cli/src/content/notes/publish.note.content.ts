// packages/content-cli/src/content/notes/publish.note.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";
import type { ParsedNoteDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";

import { publishContentWithBackfill } from "@content-cli/content/shared/publish-backfill.shared.content";
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

const NOTE_PAGE_ID_PREFIX = "note:";

const toNotePageId = (pageId: string): `note:${string}` => {
  if (pageId.startsWith(NOTE_PAGE_ID_PREFIX)) {
    return pageId as `note:${string}`;
  }

  return `${NOTE_PAGE_ID_PREFIX}${pageId}`;
};

const assertNoteKind = (page: AuthoredPublicPageDefinition): void => {
  if (page.kind !== "note") {
    throw new Error(
      `Note publish requires kind "note". Received: ${page.kind}`,
    );
  }
};

const assertNoteWorkspaceMatchesSlug = (
  workspaceId: string,
  page: AuthoredPublicPageDefinition,
): void => {
  const expectedSlug = `/notes/${workspaceId}`;

  if (page.slug === expectedSlug) return;

  throw new Error(
    [
      "Note slug/workspace mismatch.",
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
 * Normalise note page identity without deriving the public slug from the workspace.
 */
const updateNoteIdentity = (
  page: AuthoredPublicPageDefinition,
): AuthoredPublicPageDefinition => {
  const notePageId = toNotePageId(page.id);

  return {
    ...page,
    id: notePageId,
    kind: "note",
    slug: page.slug,
    breadcrumbs: ["home", "notes", notePageId],
  };
};

const updateNoteFooter = (
  page: AuthoredPublicPageDefinition,
): AuthoredPublicPageDefinition => {
  const updatedAt = formatLocalDateTimeWithOffset(new Date());

  return {
    ...page,
    content: {
      ...page.content,
      footer: (page.content.footer ?? []).map((module) => {
        if (module.kind !== "noteEntryFooter") {
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

  assertNoteKind(page);
  assertNoteWorkspaceMatchesSlug(workspaceId, page);

  const publishedPage = updateNoteFooter(updateNoteIdentity(page));

  console.log(`\nPublishing note ${workspaceId}...`);
  console.log(`Workspace path: ${workspacePath}`);
  console.log(`Note file path: ${notePath}\n`);

  await publishContentWithBackfill({
    env: args.env,
    primaryConfig: config,
    getNamespaceId: (config) => config.cloudflareKvNotesNamespaceId,
    key: `page:${publishedPage.id}`,
    value: publishedPage,
  });

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
