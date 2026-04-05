// src/app/appContext/resolvers/navigation.resolve.appContext.ts

// src/app/appContext/resolvers/navigation.resolve.appContext.ts

import type {
  AppContextFooterNavigationSection,
  AppContextNavigation,
  AppContextNavigationItem,
  AppContextPage,
} from "@app/appContext/appContext.types";
import type { NavigationItem } from "@app/config/navigation.config.types";
import type { AppState } from "@app/appState/class.appState";

const resolveNavigationItem = (
  appState: AppState,
  currentPage: AppContextPage,
  item: NavigationItem,
): AppContextNavigationItem => {
  if (item.kind === "page") {
    const navPage = appState.getPublicPageById(item.id);

    if (!navPage) {
      throw new Error(`Navigation page not found for id: ${item.id}`);
    }

    return {
      kind: "page",
      id: navPage.core.id,
      label: navPage.core.label,
      href: navPage.core.slug,
      isCurrent:
        "slug" in currentPage.core && currentPage.core.id === navPage.core.id,
      svgId: item.svgId,
    };
  }

  if (item.kind === "social") {
    const socialItem = appState.social[item.id];

    if (!socialItem) {
      throw new Error(`Navigation social item not found for id: ${item.id}`);
    }

    return {
      kind: "social",
      id: socialItem.id,
      label: socialItem.label,
      href: socialItem.href,
      isCurrent: false,
      svgId: item.svgId ?? socialItem.svgId,
    };
  }

  return {
    kind: "external",
    label: item.label,
    href: item.href,
    isCurrent: false,
    svgId: item.svgId,
  };
};

const resolveFooterSections = (
  appState: AppState,
  currentPage: AppContextPage,
): readonly AppContextFooterNavigationSection[] => {
  return appState.navigation.footer.sections.map((section) => ({
    id: section.id,
    label: section.label,
    items: section.items.map((item) =>
      resolveNavigationItem(appState, currentPage, item),
    ),
  }));
};

export const resolveNavigationAppContext = (
  appState: AppState,
  currentPage: AppContextPage,
): AppContextNavigation => {
  return {
    header: {
      primary: appState.navigation.header.primary.map((item) =>
        resolveNavigationItem(appState, currentPage, item),
      ),
      social: appState.navigation.header.social.map((item) =>
        resolveNavigationItem(appState, currentPage, item),
      ),
    },
    footer: {
      sections: resolveFooterSections(appState, currentPage),
    },
  };
};
