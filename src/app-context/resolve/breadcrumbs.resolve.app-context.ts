// src/app-context/resolve/breadcrumbs.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextBreadcrumbs } from "@shared-types/breadcrumbs/app-context.breadcrumbs.types";
import type {
  PageId,
  PageIdError,
} from "@shared-types/page-definitions/shared/shared.page-id.page-definition.types";

import { resolveInternalLinkAppContext } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";

const resolvePageById = (id: PageId, appState: AppState) => {
  return (
    appState.getPublicPageById(id) ??
    appState.getErrorPageById(id as PageIdError)
  );
};

const resolveBreadcrumbLabel = (id: PageId, appState: AppState): string => {
  const page = resolvePageById(id, appState);

  if (!page) {
    throw new Error(`Missing page for breadcrumb id '${id}'.`);
  }

  return page.label;
};

export const resolveBreadcrumbsAppContext = (
  breadcrumbIds: readonly PageId[],
  appState: AppState,
): AppContextBreadcrumbs => {
  if (breadcrumbIds.length === 0) {
    throw new Error("Breadcrumbs must contain at least one item.");
  }

  const currentId = breadcrumbIds[breadcrumbIds.length - 1];
  const parentIds = breadcrumbIds.slice(0, -1);

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
