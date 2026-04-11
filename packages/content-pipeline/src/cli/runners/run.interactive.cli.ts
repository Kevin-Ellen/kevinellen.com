// packages/content-pipeline/src/cli/runners/run.interactive.cli.ts

import { intro } from "@clack/prompts";

import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";

import { runMainFlow } from "@content-pipeline/cli/flows/run.main.flow";

export const runInteractiveCli = async (
  env: ContentCommandOptions["env"],
): Promise<void> => {
  intro(`Kevin Ellen Content Pipeline (${env.toUpperCase()})`);

  await runMainFlow(env);
};
