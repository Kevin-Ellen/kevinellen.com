// src/tools/authored-content-generator/create.ts

import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const createDraft = async (): Promise<void> => {
  const now = new Date();

  const timestamp =
    [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-") +
    "_" +
    [
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
    ].join("-");

  const draftsDirectory = resolve(
    process.cwd(),
    "authored-content",
    "journals",
  );

  await mkdir(draftsDirectory, { recursive: true });
  await mkdir(resolve(draftsDirectory, timestamp));
  await mkdir(resolve(draftsDirectory, timestamp, "photos"));

  console.log(`Created journal folder: ${resolve(draftsDirectory, timestamp)}`);
};

void createDraft();
