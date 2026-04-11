// packages/content-profile/src/cli/content.cli.ts

import dotenv from "dotenv";

import { parseCliArgs } from "@content-pipeline/cli/config/parse.args.cli";
import { runDirectCli } from "@content-pipeline/cli/runners/run.direct.cli";
import { runInteractiveCli } from "@content-pipeline/cli/runners/run.interactive.cli";

dotenv.config();

const run = async (): Promise<void> => {
  const parsedArgs = parseCliArgs(process.argv.slice(2));

  if (parsedArgs.mode === "interactive") {
    await runInteractiveCli(parsedArgs.env);
    return;
  }

  await runDirectCli(parsedArgs);
};

void run();
