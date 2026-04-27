// packages/content-cli/src/cli/run.cli.ts

import { parseCliArgs } from "@content-cli/cli/parse-args.cli";
import { runDirectCli } from "@content-cli/cli/direct.run.cli";
import { runInteractiveCli } from "@content-cli/cli/interactive.run.cli";

export const runCli = async (args: readonly string[]): Promise<void> => {
  const parsedArgs = parseCliArgs(args);

  if (parsedArgs.mode === "interactive") {
    await runInteractiveCli(parsedArgs);
    return;
  }

  await runDirectCli(parsedArgs);
};
