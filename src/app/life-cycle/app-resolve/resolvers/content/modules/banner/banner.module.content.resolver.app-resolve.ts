// src/app/life-cycle/app-resolve/resolvers/content/modules/banner/banner.module.content.resolver.app-resolve.ts

import type { BannerModuleContentAppInit } from "../../../../../../../shared/types/content/modules/banner.module.content.shared.app-init.type";
import type { BannerModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/banner/banner.module.content.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../../types/registries/content.registry.app-resolve.type";
import type { PhotoGetter } from "../../../../getters/photo-kv/photo-kv.getter.app-resolve";

import { resolveComponentContentAppResolve } from "../../components/component.content.resolver.app-resolve";
import { resolveEditorialPhotoComponentContentAppResolve } from "../../components/editorial-photo/editorial-photo.component.content.resolver.app-resolve";

type Input = Readonly<{
  content: BannerModuleContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
  getPhoto: PhotoGetter;
}>;

export const resolveBannerModuleContentAppResolve = async ({
  content,
  contentRegistry,
  getPhoto,
}: Input): Promise<BannerModuleContentAppResolve> => ({
  ...content,
  media: resolveEditorialPhotoComponentContentAppResolve({
    content: content.media,
  }),
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
