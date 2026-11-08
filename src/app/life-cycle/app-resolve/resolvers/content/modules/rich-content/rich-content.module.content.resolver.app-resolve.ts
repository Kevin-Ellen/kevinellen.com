// src/app/life-cycle/app-resolve/resolvers/content/modules/rich-content/rich-content.module.content.resolver.app-resolve.ts

import type { RichContentModuleContentAppInit } from "../../../../../../../shared/types/content/modules/rich-content.module.content.shared.app-init.type";
import type { RichContentModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/rich-content/rich-content.module.content.page.document.app-resolve.type";
import type { PhotoGetter } from "../../../../getters/photo-kv/photo-kv.getter.app-resolve";
import type { ContentRegistryAppResolve } from "../../../../../../types/registries/content.registry.app-resolve.type";

import { resolveComponentContentAppResolve } from "../../components/component.content.resolver.app-resolve";

type Input = Readonly<{
  content: RichContentModuleContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
  getPhoto: PhotoGetter;
}>;

export const resolveRichContentModuleContentAppResolve = async ({
  content,
  contentRegistry,
  getPhoto,
}: Input): Promise<RichContentModuleContentAppResolve> => ({
  ...content,
  components: await Promise.all(
    content.components.map((component) =>
      resolveComponentContentAppResolve({
        content: component,
        contentRegistry,
        getPhoto,
      }),
    ),
  ),
});
