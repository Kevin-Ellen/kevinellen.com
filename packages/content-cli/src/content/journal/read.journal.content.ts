// packages/content-cli/src/content/journal/read.journal.content.ts

import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

export const runReadJournalCommand = async (
  args: ParsedJournalDirectCliArgs,
): Promise<ContentCommandResult> => {
  const journalId = args.slug;

  if (!journalId) {
    throw new Error("Journal read requires --slug <journal-id>.");
  }

  const config = loadContentCliConfig(args.env);

  const journal = await readCloudflareKvValue<AuthoredPublicPageDefinition>(
    config,
    config.cloudflareKvJournalsNamespaceId,
    `page:journal:${journalId}`,
  );

  console.log("\nJournal from KV\n");
  console.log(JSON.stringify(journal, null, 2));
  console.log();

  return { ok: true };
};
