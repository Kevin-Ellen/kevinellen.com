// src/app-context/resolve/page-content/inline/inline.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateInline } from "@shared-types/page-content/inline/app-state.inline-content.types";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

import { appContextResolveTextInline } from "@app-context/resolve/page-content/inline/text.resolve.app-context";
import { appContextResolveCodeInline } from "@app-context/resolve/page-content/inline/code.resolve.app-context";
import { appContextResolveLineBreakInline } from "@app-context/resolve/page-content/inline/line-break.resolve.app-context";
import { appContextResolveEmphasisInline } from "@app-context/resolve/page-content/inline/emphasis.resolve.app-context";
import { appContextResolveStrongInline } from "@app-context/resolve/page-content/inline/strong.resolve.app-context";
import { appContextResolveInternalLinkInline } from "@app-context/resolve/page-content/inline/internal-link.resolve.app-context";
import { appContextResolveExternalLinkInline } from "@app-context/resolve/page-content/inline/external-link.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/inline/text.resolve.app-context",
  () => ({
    appContextResolveTextInline: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/inline/code.resolve.app-context",
  () => ({
    appContextResolveCodeInline: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/inline/line-break.resolve.app-context",
  () => ({
    appContextResolveLineBreakInline: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/inline/emphasis.resolve.app-context",
  () => ({
    appContextResolveEmphasisInline: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/inline/strong.resolve.app-context",
  () => ({
    appContextResolveStrongInline: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/inline/internal-link.resolve.app-context",
  () => ({
    appContextResolveInternalLinkInline: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/inline/external-link.resolve.app-context",
  () => ({
    appContextResolveExternalLinkInline: jest.fn(),
  }),
);

describe("appContextResolveInline", () => {
  const context = {} as AppContextPageContentResolverContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ["text", appContextResolveTextInline],
    ["code", appContextResolveCodeInline],
    ["lineBreak", appContextResolveLineBreakInline],
    ["emphasis", appContextResolveEmphasisInline],
    ["strong", appContextResolveStrongInline],
    ["internalLink", appContextResolveInternalLinkInline],
    ["externalLink", appContextResolveExternalLinkInline],
  ] as const)("resolves %s inline content", (kind, resolver) => {
    const content = {
      kind,
    } as AppStateInline;

    const resolved = {
      kind,
      resolved: true,
    };

    jest.mocked(resolver).mockReturnValue(resolved as never);

    const result = appContextResolveInline(content as never, context);

    expect(result).toBe(resolved);
    expect(resolver).toHaveBeenCalledTimes(1);
    expect(resolver).toHaveBeenCalledWith(content, context);
  });
});
