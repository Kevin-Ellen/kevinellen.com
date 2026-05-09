// src/app-state/resolve/page-content/block/article-section.resolve.app-state.test.ts

import { appStateResolveArticleSectionBlock } from "@app-state/resolve/page-content/block/article-section.resolve.app-state";
import { appStateResolveBlock } from "@app-state/resolve/page-content/block/block.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/block/block.resolve.app-state",
  () => ({
    appStateResolveBlock: jest.fn(),
  }),
);

describe("appStateResolveArticleSectionBlock", () => {
  const mockedAppStateResolveBlock = jest.mocked(appStateResolveBlock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves heading defaults and nested modules", () => {
    const nestedModule = {
      kind: "paragraph",
      text: "Nested content",
    };

    const resolvedNestedModule = {
      kind: "paragraph",
      text: "Nested content",
      resolved: true,
    };

    mockedAppStateResolveBlock.mockReturnValue(resolvedNestedModule as never);

    const result = appStateResolveArticleSectionBlock({
      kind: "articleSection",
      heading: {
        text: "Field notes",
        level: 2,
      },
      modules: [nestedModule],
    } as never);

    expect(result).toEqual({
      kind: "articleSection",
      heading: {
        text: "Field notes",
        level: 2,
        visuallyHidden: false,
      },
      modules: [resolvedNestedModule],
    });

    expect(mockedAppStateResolveBlock).toHaveBeenCalledTimes(1);
    expect(mockedAppStateResolveBlock).toHaveBeenCalledWith(nestedModule);
  });

  it("preserves explicit visuallyHidden values", () => {
    const result = appStateResolveArticleSectionBlock({
      kind: "articleSection",
      heading: {
        text: "Hidden heading",
        level: 2,
        visuallyHidden: true,
      },
      modules: [],
    });

    expect(result.heading.visuallyHidden).toBe(true);
  });
});
