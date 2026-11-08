// src/app/life-cycle/app-resolve/resolvers/content/modules/editorial-feature/editorial-feature.module.content.resolver.app-resolve.ts

import type { EditorialFeatureModuleContentAppInit } from "../../../../../../../shared/types/content/modules/editorial-feature.module.content.shared.app-init.type";
import type { EditorialFeatureModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/editorial-feature/editorial-feature.module.content.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../../types/registries/content.registry.app-resolve.type";
import type { PhotoGetter } from "../../../../getters/photo-kv/photo-kv.getter.app-resolve";

import { resolveComponentContentAppResolve } from "../../components/component.content.resolver.app-resolve";
import { resolveEditorialPhotoComponentContentAppResolve } from "../../components/editorial-photo/editorial-photo.component.content.resolver.app-resolve";

type Input = Readonly<{
  content: EditorialFeatureModuleContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
  getPhoto: PhotoGetter;
}>;

export const resolveEditorialFeatureModuleContentAppResolve = async ({
  content,
  contentRegistry,
  getPhoto,
}: Input): Promise<EditorialFeatureModuleContentAppResolve> => ({
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
  media: resolveEditorialPhotoComponentContentAppResolve({
    content: content.media,
  }),
});
