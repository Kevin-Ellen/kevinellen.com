// src/app/rendering/document/navigation/build.header.navigation.ts

import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";
import type {
  DocumentRenderHeaderNavigation,
  ResolvedNavItem,
} from "@app/rendering/document/document.render.types";

const resolvePage = (
  appState: AppState,
  currentPage: PageDefinition,
  id: string,
): ResolvedNavItem | null => {
  const page = appState.getPageById(id);

  if (!page) {
    return null;
  }

  return Object.freeze({
    id: page.core.id,
    label: page.core.label,
    href: page.core.slug,
    isActive: page.core.id === currentPage.core.id,
  });
};

const resolveSocial = (
  appState: AppState,
  id: string,
): ResolvedNavItem | null => {
  const social =
    appState.siteConfig.socialMedia[
      id as keyof typeof appState.siteConfig.socialMedia
    ];

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

export const buildHeaderNavigation = (
  appState: AppState,
  page: PageDefinition,
): DocumentRenderHeaderNavigation => {
  const config = appState.siteConfig.navigation.header;

  const primary = config.primary
    .map((id) => resolvePage(appState, page, id))
    .filter((item): item is ResolvedNavItem => item !== null);

  const social = config.social
    .map((id) => resolveSocial(appState, id))
    .filter((item): item is ResolvedNavItem => item !== null);

  return Object.freeze({
    primary: Object.freeze(primary),
    social: Object.freeze(social),
  });
};
