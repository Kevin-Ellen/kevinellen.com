// src/tools/authored-content-generator/prepare/prepare.ts

import { stat } from "node:fs/promises";
import { resolve } from "node:path";

import { preparePhotos } from "./photo/photo.prepare";
import { prepareJournal } from "./journal.prepare";

const prepare = async (): Promise<void> => {
  const [workspace, ...flags] = process.argv.slice(2);

  if (!workspace || workspace.startsWith("--")) {
    throw new Error("Journal workspace argument is required");
  }

  if (flags.length > 0) {
    throw new Error(`Unsupported preparation options: ${flags.join(", ")}`);
  }

  const directory = resolve(
    process.cwd(),
    "authored-content",
    "journals",
    workspace,
  );

  const workspaceStats = await stat(directory).catch(() => null);

  if (!workspaceStats?.isDirectory()) {
    throw new Error(`Journal workspace not found: ${directory}`);
  }

  console.log(`🦆 Preparing journal workspace: ${workspace}`);

  const photoIds = await preparePhotos({ directory });

  await prepareJournal({
    directory,
    photoIds,
  });

  console.log("🦅 Preparation complete");
};

void prepare().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
