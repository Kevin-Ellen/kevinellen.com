// src/app/life-cycle/app-resolve/resolvers/content/modules/editorial-split/editorial-split.module.content.resolver.app-resolve.ts

import type { EditorialSplitModuleContentAppInit } from "../../../../../../../shared/types/content/modules/editorial-split.module.content.shared.app-init.type";
import type { EditorialSplitModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/editorial-split/editorial-split.module.content.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../../types/registries/content.registry.app-resolve.type";
import type { PhotoGetter } from "../../../../getters/photo-kv/photo-kv.getter.app-resolve";

import { resolveComponentContentAppResolve } from "../../components/component.content.resolver.app-resolve";

type Input = Readonly<{
  content: EditorialSplitModuleContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
  getPhoto: PhotoGetter;
}>;

export const resolveEditorialSplitModuleContentAppResolve = async ({
  content,
  contentRegistry,
  getPhoto,
}: Input): Promise<EditorialSplitModuleContentAppResolve> => ({
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
  media: (await resolveComponentContentAppResolve({
    content: content.media,
    contentRegistry,
    getPhoto,
  })) as EditorialSplitModuleContentAppResolve["media"],
});
