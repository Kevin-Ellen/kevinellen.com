// packages/content-cli/src/content/journal/promote.journal.content.ts

import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";
import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

export const runPromoteJournalCommand: ContentCommandHandler = async (args) => {
  const journalId = args.slug;

  if (!journalId) {
    throw new Error("Journal promote requires --slug <journal-id>.");
  }

  if (!args.from || !args.to) {
    throw new Error("Journal promote requires --from <env> and --to <env>.");
  }

  if (args.from === args.to) {
    throw new Error(
      "Journal promote requires different --from and --to environments.",
    );
  }

  const fromConfig = loadContentCliConfig(args.from);
  const toConfig = loadContentCliConfig(args.to);

  const key = `page:journal:${journalId}`;

  const journal = await readCloudflareKvValue<AuthoredPublicPageDefinition>(
    fromConfig,
    fromConfig.cloudflareKvJournalsNamespaceId,
    key,
  );

  await writeCloudflareKvValue(
    toConfig,
    toConfig.cloudflareKvJournalsNamespaceId,
    key,
    journal,
  );

  console.log("\nJournal promoted\n");
  console.log(`Key: ${key}`);
  console.log(`From: ${args.from}`);
  console.log(`To: ${args.to}\n`);

  return { ok: true };
};
