// packages/content-cli/src/content/photo/utils/import.draft.photo.util.content.test.ts

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { importPhotoDraft } from "@content-cli/content/photo/utils/import.draft.photo.util.content";

describe("importPhotoDraft", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(123456789);
  });

  it("imports the module and returns the photo", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "photo-draft-"));
    const filePath = path.join(tempDir, "draft.photo.cjs");

    await fs.writeFile(
      filePath,
      `
        exports.photo = {
          id: "photo-1",
        };
      `,
    );

    const result = await importPhotoDraft(filePath);

    expect(result).toEqual({ id: "photo-1" });

    await fs.rm(tempDir, { recursive: true, force: true });
  });
});
