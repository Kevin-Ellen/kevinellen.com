// src/app-render-context/resolve/body-footer/colophon.resolve.body-footer.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBodyFooterColophon } from "@app-render-context/types/body-footer.app-render-context.types";

export const resolveColophonBodyFooterAppRenderContext = (
  appContext: AppContext,
): AppRenderContextBodyFooterColophon => {
  const { colophon } = appContext.globalFooter;

  return {
    items: [
      {
        label: "Copyright",
        value: `© ${colophon.copyrightYear} ${colophon.copyrightName}`,
      },
      {
        label: "Rights",
        value: colophon.allRightsReserved
          ? "All rights reserved"
          : "Some rights reserved",
      },
    ],
  };
};
