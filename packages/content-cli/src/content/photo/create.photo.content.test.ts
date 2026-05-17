// packages/content-cli/src/content/photo/create.photo.content.test.ts

import fs from "node:fs/promises";

import { runCreatePhotoCommand } from "@content-cli/content/photo/create.photo.content";
import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

jest.mock("node:fs/promises");
jest.mock("@content-cli/utils/format.local.date.time.with.offset.util");

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedFormatDate = jest.mocked(formatLocalDateTimeWithOffset);

describe("runCreatePhotoCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});

    mockedFormatDate.mockReturnValue("2026-05-10T12:34:56+01:00");
  });

  it("creates the photo workspace directories", async () => {
    const result = await runCreatePhotoCommand(
      {} as Parameters<typeof runCreatePhotoCommand>[0],
    );

    expect(mockedFs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining("2026-05-10T12-34-56+01-00/photos"),
      {
        recursive: true,
      },
    );

    expect(result).toEqual({
      ok: true,
    });
  });
});
