// src/app/rendering/document/navigation/build.header.navigation.ts

import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";
import type {
  DocumentRenderHeaderNavigation,
  ResolvedNavItem,
} from "@app/rendering/document/document.render.types";
import type { NavigationItemConfig } from "@app/config/site.config.types";

/* -------------------------------------------------------------------------- */
/* Page resolver                                                              */
/* -------------------------------------------------------------------------- */

const resolvePage = (
  appState: AppState,
  currentPage: PageDefinition,
  item: Extract<NavigationItemConfig, { kind: "page" }>,
): ResolvedNavItem | null => {
  const page = appState.getPageById(item.id);

  if (!page) {
    return null;
  }

  return Object.freeze({
    id: page.core.id,
    label: item.label ?? page.core.label,
    href: page.core.slug,
    isActive: page.core.id === currentPage.core.id,
    iconId: item.iconId,
  });
};

/* -------------------------------------------------------------------------- */
/* Social resolver                                                            */
/* -------------------------------------------------------------------------- */

const resolveSocial = (
  appState: AppState,
  item: Extract<NavigationItemConfig, { kind: "social" }>,
): ResolvedNavItem | null => {
  const social = appState.siteConfig.socialMedia[item.id];

  if (!social) {
    return null;
  }

  return Object.freeze({
    id: social.id,
    label: social.label,
    href: social.href,
    isActive: false,
    iconId: social.iconId,
  });
};

/* -------------------------------------------------------------------------- */
/* External resolver                                                          */
/* -------------------------------------------------------------------------- */

const resolveExternal = (
  item: Extract<NavigationItemConfig, { kind: "external" }>,
): ResolvedNavItem => {
  return Object.freeze({
    id: item.id,
    label: item.label,
    href: item.href,
    isActive: false,
    iconId: item.iconId,
  });
};

/* -------------------------------------------------------------------------- */
/* Dispatcher                                                                 */
/* -------------------------------------------------------------------------- */

const resolveItem = (
  appState: AppState,
  currentPage: PageDefinition,
  item: NavigationItemConfig,
): ResolvedNavItem | null => {
  switch (item.kind) {
    case "page":
      return resolvePage(appState, currentPage, item);

    case "social":
      return resolveSocial(appState, item);

    case "external":
      return resolveExternal(item);
  }
};

/* -------------------------------------------------------------------------- */
/* Builder                                                                    */
/* -------------------------------------------------------------------------- */

export const buildHeaderNavigation = (
  appState: AppState,
  page: PageDefinition,
): DocumentRenderHeaderNavigation => {
  const config = appState.siteConfig.navigation.header;

  const primary = config.primary
    .map((item) => resolveItem(appState, page, item))
    .filter((item): item is ResolvedNavItem => item !== null);

  const social = config.social
    .map((item) => resolveItem(appState, page, item))
    .filter((item): item is ResolvedNavItem => item !== null);

  return Object.freeze({
    primary: Object.freeze(primary),
    social: Object.freeze(social),
  });
};
