// packages/content-cli/src/content/notes/promote.note.content.ts

import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";

import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { ParsedNoteDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

type NotePromoteCommandResult = Readonly<
  ContentCommandResult & {
    ok: true;
    entity: "note";
    action: "promote";
    noteId: string;
    key: string;
    from: NonNullable<ParsedNoteDirectCliArgs["from"]>;
    to: NonNullable<ParsedNoteDirectCliArgs["to"]>;
  }
>;

export const runPromoteNoteCommand = async (
  args: ParsedNoteDirectCliArgs,
): Promise<NotePromoteCommandResult> => {
  const noteId = args.slug;

  if (!noteId) {
    throw new Error("Note promote requires --slug <note-id>.");
  }

  if (!args.from || !args.to) {
    throw new Error("Note promote requires --from <env> and --to <env>.");
  }

  if (args.from === args.to) {
    throw new Error(
      "Note promote requires different --from and --to environments.",
    );
  }

  const from = args.from;
  const to = args.to;

  const fromConfig = loadContentCliConfig(from);
  const toConfig = loadContentCliConfig(to);

  const key = `page:${noteId}`;

  const note = await readCloudflareKvValue<AuthoredPublicPageDefinition>(
    fromConfig,
    fromConfig.cloudflareKvNotesNamespaceId,
    key,
  );

  await writeCloudflareKvValue(
    toConfig,
    toConfig.cloudflareKvNotesNamespaceId,
    key,
    note,
  );

  console.log("\nNote promoted\n");
  console.log(`Key: ${key}`);
  console.log(`From: ${from}`);
  console.log(`To: ${to}\n`);

  return {
    ok: true,
    entity: "note",
    action: "promote",
    noteId,
    key,
    from,
    to,
  };
};
