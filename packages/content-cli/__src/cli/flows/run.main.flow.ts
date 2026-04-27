// packages/content-pipeline/src/cli/flows/run.main.flow.ts

import { cancel, isCancel, select } from "@clack/prompts";

import type { ContentPipelineEnvironment } from "@content-pipeline/config/types/content.pipeline.environment.types";

import { runPhotoFlow } from "@content-pipeline/cli/flows/run.photo.flow";
import { runJournalFlow } from "@content-pipeline/cli/flows/run.journal.flow";

export const runMainFlow = async (
  env: ContentPipelineEnvironment,
): Promise<void> => {
  const shouldExit = false;

  while (!shouldExit) {
    const selection = await select({
      message: "What do you want to do?",
      options: [
        { value: "journal", label: "Journal" },
        { value: "photo", label: "Photos" },
        { value: "exit", label: "Exit" },
      ],
    });

    if (isCancel(selection) || selection === "exit") {
      cancel("Cancelled");
      return;
    }

    if (selection === "photo") {
      await runPhotoFlow(env);
    }

    if (selection === "journal") {
      await runJournalFlow(env);
    }
  }
};
