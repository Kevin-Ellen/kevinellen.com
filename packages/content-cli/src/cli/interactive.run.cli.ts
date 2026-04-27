// packages/content-cli/src/cli/interactive.run.cli.ts

import type { ParsedInteractiveCliArgs } from "@content-cli/types/parse-args.cli.types";

export const runInteractiveCli = async (
  parsedArgs: ParsedInteractiveCliArgs,
): Promise<void> => {
  console.log("Interactive Content CLI");
  console.log(parsedArgs);
};
