// tests/src/app-render-context/resolve/body-header/breadcrumbs.resolve.app-render-context.test.ts

import { resolveBreadcrumbsAppRenderContext } from "@app-render-context/resolve/body-header/breadcrumbs.resolve.app-render-context";
import { resolveInternalLinkAppRenderContext } from "@app-render-context/shared/internal.link.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/shared/internal.link.resolve.app-render-context",
  () => ({
    resolveInternalLinkAppRenderContext: jest.fn(),
  }),
);

describe("resolveBreadcrumbsAppRenderContext", () => {
  it("resolves breadcrumb items and preserves the current label", () => {
    const breadcrumbItem = {
      kind: "internal",
      id: "home",
      href: "/",
      text: "Home",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const appContext = {
      breadcrumbs: {
        items: [breadcrumbItem],
        current: "About",
      },
    } as unknown as AppContext;

    const resolvedBreadcrumbItem = {
      kind: "internal",
      href: "/",
      text: "Home",
      openInNewTab: false,
      svg: null,
    } as const;

    jest
      .mocked(resolveInternalLinkAppRenderContext)
      .mockReturnValue(resolvedBreadcrumbItem);

    const result = resolveBreadcrumbsAppRenderContext(appContext);

    expect(resolveInternalLinkAppRenderContext).toHaveBeenCalledWith(
      appContext,
      breadcrumbItem,
    );

    expect(result).toEqual({
      items: [resolvedBreadcrumbItem],
      current: "About",
    });
  });

  it("handles empty breadcrumb items", () => {
    const appContext = {
      breadcrumbs: {
        items: [],
        current: "Home",
      },
    } as unknown as AppContext;

    const result = resolveBreadcrumbsAppRenderContext(appContext);

    expect(resolveInternalLinkAppRenderContext).not.toHaveBeenCalled();

    expect(result).toEqual({
      items: [],
      current: "Home",
    });
  });
});
