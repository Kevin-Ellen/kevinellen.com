// src/tools/authored-content-generator/validate/import-authored.validate.ts

import { pathToFileURL } from "node:url";

export const importAuthored = async (
  filePath: string,
  exportName: string,
): Promise<unknown> => {
  const moduleUrl = pathToFileURL(filePath).href;
  const module = (await import(moduleUrl)) as Record<string, unknown>;

  if (!(exportName in module)) {
    throw new Error(`Missing "${exportName}" export in ${filePath}`);
  }

  return module[exportName];
};
