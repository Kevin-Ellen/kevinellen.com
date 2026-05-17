// packages/content-cli/src/cli/interactive/menus/note.menu.interactive.cli.ts

import { cancel, isCancel, select } from "@clack/prompts";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

import { runNoteCreateFlow } from "@content-cli/cli/interactive/flows/note/create.note.flow.interactive.cli";
import { runNoteGenerateFlow } from "@content-cli/cli/interactive/flows/note/generate.note.flow.interactive.cli";
import { runNoteValidateFlow } from "@content-cli/cli/interactive/flows/note/validate.note.flow.interactive.cli";
import { runNotePublishFlow } from "@content-cli/cli/interactive/flows/note/publish.note.flow.interactive.cli";
import { runNoteReadFlow } from "@content-cli/cli/interactive/flows/note/read.note.flow.interactive.cli";
import { runNoteListFlow } from "@content-cli/cli/interactive/flows/note/list.note.flow.interactive.cli";
import { runNoteStatusFlow } from "@content-cli/cli/interactive/flows/note/status.note.flow.interactive.cli";

export const runNoteInteractiveMenu = async (
  state: InteractiveCliState,
): Promise<void> => {
  while (true) {
    const action = await select({
      message: "📝 Note",
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
    if (action === "create") await runNoteCreateFlow(state);
    if (action === "generate") await runNoteGenerateFlow(state);
    if (action === "validate") await runNoteValidateFlow(state);
    if (action === "publish") await runNotePublishFlow(state);
    if (action === "read") await runNoteReadFlow(state);
    if (action === "list") await runNoteListFlow(state);
    if (action === "status") await runNoteStatusFlow(state);
  }
};
