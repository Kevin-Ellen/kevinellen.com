// src/app-render-context/resolve/body-footer/nav.resolve.body-footer.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextFooterNavigation } from "@shared-types/config/navigation/footer/app-render-context.footer.navigation.types";

import { resolveLinkAppRenderContext } from "@app-render-context/shared/link.resolve.app-render-context";

export const resolveNavBodyFooterAppRenderContext = (
  appContext: AppContext,
): AppRenderContextFooterNavigation => {
  return {
    sections: appContext.navigation.footer.sections.map((section) => ({
      id: section.id,
      label: section.label,
      items: section.items.map((item) =>
        resolveLinkAppRenderContext(appContext, item),
      ),
    })),
  };
};
