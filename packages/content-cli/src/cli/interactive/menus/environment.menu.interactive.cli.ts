// packages/content-cli/src/cli/interactive/menus/environment.menu.interactive.cli.ts

import { cancel, isCancel, select } from "@clack/prompts";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

export const runEnvironmentInteractiveMenu = async (
  state: InteractiveCliState,
): Promise<void> => {
  const env = await select<ContentCliEnvironment>({
    message: "Select environment",
    initialValue: state.env,
    options: [
      { value: "dev", label: "DEV" },
      { value: "stg", label: "STG" },
      { value: "prod", label: "🚨 PROD" },
    ],
  });

  if (isCancel(env)) {
    cancel("Cancelled.");
    return;
  }

  state.env = env;
};
