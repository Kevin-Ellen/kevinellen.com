// tests/src/app-context/resolve/page/content/block/content-section.resolve.app-context.test.ts

import {
  appContextResolveContentSectionBlockContentModule,
  appContextResolveContentSectionHeadingBlockContentModule,
} from "@app-context/resolve/page/content/block/content-section.resolve.app-context";
import { appContextResolveBlockContentModule } from "@app-context/resolve/page/content/block/block.page-content.resolve.app-context";

jest.mock(
  "@app-context/resolve/page/content/block/block.page-content.resolve.app-context",
  () => ({
    appContextResolveBlockContentModule: jest.fn(),
  }),
);

describe("appContextResolveContentSectionHeadingBlockContentModule", () => {
  const context = {} as never;

  it("returns the heading unchanged", () => {
    const heading = {
      text: "Section title",
      level: 2,
      visuallyHidden: false,
    } as const;

    const result = appContextResolveContentSectionHeadingBlockContentModule(
      heading,
      context,
    );

    expect(result).toBe(heading);
  });
});

describe("appContextResolveContentSectionBlockContentModule", () => {
  const mockedAppContextResolveBlockContentModule = jest.mocked(
    appContextResolveBlockContentModule,
  );

  const context = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves heading and nested block modules", () => {
    mockedAppContextResolveBlockContentModule
      .mockReturnValueOnce({
        kind: "paragraph",
        content: [{ kind: "text", value: "Resolved paragraph" }],
      })
      .mockReturnValueOnce({
        kind: "quote",
        id: "quote-1",
        text: "Resolved quote",
        attribution: "Author",
      });

    const module = {
      kind: "contentSection",
      heading: {
        text: "Section title",
        level: 2,
        visuallyHidden: false,
      },
      modules: [
        {
          kind: "paragraph",
          content: [{ kind: "text", value: "Original paragraph" }],
        },
        {
          kind: "quote",
          id: "quote-1",
          text: "Original quote",
          attribution: "Author",
        },
      ],
    } as const;

    const result = appContextResolveContentSectionBlockContentModule(
      module,
      context,
    );

    expect(result).toEqual({
      ...module,
      heading: {
        text: "Section title",
        level: 2,
        visuallyHidden: false,
      },
      modules: [
        {
          kind: "paragraph",
          content: [{ kind: "text", value: "Resolved paragraph" }],
        },
        {
          kind: "quote",
          id: "quote-1",
          text: "Resolved quote",
          attribution: "Author",
        },
      ],
    });

    expect(mockedAppContextResolveBlockContentModule).toHaveBeenCalledTimes(2);
    expect(mockedAppContextResolveBlockContentModule).toHaveBeenNthCalledWith(
      1,
      module.modules[0],
      context,
    );
    expect(mockedAppContextResolveBlockContentModule).toHaveBeenNthCalledWith(
      2,
      module.modules[1],
      context,
    );
  });

  it("returns null heading when the section has no heading", () => {
    const module = {
      kind: "contentSection",
      heading: null,
      modules: [],
    } as const;

    const result = appContextResolveContentSectionBlockContentModule(
      module,
      context,
    );

    expect(result).toEqual({
      kind: "contentSection",
      heading: null,
      modules: [],
    });

    expect(mockedAppContextResolveBlockContentModule).not.toHaveBeenCalled();
  });
});
