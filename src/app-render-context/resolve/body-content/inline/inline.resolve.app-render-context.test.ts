// src/app-render-context/resolve/body-content/inline/inline.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextInline } from "@shared-types/page-content/inline/app-context.inline-content.types";

import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";
import { appRenderContextResolveCodeInline } from "@app-render-context/resolve/body-content/inline/code.resolve.app-render-context";
import { appRenderContextResolveEmphasisInline } from "@app-render-context/resolve/body-content/inline/emphasis.resolve.app-render-context";
import { appRenderContextResolveExternalLinkInline } from "@app-render-context/resolve/body-content/inline/external-link.resolve.app-render-context";
import { appRenderContextResolveInternalLinkInline } from "@app-render-context/resolve/body-content/inline/internal-link.resolve.app-render-context";
import { appRenderContextResolveLineBreakInline } from "@app-render-context/resolve/body-content/inline/line-break.resolve.app-render-context";
import { appRenderContextResolveStrongInline } from "@app-render-context/resolve/body-content/inline/strong.resolve.app-render-context";
import { appRenderContextResolveTextInline } from "@app-render-context/resolve/body-content/inline/text.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-content/inline/code.resolve.app-render-context",
  () => ({
    appRenderContextResolveCodeInline: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/emphasis.resolve.app-render-context",
  () => ({
    appRenderContextResolveEmphasisInline: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/external-link.resolve.app-render-context",
  () => ({
    appRenderContextResolveExternalLinkInline: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/internal-link.resolve.app-render-context",
  () => ({
    appRenderContextResolveInternalLinkInline: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/line-break.resolve.app-render-context",
  () => ({
    appRenderContextResolveLineBreakInline: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/strong.resolve.app-render-context",
  () => ({
    appRenderContextResolveStrongInline: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/text.resolve.app-render-context",
  () => ({
    appRenderContextResolveTextInline: jest.fn(),
  }),
);

describe("appRenderContextResolveInline", () => {
  const appContext = {} as unknown as AppContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ["code", appRenderContextResolveCodeInline],
    ["emphasis", appRenderContextResolveEmphasisInline],
    ["externalLink", appRenderContextResolveExternalLinkInline],
    ["internalLink", appRenderContextResolveInternalLinkInline],
    ["lineBreak", appRenderContextResolveLineBreakInline],
    ["strong", appRenderContextResolveStrongInline],
    ["text", appRenderContextResolveTextInline],
  ] as const)("resolves %s inline content", (kind, resolver) => {
    const inline = { kind } as unknown as AppContextInline;
    const resolvedInline = { kind, resolved: true };

    jest.mocked(resolver).mockReturnValue(resolvedInline as never);

    expect(appRenderContextResolveInline(appContext, inline as never)).toEqual(
      resolvedInline,
    );

    expect(resolver).toHaveBeenCalledTimes(1);
  });

  it("throws when no inline resolver is registered", () => {
    const inline = {
      kind: "missingInline",
    } as never;

    expect(() => appRenderContextResolveInline(appContext, inline)).toThrow(
      "No AppRenderContext inline resolver registered for kind: missingInline",
    );
  });
});
