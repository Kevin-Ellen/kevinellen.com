// packages/content-cli/src/cli/interactive/flows/note/promote.note.flow.interactive.cli.ts

import { cancel, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

export const runNotePromoteFlow = async (
  state: InteractiveCliState,
  from: ContentCliEnvironment,
  to: ContentCliEnvironment,
): Promise<void> => {
  const slug = await text({
    message: `Note slug to promote from ${from.toUpperCase()} to ${to.toUpperCase()}`,
  });

  if (isCancel(slug)) {
    cancel("Cancelled.");
    return;
  }

  if (to === "prod") {
    const typedConfirmation = await text({
      message: "⚠ This will overwrite PROD content. Type PROMOTE to continue.",
    });

    if (isCancel(typedConfirmation) || typedConfirmation !== "PROMOTE") {
      cancel("Promotion cancelled.");
      return;
    }
  }

  await runInteractiveContentCommand({
    env: state.env,
    entity: "note",
    action: "promote",
    slug,
    from,
    to,
  });
};
