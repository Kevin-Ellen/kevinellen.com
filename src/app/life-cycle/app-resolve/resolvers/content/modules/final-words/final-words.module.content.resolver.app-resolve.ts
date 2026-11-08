// src/app/life-cycle/app-resolve/resolvers/content/modules/final-words/final-words.module.content.resolver.app-resolve.ts

import type { FinalWordsModuleContentAppInit } from "../../../../../../../shared/types/content/modules/final-words.module.content.shared.app-init.type";
import type { FinalWordsModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/final-words/final-words.module.content.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../../types/registries/content.registry.app-resolve.type";
import type { PhotoGetter } from "../../../../getters/photo-kv/photo-kv.getter.app-resolve";

import { resolveComponentContentAppResolve } from "../../components/component.content.resolver.app-resolve";

type Input = Readonly<{
  content: FinalWordsModuleContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
  getPhoto: PhotoGetter;
}>;

export const resolveFinalWordsModuleContentAppResolve = async ({
  content,
  contentRegistry,
  getPhoto,
}: Input): Promise<FinalWordsModuleContentAppResolve> => ({
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
