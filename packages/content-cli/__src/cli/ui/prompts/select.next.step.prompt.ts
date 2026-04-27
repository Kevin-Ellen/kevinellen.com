// packages/content-pipeline/src/cli/ui/prompts/select.next.step.prompt.ts

import { cancel, isCancel, select } from "@clack/prompts";

import type { ContentCliAction } from "@content-pipeline/cli/types/cli.types";

export type NextStepSelection = "continue" | "back" | "exit";

const getNextStepLabel = (action: ContentCliAction): string => {
  if (action === "create") {
    return "Continue to create";
  }

  if (action === "upload") {
    return "Continue to upload";
  }

  return "Continue";
};

export const selectNextStepPrompt = async (
  action: ContentCliAction,
): Promise<NextStepSelection> => {
  const selection = await select({
    message: "What next?",
    options: [
      {
        value: "continue",
        label: getNextStepLabel(action),
      },
      {
        value: "back",
        label: "Back",
      },
      {
        value: "exit",
        label: "Exit",
      },
    ],
  });

  if (isCancel(selection) || selection === "exit") {
    cancel("Cancelled");
    return "exit";
  }

  return selection;
};
