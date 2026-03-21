// src/app/rendering/document/navigation/build.footer.navigation.ts

import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";
import type {
  DocumentRenderFooterNavigation,
  ResolvedFooterSection,
  ResolvedNavItem,
} from "@app/rendering/document/document.render.types";

const resolveItem = (
  appState: AppState,
  currentPage: PageDefinition,
  id: string,
): ResolvedNavItem | null => {
  const page = appState.getPageById(id);

  if (page) {
    return Object.freeze({
      id: page.core.id,
      label: page.core.label,
      href: page.core.slug,
      isActive: page.core.id === currentPage.core.id,
    });
  }

  const social =
    appState.siteConfig.socialMedia[
      id as keyof typeof appState.siteConfig.socialMedia
    ];

  if (social) {
    return Object.freeze({
      id: social.id,
      label: social.label,
      href: social.href,
      isActive: false,
      iconId: social.iconId,
    });
  }

  return null;
};

export const buildFooterNavigation = (
  appState: AppState,
  page: PageDefinition,
): DocumentRenderFooterNavigation => {
  const sections = appState.siteConfig.navigation.footer.sections
    .map((section) => {
      const items = section.items
        .map((id) => resolveItem(appState, page, id))
        .filter((item): item is ResolvedNavItem => item !== null);

      if (!items.length) {
        return null;
      }

      return Object.freeze<ResolvedFooterSection>({
        id: section.id,
        label: section.label,
        items: Object.freeze(items),
      });
    })
    .filter((section): section is ResolvedFooterSection => section !== null);

  return Object.freeze({
    sections: Object.freeze(sections),
  });
};
