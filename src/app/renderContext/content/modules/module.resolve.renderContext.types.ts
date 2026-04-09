// src/app/renderContext/content/modules/module.resolve.renderContext.types.ts

import type { RenderContextPhoto } from "@app/renderContext/renderContext.types";

export type RenderContextModuleResolverDependencies = {
  photosById: ReadonlyMap<string, RenderContextPhoto>;
};
