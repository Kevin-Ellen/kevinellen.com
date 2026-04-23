import type { AppContext } from "@app-context/class.app-context";
import type { AppContextListBlockContentModule } from "@shared-types/page-content/block/list/app-context.list.block.page-content.types";
import type { AppRenderContextListBlockContentModule } from "@shared-types/page-content/block/list/app-render-context.list.block.page-content.types";

import { resolveInlineContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

export const resolveListBlockContentModuleAppRenderContext = (
  appContext: AppContext,
  module: AppContextListBlockContentModule,
): AppRenderContextListBlockContentModule => {
  return {
    ...module,
    items: module.items.map((item) => ({
      ...item,
      content: item.content.map((inlineItem) =>
        resolveInlineContentModuleAppRenderContext(appContext, inlineItem),
      ),
    })),
  };
};
