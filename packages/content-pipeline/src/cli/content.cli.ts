// packages/content-pipeline/src/cli/content.cli.ts

import dotenv from "dotenv";

import { cancel, isCancel, select } from "@clack/prompts";

import type { ContentCommandOptions } from "@content-pipeline/cli/command.options.types";
import { parseCliArgs } from "@content-pipeline/cli/config/parse.args.cli";
import { runCreatePhotoCommand } from "@content-pipeline/cli/commands/photo/create.photo.command";
import { runStartPhotoCommand } from "@content-pipeline/cli/commands/photo/start.photo.command";
import { runUploadPhotoCommand } from "@content-pipeline/cli/commands/photo/upload.photo.command";
import { runInteractiveCli } from "@content-pipeline/cli/ui/run.interactive.cli";

dotenv.config();

type ContentCommandHandler = (options: ContentCommandOptions) => Promise<void>;

const commandMap: Record<string, Record<string, ContentCommandHandler>> = {
  photo: {
    start: runStartPhotoCommand,
    create: runCreatePhotoCommand,
    upload: runUploadPhotoCommand,
  },
};

const runInteractiveFlow = async (
  environment: ContentCommandOptions["environment"],
): Promise<void> => {
  let shouldExit = false;

  while (!shouldExit) {
    const selection = await runInteractiveCli(environment);

    if (!selection) {
      return;
    }

    const command = commandMap[selection.entity]?.[selection.action];

    if (!command) {
      throw new Error("Unsupported CLI command.");
    }

    await command({
      environment,
    });

    if (selection.entity === "photo" && selection.action === "create") {
      const nextAction = await select({
        message: "Draft created. What next?",
        options: [
          {
            value: "continue",
            label: "Continue when ready",
            hint: "Go add your photos, then come back here",
          },
          {
            value: "menu",
            label: "Return to main menu",
          },
          {
            value: "exit",
            label: "Exit",
          },
        ],
      });

      if (isCancel(nextAction) || nextAction === "exit") {
        cancel("Cancelled");
        return;
      }

      if (nextAction === "continue") {
        await runStartPhotoCommand({
          environment,
        });

        const followUpAction = await select({
          message: "Photo drafts created. What next?",
          options: [
            {
              value: "menu",
              label: "Return to main menu",
            },
            {
              value: "upload",
              label: "Upload draft",
            },
            {
              value: "exit",
              label: "Exit",
            },
          ],
        });

        if (isCancel(followUpAction) || followUpAction === "exit") {
          cancel("Cancelled");
          return;
        }

        if (followUpAction === "upload") {
          await runUploadPhotoCommand({
            environment,
          });

          return;
        }

        continue;
      }

      continue;
    }

    const nextAction = await select({
      message: "What next?",
      options: [
        {
          value: "menu",
          label: "Return to main menu",
        },
        {
          value: "exit",
          label: "Exit",
        },
      ],
    });

    if (isCancel(nextAction) || nextAction === "exit") {
      cancel("Cancelled");
      shouldExit = true;
    }
  }
};

const run = async (): Promise<void> => {
  const parsedArgs = parseCliArgs(process.argv.slice(2));

  if (parsedArgs.mode === "interactive") {
    await runInteractiveFlow(parsedArgs.environment);
    return;
  }

  if (!parsedArgs.entity || !parsedArgs.action) {
    throw new Error("Direct mode requires both an entity and an action.");
  }

  const entityCommands = commandMap[parsedArgs.entity];
  const command = entityCommands?.[parsedArgs.action];

  if (!command) {
    throw new Error("Unsupported CLI command.");
  }

  await command({
    environment: parsedArgs.environment,
  });
};

void run();
