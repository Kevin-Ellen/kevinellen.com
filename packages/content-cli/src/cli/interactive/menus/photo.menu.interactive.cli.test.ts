// packages/content-cli/src/cli/interactive/menus/photo.menu.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

import { cancel, isCancel, select } from "@clack/prompts";

import { runPhotoInteractiveMenu } from "@content-cli/cli/interactive/menus/photo.menu.interactive.cli";
import { runPhotoCreateFlow } from "@content-cli/cli/interactive/flows/photo/create.photo.flow.interactive.cli";
import { runPhotoGenerateFlow } from "@content-cli/cli/interactive/flows/photo/generate.photo.flow.interactive.cli";
import { runPhotoValidateFlow } from "@content-cli/cli/interactive/flows/photo/validate.photo.flow.interactive.cli";
import { runPhotoPublishFlow } from "@content-cli/cli/interactive/flows/photo/publish.photo.flow.interactive.cli";
import { runPhotoReadFlow } from "@content-cli/cli/interactive/flows/photo/read.photo.flow.interactive.cli";
import { runPhotoListFlow } from "@content-cli/cli/interactive/flows/photo/list.photo.flow.interactive.cli";
import { runPhotoStatusFlow } from "@content-cli/cli/interactive/flows/photo/status.photo.flow.interactive.cli";
import { runPhotoHomepageStripRebuildFlow } from "@content-cli/cli/interactive/flows/photo/homepage-strip-rebuild.photo.flow.interactive.cli";

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  select: jest.fn(),
}));

jest.mock(
  "@content-cli/cli/interactive/flows/photo/create.photo.flow.interactive.cli",
  () => ({ runPhotoCreateFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/photo/generate.photo.flow.interactive.cli",
  () => ({ runPhotoGenerateFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/photo/validate.photo.flow.interactive.cli",
  () => ({ runPhotoValidateFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/photo/publish.photo.flow.interactive.cli",
  () => ({ runPhotoPublishFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/photo/read.photo.flow.interactive.cli",
  () => ({ runPhotoReadFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/photo/list.photo.flow.interactive.cli",
  () => ({ runPhotoListFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/photo/status.photo.flow.interactive.cli",
  () => ({ runPhotoStatusFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/photo/homepage-strip-rebuild.photo.flow.interactive.cli",
  () => ({ runPhotoHomepageStripRebuildFlow: jest.fn() }),
);

describe("runPhotoInteractiveMenu", () => {
  let mockState: InteractiveCliState;

  beforeEach(() => {
    mockState = { env: "dev" } as InteractiveCliState;
    jest.clearAllMocks();
  });

  it("calls each flow based on user selections and exits on back", async () => {
    const choices = [
      "create",
      "generate",
      "validate",
      "publish",
      "read",
      "list",
      "status",
      "homepageStripRebuild",
      "back",
    ];
    let callIndex = 0;

    (select as unknown as jest.Mock).mockImplementation(
      async () => choices[callIndex++],
    );
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runPhotoInteractiveMenu(mockState);

    expect(runPhotoCreateFlow).toHaveBeenCalledWith(mockState);
    expect(runPhotoGenerateFlow).toHaveBeenCalledWith(mockState);
    expect(runPhotoValidateFlow).toHaveBeenCalledWith(mockState);
    expect(runPhotoPublishFlow).toHaveBeenCalledWith(mockState);
    expect(runPhotoReadFlow).toHaveBeenCalledWith(mockState);
    expect(runPhotoListFlow).toHaveBeenCalledWith(mockState);
    expect(runPhotoStatusFlow).toHaveBeenCalledWith(mockState);
    expect(runPhotoHomepageStripRebuildFlow).toHaveBeenCalledWith(mockState);
  });

  it("handles cancel input", async () => {
    (select as unknown as jest.Mock).mockResolvedValueOnce("create");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runPhotoInteractiveMenu(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runPhotoCreateFlow).not.toHaveBeenCalled();
    expect(runPhotoHomepageStripRebuildFlow).not.toHaveBeenCalled();
  });
});
