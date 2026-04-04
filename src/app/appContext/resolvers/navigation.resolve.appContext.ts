// src/app/appContext/resolvers/navigation.resolve.appContext.ts

import type {
  AppContextFooterNavigationSection,
  AppContextNavigation,
  AppContextNavigationItem,
  AppContextSvgIcon,
} from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { PageId } from "@app/pages/page.definition";
import type { NavigationItem } from "@config/navigation.config.types";
import type { SvgAssetId } from "@config/assets.config.types";

const getSvgDimensionsFromViewBox = (
  viewBox: string,
): {
  width: number;
  height: number;
} => {
  const parts = viewBox.split(" ");

  if (parts.length !== 4) {
    throw new Error(`Invalid viewBox: ${viewBox}`);
  }

  const width = Number(parts[2]);
  const height = Number(parts[3]);

  if (!width || !height) {
    throw new Error(`Invalid viewBox dimensions: ${viewBox}`);
  }

  return { width, height };
};

const resolveSvgIconAppContext = (
  svgId: SvgAssetId,
  appState: AppState,
): AppContextSvgIcon => {
  const svg = appState
    .getAssetsConfig()
    .svgs.find((asset) => asset.id === svgId);

  if (!svg) {
    throw new Error(`Missing navigation SVG asset for id: ${svgId}`);
  }

  const { width, height } = getSvgDimensionsFromViewBox(svg.viewBox);

  return {
    id: svg.id,
    viewBox: svg.viewBox,
    width,
    height,
  };
};

const resolveNavigationItemAppContext = (
  item: NavigationItem,
  currentPageId: PageId | null,
  appState: AppState,
): AppContextNavigationItem => {
  const svgIcon = item.svgId
    ? resolveSvgIconAppContext(item.svgId, appState)
    : undefined;

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
      ...(svgIcon ? { svgIcon } : {}),
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
      ...(svgIcon ? { svgIcon } : {}),
    };
  }

  return {
    kind: "external",
    label: item.label,
    href: item.href,
    isCurrent: false,
    ...(svgIcon ? { svgIcon } : {}),
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
