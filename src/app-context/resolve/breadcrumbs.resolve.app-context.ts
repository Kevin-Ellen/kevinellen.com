// src/app-context/resolve/breadcrumbs.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextBreadcrumbs } from "@shared-types/breadcrumbs/app-context.breadcrumbs.types";
import type {
  PageIdError,
  PageIdPublic,
} from "@shared-types/pages/shared/id.shared.page.types";

import { resolveInternalLinkAppContext } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";

type BreadcrumbSource =
  | readonly PageIdPublic[]
  | readonly ["home", PageIdError];

const resolveBreadcrumbLabel = (
  id: PageIdPublic | PageIdError,
  appState: AppState,
): string => {
  const publicPage = appState.getPublicPageById(id);

  if (publicPage) {
    return publicPage.label;
  }

  const errorPage = appState.getErrorPageById(id as PageIdError);

  if (errorPage) {
    return errorPage.metadata.pageTitle;
  }

  throw new Error(`Missing page for breadcrumb id '${id}'.`);
};

export const resolveBreadcrumbsAppContext = (
  breadcrumbIds: BreadcrumbSource,
  appState: AppState,
): AppContextBreadcrumbs => {
  const ids = [...breadcrumbIds];

  if (ids.length === 0) {
    throw new Error("Breadcrumbs must contain at least one item.");
  }

  const currentId = ids[ids.length - 1];
  const parentIds = ids.slice(0, -1);

  return {
    items: parentIds.map((id) =>
      resolveInternalLinkAppContext(
        {
          kind: "internal",
          id,
          svgId: null,
          behaviour: {
            openInNewTab: false,
          },
        },
        appState,
      ),
    ),
    current: resolveBreadcrumbLabel(currentId, appState),
  };
};
