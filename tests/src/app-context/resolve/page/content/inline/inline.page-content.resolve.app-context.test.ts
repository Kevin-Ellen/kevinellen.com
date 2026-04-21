// tests/src/app-context/resolve/page/content/inline/inline.page-content.resolve.app-context.test.ts

import { appContextResolveInlineContent } from "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context";
import { appContextResolveTextInlineContent } from "@app-context/resolve/page/content/inline/text.resolve.app-context";
import { appContextResolveCodeInlineContent } from "@app-context/resolve/page/content/inline/code.resolve.app-context";
import { appContextResolveLineBreakInlineContent } from "@app-context/resolve/page/content/inline/line-break.resolve.app-context";
import { appContextResolveEmphasisInlineContent } from "@app-context/resolve/page/content/inline/emphasis.resolve.app-context";
import { appContextResolveStrongInlineContent } from "@app-context/resolve/page/content/inline/strong.resolve.app-context";
import { appContextResolveInternalLinkInlineContent } from "@app-context/resolve/page/content/inline/internal-link.resolve.app-context";
import { appContextResolveExternalLinkInlineContent } from "@app-context/resolve/page/content/inline/external-link.resolve.app-context";

jest.mock(
  "@app-context/resolve/page/content/inline/text.resolve.app-context",
  () => ({
    appContextResolveTextInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/inline/code.resolve.app-context",
  () => ({
    appContextResolveCodeInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/inline/line-break.resolve.app-context",
  () => ({
    appContextResolveLineBreakInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/inline/emphasis.resolve.app-context",
  () => ({
    appContextResolveEmphasisInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/inline/strong.resolve.app-context",
  () => ({
    appContextResolveStrongInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/inline/internal-link.resolve.app-context",
  () => ({
    appContextResolveInternalLinkInlineContent: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/inline/external-link.resolve.app-context",
  () => ({
    appContextResolveExternalLinkInlineContent: jest.fn(),
  }),
);

describe("appContextResolveInlineContent", () => {
  const context = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches text content to the text resolver", () => {
    const content = {
      kind: "text",
      value: "Hello",
    } as const;

    const resolved = content;

    jest.mocked(appContextResolveTextInlineContent).mockReturnValue(resolved);

    const result = appContextResolveInlineContent(content, context);

    expect(result).toBe(resolved);
    expect(appContextResolveTextInlineContent).toHaveBeenCalledWith(content);
  });

  it("dispatches code content to the code resolver", () => {
    const content = {
      kind: "code",
      value: "const x = 1;",
    } as const;

    const resolved = content;

    jest.mocked(appContextResolveCodeInlineContent).mockReturnValue(resolved);

    const result = appContextResolveInlineContent(content, context);

    expect(result).toBe(resolved);
    expect(appContextResolveCodeInlineContent).toHaveBeenCalledWith(content);
  });

  it("dispatches line break content to the line break resolver", () => {
    const content = {
      kind: "lineBreak",
    } as const;

    const resolved = content;

    jest
      .mocked(appContextResolveLineBreakInlineContent)
      .mockReturnValue(resolved);

    const result = appContextResolveInlineContent(content, context);

    expect(result).toBe(resolved);
    expect(appContextResolveLineBreakInlineContent).toHaveBeenCalledWith(
      content,
    );
  });

  it("dispatches emphasis content to the emphasis resolver", () => {
    const content = {
      kind: "emphasis",
      content: [],
    } as const;

    const resolved = content;

    jest
      .mocked(appContextResolveEmphasisInlineContent)
      .mockReturnValue(resolved);

    const result = appContextResolveInlineContent(content, context);

    expect(result).toBe(resolved);
    expect(appContextResolveEmphasisInlineContent).toHaveBeenCalledWith(
      content,
      context,
    );
  });

  it("dispatches strong content to the strong resolver", () => {
    const content = {
      kind: "strong",
      content: [],
    } as const;

    const resolved = content;

    jest.mocked(appContextResolveStrongInlineContent).mockReturnValue(resolved);

    const result = appContextResolveInlineContent(content, context);

    expect(result).toBe(resolved);
    expect(appContextResolveStrongInlineContent).toHaveBeenCalledWith(
      content,
      context,
    );
  });

  it("dispatches internal link content to the internal link resolver", () => {
    const content = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "about",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
    } as const;

    const resolved = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "about",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
        href: "/about",
        text: "About",
      },
    } as const;

    jest
      .mocked(appContextResolveInternalLinkInlineContent)
      .mockReturnValue(resolved);

    const result = appContextResolveInlineContent(content, context);

    expect(result).toBe(resolved);
    expect(appContextResolveInternalLinkInlineContent).toHaveBeenCalledWith(
      content,
      context,
    );
  });

  it("dispatches external link content to the external link resolver", () => {
    const content = {
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
    } as const;

    const resolved = content;

    jest
      .mocked(appContextResolveExternalLinkInlineContent)
      .mockReturnValue(resolved);

    const result = appContextResolveInlineContent(content, context);

    expect(result).toBe(resolved);
    expect(appContextResolveExternalLinkInlineContent).toHaveBeenCalledWith(
      content,
    );
  });

  it("throws when no resolver is registered for the content kind", () => {
    expect(() =>
      appContextResolveInlineContent(
        {
          kind: "unknown",
        } as never,
        context,
      ),
    ).toThrow(
      "No AppContext inline content resolver registered for kind: unknown",
    );
  });
});
