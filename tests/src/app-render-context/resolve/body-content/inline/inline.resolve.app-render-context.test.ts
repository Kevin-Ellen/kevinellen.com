// tests/src/app-render-context/resolve/body-content/inline/inline.resolve.app-render-context.test.ts

import { resolveInlineContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

import { resolveCodeInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/code.resolve.app-render-context";
import { resolveEmphasisInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/emphasis.resolve.app-render-context";
import { resolveExternalLinkInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/external-link.resolve.app-render-context";
import { resolveInternalLinkInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/internal-link.resolve.app-render-context";
import { resolveLineBreakInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/line-break.resolve.app-render-context";
import { resolveStrongInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/strong.resolve.app-render-context";
import { resolveTextInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/text.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/body-content/inline/code.resolve.app-render-context",
  () => ({
    resolveCodeInlineContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/emphasis.resolve.app-render-context",
  () => ({
    resolveEmphasisInlineContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/external-link.resolve.app-render-context",
  () => ({
    resolveExternalLinkInlineContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/internal-link.resolve.app-render-context",
  () => ({
    resolveInternalLinkInlineContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/line-break.resolve.app-render-context",
  () => ({
    resolveLineBreakInlineContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/strong.resolve.app-render-context",
  () => ({
    resolveStrongInlineContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/inline/text.resolve.app-render-context",
  () => ({
    resolveTextInlineContentAppRenderContext: jest.fn(),
  }),
);

describe("resolveInlineContentModuleAppRenderContext", () => {
  const appContext = {} as AppContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ["code", resolveCodeInlineContentAppRenderContext],
    ["emphasis", resolveEmphasisInlineContentAppRenderContext],
    ["externalLink", resolveExternalLinkInlineContentAppRenderContext],
    ["internalLink", resolveInternalLinkInlineContentAppRenderContext],
    ["lineBreak", resolveLineBreakInlineContentAppRenderContext],
    ["strong", resolveStrongInlineContentAppRenderContext],
    ["text", resolveTextInlineContentAppRenderContext],
  ] as const)(
    "delegates %s modules to the matching resolver",
    (kind, resolver) => {
      const module = {
        kind,
        content: [],
        value: "value",
        link: null,
      } as never;

      const resolved = {
        kind,
        resolved: true,
      } as never;

      jest.mocked(resolver).mockReturnValue(resolved);

      const result = resolveInlineContentModuleAppRenderContext(
        appContext,
        module,
      );

      expect(resolver).toHaveBeenCalledWith(appContext, module);
      expect(result).toBe(resolved);
    },
  );
});
