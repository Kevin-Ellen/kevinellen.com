// tests/src/app-context/resolve/page/content/block/article-section.resolve.app-context.test.ts

import {
  appContextResolveArticleSectionBlockContentModule,
  appContextResolveArticleSectionHeadingBlockContentModule,
} from "@app-context/resolve/page/content/block/article-section.resolve.app-context";
import { appContextResolveBlockContentModule } from "@app-context/resolve/page/content/block/block.page-content.resolve.app-context";

jest.mock(
  "@app-context/resolve/page/content/block/block.page-content.resolve.app-context",
  () => ({
    appContextResolveBlockContentModule: jest.fn(),
  }),
);

describe("appContextResolveArticleSectionHeadingBlockContentModule", () => {
  const context = {} as never;

  it("returns the heading unchanged", () => {
    const heading = {
      text: "Section title",
      level: 2,
      visuallyHidden: false,
    } as const;

    const result = appContextResolveArticleSectionHeadingBlockContentModule(
      heading,
      context,
    );

    expect(result).toBe(heading);
  });
});

describe("appContextResolveArticleSectionBlockContentModule", () => {
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
        flow: "content",
        content: [{ kind: "text", value: "Resolved paragraph" }],
      })
      .mockReturnValueOnce({
        kind: "quote",
        id: "quote-1",
        text: "Resolved quote",
        attribution: "Author",
        flow: "content",
      });

    const module = {
      kind: "articleSection",
      heading: {
        text: "Section title",
        level: 2,
        visuallyHidden: false,
      },
      modules: [
        {
          kind: "paragraph",
          flow: "content",
          content: [{ kind: "text", value: "Original paragraph" }],
        },
        {
          kind: "quote",
          id: "quote-1",
          text: "Original quote",
          attribution: "Author",
          flow: "content",
        },
      ],
    } as const;

    const result = appContextResolveArticleSectionBlockContentModule(
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
          flow: "content",
          content: [{ kind: "text", value: "Resolved paragraph" }],
        },
        {
          kind: "quote",
          id: "quote-1",
          text: "Resolved quote",
          attribution: "Author",
          flow: "content",
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

  it("resolves an empty section with a heading", () => {
    const module = {
      kind: "articleSection",
      heading: {
        text: "Empty section",
        level: 2,
        visuallyHidden: true,
      },
      modules: [],
    } as const;

    const result = appContextResolveArticleSectionBlockContentModule(
      module,
      context,
    );

    expect(result).toEqual({
      kind: "articleSection",
      heading: {
        text: "Empty section",
        level: 2,
        visuallyHidden: true,
      },
      modules: [],
    });

    expect(mockedAppContextResolveBlockContentModule).not.toHaveBeenCalled();
  });
});
