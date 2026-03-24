import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";
import type {
  DocumentRenderFooterNavigation,
  ResolvedFooterSection,
  ResolvedNavItem,
} from "@app/rendering/document/document.render.types";

import type {
  NavigationItemConfig,
  PageNavItem,
  SocialNavItem,
  ExternalNavItem,
} from "@app/config/site.config.types";

/* -------------------------------------------------------------------------- */
/* Item resolvers                                                             */
/* -------------------------------------------------------------------------- */

const resolvePageItem = (
  appState: AppState,
  currentPage: PageDefinition,
  item: PageNavItem,
): ResolvedNavItem | null => {
  const page = appState.getPageById(item.id);

  if (!page) return null;

  return Object.freeze({
    id: page.core.id,
    label: item.label ?? page.core.label,
    href: page.core.slug,
    isActive: page.core.id === currentPage.core.id,
    iconId: item.iconId,
  });
};

const resolveSocialItem = (
  appState: AppState,
  item: SocialNavItem,
): ResolvedNavItem | null => {
  const social = appState.siteConfig.socialMedia[item.id];

  if (!social) return null;

  return Object.freeze({
    id: social.id,
    label: social.label,
    href: social.href,
    isActive: false,
    iconId: social.iconId,
  });
};

const resolveExternalItem = (item: ExternalNavItem): ResolvedNavItem => {
  return Object.freeze({
    id: item.id,
    label: item.label,
    href: item.href,
    isActive: false,
    iconId: item.iconId,
  });
};

const resolveItem = (
  appState: AppState,
  currentPage: PageDefinition,
  item: NavigationItemConfig,
): ResolvedNavItem | null => {
  switch (item.kind) {
    case "page":
      return resolvePageItem(appState, currentPage, item);

    case "social":
      return resolveSocialItem(appState, item);

    case "external":
      return resolveExternalItem(item);

    default:
      return null;
  }
};

/* -------------------------------------------------------------------------- */
/* Footer builder                                                             */
/* -------------------------------------------------------------------------- */

export const buildFooterNavigation = (
  appState: AppState,
  page: PageDefinition,
): DocumentRenderFooterNavigation => {
  const sections = appState.siteConfig.navigation.footer.sections
    .map((section) => {
      const items = section.items
        .map((item) => resolveItem(appState, page, item))
        .filter((item): item is ResolvedNavItem => item !== null);

      if (!items.length) return null;

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
