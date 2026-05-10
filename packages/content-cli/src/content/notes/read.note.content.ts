// packages/content-cli/src/content/notes/read.note.content.ts

import type { ParsedNoteDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

export const runReadNoteCommand = async (
  args: ParsedNoteDirectCliArgs,
): Promise<ContentCommandResult> => {
  const noteId = args.slug;

  if (!noteId) {
    throw new Error("Note read requires --slug <note-id>.");
  }

  const config = loadContentCliConfig(args.env);

  const note = await readCloudflareKvValue<AuthoredPublicPageDefinition>(
    config,
    config.cloudflareKvNotesNamespaceId,
    `page:note:${noteId}`,
  );

  console.log("\nNote from KV\n");
  console.log(JSON.stringify(note, null, 2));
  console.log();

  return { ok: true };
};
