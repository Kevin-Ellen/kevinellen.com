// src/app/appContext/resolvers/navigation.resolve.appContext.test.ts

import { resolveNavigationAppContext } from "@app/appContext/resolvers/navigation.resolve.appContext";
import { AppState } from "@app/appState/class.appState";
import { createAppState } from "@app/appState/create.appState";

import type { NavigationItem } from "@config/navigation.config.types";

describe("resolveNavigationAppContext", () => {
  const appState = createAppState();

  it("resolves header primary page navigation items", () => {
    const result = resolveNavigationAppContext("home", appState);

    expect(result.header.primary).toEqual([
      {
        kind: "page",
        id: "journal",
        label: "Journal",
        href: "/journal",
        isCurrent: false,
      },
    ]);
  });

  it("resolves header social navigation items", () => {
    const result = resolveNavigationAppContext("home", appState);

    expect(result.header.social).toEqual([
      {
        kind: "social",
        id: "github",
        label: "GitHub",
        href: "https://github.com/Kevin-Ellen",
        isCurrent: false,
        svgId: "icon-github",
      },
      {
        kind: "social",
        id: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/photography.mallard",
        isCurrent: false,
        svgId: "icon-instagram",
      },
    ]);
  });

  it("marks the current page correctly when a different page is active", () => {
    const result = resolveNavigationAppContext("journal", appState);

    expect(result.header.primary).toEqual([
      {
        kind: "page",
        id: "journal",
        label: "Journal",
        href: "/journal",
        isCurrent: true,
      },
    ]);
  });

  it("resolves footer navigation sections", () => {
    const result = resolveNavigationAppContext("home", appState);

    expect(result.footer.sections).toEqual([
      {
        id: "site",
        label: "Site",
        items: [
          {
            kind: "page",
            id: "journal",
            label: "Journal",
            href: "/journal",
            isCurrent: false,
          },
        ],
      },
      {
        id: "practice",
        label: "Practice",
        items: [],
      },
      {
        id: "elsewhere",
        label: "Elsewhere",
        items: [
          {
            kind: "social",
            id: "github",
            label: "GitHub",
            href: "https://github.com/Kevin-Ellen",
            isCurrent: false,
          },
          {
            kind: "social",
            id: "instagram",
            label: "Instagram",
            href: "https://www.instagram.com/photography.mallard",
            isCurrent: false,
          },
          {
            kind: "social",
            id: "linkedin",
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/kevinellen/",
            isCurrent: false,
          },
        ],
      },
      {
        id: "legal",
        label: "Legal",
        items: [],
      },
    ]);
  });

  it("supports null current page id for non-page targets", () => {
    const result = resolveNavigationAppContext(null, appState);

    expect(result.header.primary).toEqual([
      {
        kind: "page",
        id: "journal",
        label: "Journal",
        href: "/journal",
        isCurrent: false,
      },
    ]);
  });

  it("throws when a configured page navigation id cannot be resolved", () => {
    const brokenAppState = Object.create(appState) as AppState;

    brokenAppState.getNavigationConfig = () =>
      ({
        header: {
          primary: [{ kind: "page", id: "does-not-exist" }],
          social: [],
        },
        footer: {
          sections: [],
        },
      }) as ReturnType<AppState["getNavigationConfig"]>;

    expect(() => resolveNavigationAppContext("home", brokenAppState)).toThrow(
      "Missing navigation page for id: does-not-exist",
    );
  });

  it("throws when a configured social navigation id cannot be resolved", () => {
    const brokenAppState = Object.create(appState) as AppState;

    brokenAppState.getNavigationConfig = () =>
      ({
        header: {
          primary: [],
          social: [
            {
              kind: "social",
              id: "does-not-exist",
            } as unknown as NavigationItem,
          ],
        },
        footer: {
          sections: [],
        },
      }) as ReturnType<AppState["getNavigationConfig"]>;

    expect(() => resolveNavigationAppContext("home", brokenAppState)).toThrow(
      "Missing social navigation entry for id: does-not-exist",
    );
  });

  it("passes through external navigation items", () => {
    const brokenAppState = Object.create(appState) as AppState;

    brokenAppState.getNavigationConfig = () =>
      ({
        header: {
          primary: [
            {
              kind: "external",
              href: "https://example.com",
              label: "External",
              svgId: "icon-home",
            },
          ],
          social: [],
        },
        footer: {
          sections: [],
        },
      }) as ReturnType<AppState["getNavigationConfig"]>;

    const result = resolveNavigationAppContext("home", brokenAppState);

    expect(result.header.primary).toEqual([
      {
        kind: "external",
        href: "https://example.com",
        label: "External",
        isCurrent: false,
        svgId: "icon-home",
      },
    ]);
  });
});
