// src/app-state/resolve/page-content/inline/inline.page-content.resolve.app-state.test.ts

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

import { appStateResolveTextInline } from "@app-state/resolve/page-content/inline/text.resolve.app-state";
import { appStateResolveCodeInline } from "@app-state/resolve/page-content/inline/code.resolve.app-state";
import { appStateResolveLineBreakInline } from "@app-state/resolve/page-content/inline/line-break.resolve.app-state";
import { appStateResolveEmphasisInline } from "@app-state/resolve/page-content/inline/emphasis.resolve.app-state";
import { appStateResolveStrongInline } from "@app-state/resolve/page-content/inline/strong.resolve.app-state";
import { appStateResolveInternalLinkInline } from "@app-state/resolve/page-content/inline/internal-link.resolve.app-state";
import { appStateResolveExternalLinkInline } from "@app-state/resolve/page-content/inline/external-link.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/inline/text.resolve.app-state",
  () => ({
    appStateResolveTextInline: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/code.resolve.app-state",
  () => ({
    appStateResolveCodeInline: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/line-break.resolve.app-state",
  () => ({
    appStateResolveLineBreakInline: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/emphasis.resolve.app-state",
  () => ({
    appStateResolveEmphasisInline: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/strong.resolve.app-state",
  () => ({
    appStateResolveStrongInline: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/internal-link.resolve.app-state",
  () => ({
    appStateResolveInternalLinkInline: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/inline/external-link.resolve.app-state",
  () => ({
    appStateResolveExternalLinkInline: jest.fn(),
  }),
);

describe("appStateResolveInline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves text inline content", () => {
    const content = {
      kind: "text",
      value: "Hello world",
    };

    const resolved = {
      kind: "text",
      value: "Resolved text",
    };

    jest.mocked(appStateResolveTextInline).mockReturnValue(resolved as never);

    expect(appStateResolveInline(content as never)).toEqual(resolved);

    expect(appStateResolveTextInline).toHaveBeenCalledWith(content);
  });

  it("resolves code inline content", () => {
    const content = {
      kind: "code",
      value: "const x = 1;",
    };

    const resolved = {
      kind: "code",
      value: "resolved",
    };

    jest.mocked(appStateResolveCodeInline).mockReturnValue(resolved as never);

    expect(appStateResolveInline(content as never)).toEqual(resolved);

    expect(appStateResolveCodeInline).toHaveBeenCalledWith(content);
  });

  it("resolves line break inline content", () => {
    const content = {
      kind: "lineBreak",
    };

    const resolved = {
      kind: "lineBreak",
    };

    jest
      .mocked(appStateResolveLineBreakInline)
      .mockReturnValue(resolved as never);

    expect(appStateResolveInline(content as never)).toEqual(resolved);

    expect(appStateResolveLineBreakInline).toHaveBeenCalledWith(content);
  });

  it("resolves emphasis inline content", () => {
    const content = {
      kind: "emphasis",
      content: [],
    };

    const resolved = {
      kind: "emphasis",
      content: [],
    };

    jest
      .mocked(appStateResolveEmphasisInline)
      .mockReturnValue(resolved as never);

    expect(appStateResolveInline(content as never)).toEqual(resolved);

    expect(appStateResolveEmphasisInline).toHaveBeenCalledWith(content);
  });

  it("resolves strong inline content", () => {
    const content = {
      kind: "strong",
      content: [],
    };

    const resolved = {
      kind: "strong",
      content: [],
    };

    jest.mocked(appStateResolveStrongInline).mockReturnValue(resolved as never);

    expect(appStateResolveInline(content as never)).toEqual(resolved);

    expect(appStateResolveStrongInline).toHaveBeenCalledWith(content);
  });

  it("resolves internal link inline content", () => {
    const content = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "journal",
      },
    };

    const resolved = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "journal",
      },
    };

    jest
      .mocked(appStateResolveInternalLinkInline)
      .mockReturnValue(resolved as never);

    expect(appStateResolveInline(content as never)).toEqual(resolved);

    expect(appStateResolveInternalLinkInline).toHaveBeenCalledWith(content);
  });

  it("resolves external link inline content", () => {
    const content = {
      kind: "externalLink",
      link: {
        kind: "external",
        href: "https://example.com",
        text: "Example",
      },
    };

    const resolved = {
      kind: "externalLink",
      link: {
        kind: "external",
        href: "https://example.com",
        text: "Example",
      },
    };

    jest
      .mocked(appStateResolveExternalLinkInline)
      .mockReturnValue(resolved as never);

    expect(appStateResolveInline(content as never)).toEqual(resolved);

    expect(appStateResolveExternalLinkInline).toHaveBeenCalledWith(content);
  });

  it("throws when no inline resolver is registered for the inline kind", () => {
    expect(() =>
      appStateResolveInline({
        kind: "missingInline",
      } as never),
    ).toThrow(
      "No AppState inline content resolver registered for kind: missingInline",
    );
  });
});
