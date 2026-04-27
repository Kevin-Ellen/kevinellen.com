// packages/content-pipeline/src/cli/flows/helpers/get.next.step.action.ts

import type { ContentCliAction } from "@content-pipeline/cli/types/cli.types";

export const getNextStepAction = (
  action: ContentCliAction,
): ContentCliAction | null => {
  if (action === "start") {
    return "create";
  }

  if (action === "create") {
    return "upload";
  }

  return null;
};
