// src/app/appContext/resolvers/navigation.resolve.appContext.ts

import type {
  AppContextFooterNavigationSection,
  AppContextNavigation,
  AppContextNavigationItem,
} from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { PageId } from "@shared-types/pages/definitions/base.definition.page";
import type { NavigationItem } from "@config/navigation.config.types";

const resolveNavigationItemAppContext = (
  item: NavigationItem,
  currentPageId: PageId | null,
  appState: AppState,
): AppContextNavigationItem => {
  if (item.kind === "page") {
    const page = appState.getPublicPageById(item.id);

    if (!page) {
      throw new Error(`Missing navigation page for id: ${item.id}`);
    }

    return {
      kind: "page",
      id: page.core.id,
      label: page.core.label,
      href: page.core.slug,
      isCurrent: page.core.id === currentPageId,
      ...(item.svgId ? { svgId: item.svgId } : {}),
    };
  }

  if (item.kind === "social") {
    const social = appState.getSocialConfig()[item.id];

    if (!social) {
      throw new Error(`Missing social navigation entry for id: ${item.id}`);
    }

    return {
      kind: "social",
      id: social.id,
      label: social.label,
      href: social.href,
      isCurrent: false,
      ...(item.svgId ? { svgId: item.svgId } : {}),
    };
  }

  return {
    kind: "external",
    label: item.label,
    href: item.href,
    isCurrent: false,
    ...(item.svgId ? { svgId: item.svgId } : {}),
  };
};

const resolveFooterSectionsAppContext = (
  currentPageId: PageId | null,
  appState: AppState,
): readonly AppContextFooterNavigationSection[] => {
  return appState.getNavigationConfig().footer.sections.map((section) => ({
    id: section.id,
    label: section.label,
    items: section.items.map((item) =>
      resolveNavigationItemAppContext(item, currentPageId, appState),
    ),
  }));
};

export const resolveNavigationAppContext = (
  currentPageId: PageId | null,
  appState: AppState,
): AppContextNavigation => {
  const navigationConfig = appState.getNavigationConfig();

  return {
    header: {
      primary: navigationConfig.header.primary.map((item) =>
        resolveNavigationItemAppContext(item, currentPageId, appState),
      ),
      social: navigationConfig.header.social.map((item) =>
        resolveNavigationItemAppContext(item, currentPageId, appState),
      ),
    },
    footer: {
      sections: resolveFooterSectionsAppContext(currentPageId, appState),
    },
  };
};
