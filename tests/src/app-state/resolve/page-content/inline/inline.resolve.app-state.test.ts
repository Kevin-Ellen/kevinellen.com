// tests/src/app-state/resolve/page-content/inline/inline.page-content.resolve.app-state.test.ts

jest.mock(
  "@app-state/resolve/page-content/inline/text.resolve.app-state",
  () => ({
    appStateResolveTextInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/code.resolve.app-state",
  () => ({
    appStateResolveCodeInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/line-break.resolve.app-state",
  () => ({
    appStateResolveLineBreakInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/emphasis.resolve.app-state",
  () => ({
    appStateResolveEmphasisInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/strong.resolve.app-state",
  () => ({
    appStateResolveStrongInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/internal-link.resolve.app-state",
  () => ({
    appStateResolveInternalLinkInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/external-link.resolve.app-state",
  () => ({
    appStateResolveExternalLinkInlineContent: jest.fn(),
  }),
);

import { appStateResolveTextInlineContent } from "@app-state/resolve/page-content/inline/text.resolve.app-state";
import { appStateResolveCodeInlineContent } from "@app-state/resolve/page-content/inline/code.resolve.app-state";
import { appStateResolveLineBreakInlineContent } from "@app-state/resolve/page-content/inline/line-break.resolve.app-state";
import { appStateResolveEmphasisInlineContent } from "@app-state/resolve/page-content/inline/emphasis.resolve.app-state";
import { appStateResolveStrongInlineContent } from "@app-state/resolve/page-content/inline/strong.resolve.app-state";
import { appStateResolveInternalLinkInlineContent } from "@app-state/resolve/page-content/inline/internal-link.resolve.app-state";
import { appStateResolveExternalLinkInlineContent } from "@app-state/resolve/page-content/inline/external-link.resolve.app-state";

import { appStateResolveInlineContent } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

const mockedAppStateResolveTextInlineContent =
  appStateResolveTextInlineContent as jest.MockedFunction<
    typeof appStateResolveTextInlineContent
  >;

const mockedAppStateResolveCodeInlineContent =
  appStateResolveCodeInlineContent as jest.MockedFunction<
    typeof appStateResolveCodeInlineContent
  >;

const mockedAppStateResolveLineBreakInlineContent =
  appStateResolveLineBreakInlineContent as jest.MockedFunction<
    typeof appStateResolveLineBreakInlineContent
  >;

const mockedAppStateResolveEmphasisInlineContent =
  appStateResolveEmphasisInlineContent as jest.MockedFunction<
    typeof appStateResolveEmphasisInlineContent
  >;

const mockedAppStateResolveStrongInlineContent =
  appStateResolveStrongInlineContent as jest.MockedFunction<
    typeof appStateResolveStrongInlineContent
  >;

const mockedAppStateResolveInternalLinkInlineContent =
  appStateResolveInternalLinkInlineContent as jest.MockedFunction<
    typeof appStateResolveInternalLinkInlineContent
  >;

const mockedAppStateResolveExternalLinkInlineContent =
  appStateResolveExternalLinkInlineContent as jest.MockedFunction<
    typeof appStateResolveExternalLinkInlineContent
  >;

describe("appStateResolveInlineContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches text content through the text inline resolver", () => {
    const content = {
      kind: "text",
      value: "Hello",
    } as const;

    const resolvedContent = {
      kind: "text",
      value: "Resolved hello",
    };

    mockedAppStateResolveTextInlineContent.mockReturnValue(
      resolvedContent as ReturnType<typeof appStateResolveTextInlineContent>,
    );

    const result = appStateResolveInlineContent(content);

    expect(mockedAppStateResolveTextInlineContent).toHaveBeenCalledWith(
      content,
    );
    expect(result).toBe(resolvedContent);
  });

  it("dispatches code content through the code inline resolver", () => {
    const content = {
      kind: "code",
      value: "const answer = 42;",
    } as const;

    const resolvedContent = {
      kind: "code",
      value: "resolved code",
    };

    mockedAppStateResolveCodeInlineContent.mockReturnValue(
      resolvedContent as ReturnType<typeof appStateResolveCodeInlineContent>,
    );

    const result = appStateResolveInlineContent(content);

    expect(mockedAppStateResolveCodeInlineContent).toHaveBeenCalledWith(
      content,
    );
    expect(result).toBe(resolvedContent);
  });

  it("dispatches lineBreak content through the line-break inline resolver", () => {
    const content = {
      kind: "lineBreak",
    } as const;

    const resolvedContent = {
      kind: "lineBreak",
    };

    mockedAppStateResolveLineBreakInlineContent.mockReturnValue(
      resolvedContent as ReturnType<
        typeof appStateResolveLineBreakInlineContent
      >,
    );

    const result = appStateResolveInlineContent(content);

    expect(mockedAppStateResolveLineBreakInlineContent).toHaveBeenCalledWith(
      content,
    );
    expect(result).toBe(resolvedContent);
  });

  it("dispatches emphasis content through the emphasis inline resolver", () => {
    const content = {
      kind: "emphasis",
      content: [],
    } as const;

    const resolvedContent = {
      kind: "emphasis",
      content: [],
    };

    mockedAppStateResolveEmphasisInlineContent.mockReturnValue(
      resolvedContent as ReturnType<
        typeof appStateResolveEmphasisInlineContent
      >,
    );

    const result = appStateResolveInlineContent(content);

    expect(mockedAppStateResolveEmphasisInlineContent).toHaveBeenCalledWith(
      content,
    );
    expect(result).toBe(resolvedContent);
  });

  it("dispatches strong content through the strong inline resolver", () => {
    const content = {
      kind: "strong",
      content: [],
    } as const;

    const resolvedContent = {
      kind: "strong",
      content: [],
    };

    mockedAppStateResolveStrongInlineContent.mockReturnValue(
      resolvedContent as ReturnType<typeof appStateResolveStrongInlineContent>,
    );

    const result = appStateResolveInlineContent(content);

    expect(mockedAppStateResolveStrongInlineContent).toHaveBeenCalledWith(
      content,
    );
    expect(result).toBe(resolvedContent);
  });

  it("dispatches internalLink content through the internal-link inline resolver", () => {
    const content = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "home",
      },
    } as const;

    const resolvedContent = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "home",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
    };

    mockedAppStateResolveInternalLinkInlineContent.mockReturnValue(
      resolvedContent as ReturnType<
        typeof appStateResolveInternalLinkInlineContent
      >,
    );

    const result = appStateResolveInlineContent(content);

    expect(mockedAppStateResolveInternalLinkInlineContent).toHaveBeenCalledWith(
      content,
    );
    expect(result).toBe(resolvedContent);
  });

  it("dispatches externalLink content through the external-link inline resolver", () => {
    const content = {
      kind: "externalLink",
      link: {
        kind: "external",
        href: "https://example.com",
        text: "Example",
      },
    } as const;

    const resolvedContent = {
      kind: "externalLink",
      link: {
        kind: "external",
        href: "https://example.com",
        text: "Example",
        svgId: null,
        behaviour: {
          openInNewTab: true,
        },
      },
    };

    mockedAppStateResolveExternalLinkInlineContent.mockReturnValue(
      resolvedContent as ReturnType<
        typeof appStateResolveExternalLinkInlineContent
      >,
    );

    const result = appStateResolveInlineContent(content);

    expect(mockedAppStateResolveExternalLinkInlineContent).toHaveBeenCalledWith(
      content,
    );
    expect(result).toBe(resolvedContent);
  });

  it("throws a clear error when no inline resolver is registered for the kind", () => {
    expect(() =>
      appStateResolveInlineContent({
        kind: "unknown",
      } as never),
    ).toThrow(
      "No AppState inline content resolver registered for kind: unknown",
    );
  });
});
