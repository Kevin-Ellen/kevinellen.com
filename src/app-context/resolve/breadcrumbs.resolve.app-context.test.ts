// src/app-context/resolve/breadcrumbs.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";

import { appContextResolveBreadcrumbs } from "@app-context/resolve/breadcrumbs.resolve.app-context";

import { appContextResolveInternalLink } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";

jest.mock(
  "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context",
  () => ({
    appContextResolveInternalLink: jest.fn(),
  }),
);

describe("appContextResolveBreadcrumbs", () => {
  const mockedAppContextResolveInternalLink = jest.mocked(
    appContextResolveInternalLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves parent breadcrumb links and current label", () => {
    const appState = {
      getPublicPageById: jest.fn((id: string) =>
        id === "journal-entry" ? { label: "A walk in Epping Forest" } : null,
      ),
      getErrorPageById: jest.fn(() => null),
    } as unknown as AppState;

    mockedAppContextResolveInternalLink.mockReturnValue({
      kind: "internal",
      id: "journal",
      href: "/journal",
      text: "Journal",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    });

    const result = appContextResolveBreadcrumbs(
      ["journal", "journal-entry"],
      appState,
    );

    expect(result).toEqual({
      items: [
        {
          kind: "internal",
          id: "journal",
          href: "/journal",
          text: "Journal",
          svgId: null,
          behaviour: {
            openInNewTab: false,
          },
        },
      ],
      current: "A walk in Epping Forest",
    });

    expect(mockedAppContextResolveInternalLink).toHaveBeenCalledWith(
      {
        kind: "internal",
        id: "journal",
        text: null,
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
      appState,
    );
  });

  it("resolves current label from error pages when public page is missing", () => {
    const appState = {
      getPublicPageById: jest.fn(() => null),
      getErrorPageById: jest.fn(() => ({
        label: "Not found",
      })),
    } as unknown as AppState;

    const result = appContextResolveBreadcrumbs(["error-404"], appState);

    expect(result).toEqual({
      items: [],
      current: "Not found",
    });

    expect(appState.getErrorPageById).toHaveBeenCalledWith("error-404");
  });

  it("throws when breadcrumbs are empty", () => {
    const appState = {} as AppState;

    expect(() => appContextResolveBreadcrumbs([], appState)).toThrow(
      "Breadcrumbs must contain at least one item.",
    );
  });

  it("throws when current breadcrumb page cannot be resolved", () => {
    const appState = {
      getPublicPageById: jest.fn(() => null),
      getErrorPageById: jest.fn(() => null),
    } as unknown as AppState;

    expect(() =>
      appContextResolveBreadcrumbs(["missing-page"], appState),
    ).toThrow("Missing page for breadcrumb id 'missing-page'.");
  });
});
