// packages/content-cli/src/content/journal/promote.journal.content.ts

import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

type JournalPromoteCommandResult = Readonly<
  ContentCommandResult & {
    ok: true;
    entity: "journal";
    action: "promote";
    journalId: string;
    key: string;
    from: NonNullable<ParsedJournalDirectCliArgs["from"]>;
    to: NonNullable<ParsedJournalDirectCliArgs["to"]>;
  }
>;

export const runPromoteJournalCommand = async (
  args: ParsedJournalDirectCliArgs,
): Promise<JournalPromoteCommandResult> => {
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

  const from = args.from;
  const to = args.to;

  const fromConfig = loadContentCliConfig(from);
  const toConfig = loadContentCliConfig(to);

  const key = `page:${journalId}`;

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
  console.log(`From: ${from}`);
  console.log(`To: ${to}\n`);

  return {
    ok: true,
    entity: "journal",
    action: "promote",
    journalId,
    key,
    from,
    to,
  };
};
