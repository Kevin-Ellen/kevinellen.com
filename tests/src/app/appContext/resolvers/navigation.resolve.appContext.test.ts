// tests/src/app/appContext/resolvers/navigation.resolve.appContext.test.ts

// tests/src/app/appContext/resolvers/navigation.resolve.appContext.test.ts

import { resolveNavigationAppContext } from "@app/appContext/resolvers/navigation.resolve.appContext";

import type { AppState } from "@app/appState/class.appState";
import type { SocialConfig } from "@config/social.config.types";
import type { NavigationConfig } from "@config/navigation.config.types";

import { homePage } from "@app/content/pages/public/home.public.page";
import { journalListingPage } from "@app/content/pages/public/journal-listing.public.page";
import { notFoundErrorPage } from "@app/content/pages/error/404.error.page";

const createSocialConfig = (): SocialConfig => ({
  github: {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Kevin-Ellen",
    svgId: "icon-github",
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kevinellen/",
    svgId: "icon-linkedin",
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/photography.mallard",
    svgId: "icon-instagram",
  },
});

const createNavigationConfig = (): NavigationConfig => ({
  header: {
    primary: [
      { kind: "page", id: "home" as never },
      { kind: "page", id: "journal" as never, svgId: "book" as never },
      { kind: "external", href: "https://example.com", label: "External" },
    ],
    social: [
      { kind: "social", id: "github" },
      { kind: "social", id: "instagram", svgId: "custom-instagram" as never },
    ],
  },
  footer: {
    sections: [
      {
        id: "explore",
        label: "Explore",
        items: [
          { kind: "page", id: "home" as never },
          { kind: "page", id: "journal" as never },
          { kind: "external", href: "https://example.com", label: "External" },
        ],
      },
    ],
  },
});

const createAppState = (
  pages: Record<string, ReturnType<AppState["getPublicPageById"]>>,
  navigation: NavigationConfig = createNavigationConfig(),
  social: SocialConfig = createSocialConfig(),
): AppState =>
  ({
    navigation,
    social,
    getPublicPageById: (id: string) => pages[id] ?? null,
  }) as AppState;

describe("resolveNavigationAppContext", () => {
  it("resolves header primary page items and marks the current page", () => {
    const appState = createAppState({
      home: homePage,
      journal: journalListingPage,
    });

    const result = resolveNavigationAppContext(appState, journalListingPage);

    expect(result.header.primary).toEqual([
      {
        kind: "page",
        id: "home",
        label: "Home",
        href: "/",
        isCurrent: false,
        svgId: undefined,
      },
      {
        kind: "page",
        id: "journal",
        label: "Journal",
        href: "/journal",
        isCurrent: true,
        svgId: "book",
      },
      {
        kind: "external",
        label: "External",
        href: "https://example.com",
        isCurrent: false,
        svgId: undefined,
      },
    ]);
  });

  it("resolves social items from social config and prefers nav svg override", () => {
    const appState = createAppState({
      home: homePage,
      journal: journalListingPage,
    });

    const result = resolveNavigationAppContext(appState, homePage);

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
        svgId: "custom-instagram",
      },
    ]);
  });

  it("resolves footer sections", () => {
    const appState = createAppState({
      home: homePage,
      journal: journalListingPage,
    });

    const result = resolveNavigationAppContext(appState, homePage);

    expect(result.footer.sections).toEqual([
      {
        id: "explore",
        label: "Explore",
        items: [
          {
            kind: "page",
            id: "home",
            label: "Home",
            href: "/",
            isCurrent: true,
            svgId: undefined,
          },
          {
            kind: "page",
            id: "journal",
            label: "Journal",
            href: "/journal",
            isCurrent: false,
            svgId: undefined,
          },
          {
            kind: "external",
            label: "External",
            href: "https://example.com",
            isCurrent: false,
            svgId: undefined,
          },
        ],
      },
    ]);
  });

  it("throws when a configured page navigation id cannot be resolved", () => {
    const appState = createAppState({
      home: homePage,
    });

    expect(() => resolveNavigationAppContext(appState, homePage)).toThrow(
      "Navigation page not found for id: journal",
    );
  });

  it("does not mark any item current for an error page", () => {
    const appState = createAppState({
      home: homePage,
      journal: journalListingPage,
    });

    const result = resolveNavigationAppContext(appState, notFoundErrorPage);

    expect(result.header.primary[0]).toMatchObject({
      kind: "page",
      id: "home",
      isCurrent: false,
    });

    expect(result.header.primary[1]).toMatchObject({
      kind: "page",
      id: "journal",
      isCurrent: false,
    });
  });
});
