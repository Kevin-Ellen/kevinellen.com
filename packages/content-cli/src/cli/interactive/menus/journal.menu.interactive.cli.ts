// packages/content-cli/src/cli/interactive/menus/journal.menu.interactive.cli.ts

import { cancel, isCancel, select } from "@clack/prompts";

import { runJournalCreateFlow } from "@content-cli/cli/interactive/flows/journal/create.journal.flow.interactive.cli";
import { runJournalGenerateFlow } from "@content-cli/cli/interactive/flows/journal/generate.journal.flow.interactive.cli";
import { runJournalValidateFlow } from "@content-cli/cli/interactive/flows/journal/validate.journal.flow.interactive.cli";
import { runJournalPublishFlow } from "@content-cli/cli/interactive/flows/journal/publish.journal.flow.interactive.cli";
import { runJournalReadFlow } from "@content-cli/cli/interactive/flows/journal/read.journal.flow.interactive.cli";
import { runJournalListFlow } from "@content-cli/cli/interactive/flows/journal/list.journal.flow.interactive.cli";
import { runJournalStatusFlow } from "@content-cli/cli/interactive/flows/journal/status.journal.flow.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runJournalInteractiveMenu = async (
  state: InteractiveCliState,
): Promise<void> => {
  while (true) {
    const action = await select({
      message: "📘 Journal",
      options: [
        { value: "create", label: "Create" },
        { value: "generate", label: "Generate" },
        { value: "validate", label: "✅ Validate" },
        { value: "publish", label: "🪶 Publish" },
        { value: "read", label: "Read from KV" },
        { value: "list", label: "List" },
        { value: "status", label: "Status" },
        { value: "back", label: "Back" },
      ],
    });

    if (isCancel(action)) {
      cancel("Cancelled.");
      return;
    }

    if (action === "back") return;
    if (action === "create") await runJournalCreateFlow(state);
    if (action === "generate") await runJournalGenerateFlow(state);
    if (action === "validate") await runJournalValidateFlow(state);
    if (action === "publish") await runJournalPublishFlow(state);
    if (action === "read") await runJournalReadFlow(state);
    if (action === "list") await runJournalListFlow(state);
    if (action === "status") await runJournalStatusFlow(state);
  }
};
