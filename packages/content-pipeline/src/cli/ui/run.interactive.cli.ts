// packages/content-pipeline/src/cli/ui/run.interactive.cli.ts

import { cancel, intro, isCancel, outro, select } from "@clack/prompts";

import type { ContentPipelineEnvironment } from "@content-pipeline/cli/config/environment.cli.types";
import type {
  ContentCliAction,
  ContentCliEntity,
} from "@content-pipeline/cli/cli.types";

export type InteractiveCliSelection = {
  entity: ContentCliEntity;
  action: ContentCliAction;
};

export const runInteractiveCli = async (
  environment: ContentPipelineEnvironment,
): Promise<InteractiveCliSelection | null> => {
  intro(`Kevin Ellen Content Pipeline (${environment.toUpperCase()})`);

  const selection = await select({
    message: "What do you want to do?",
    options: [
      { value: "photo:create", label: "Photo: create draft" },
      { value: "photo:start", label: "Photo: start draft" },
      { value: "photo:upload", label: "Photo: upload draft" },
      { value: "photo:status", label: "Photo: status" },

      { value: "journal:create", label: "Journal: create draft" },
      { value: "journal:start", label: "Journal: start draft" },
      { value: "journal:upload", label: "Journal: upload draft" },

      { value: "exit", label: "Exit" },
    ],
  });

  if (isCancel(selection) || selection === "exit") {
    cancel("Cancelled");
    return null;
  }

  const [entity, action] = selection.split(":") as [
    ContentCliEntity,
    ContentCliAction,
  ];

  outro(`Selected ${entity} ${action}`);

  return {
    entity,
    action,
  };
};
