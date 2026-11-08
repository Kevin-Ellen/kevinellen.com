// src/app/life-cycle/app-init/resolvers/resources/resources.resolver.app-init.ts

import type { ResourcesConfigAuthored } from "../../../../types/config/resources/resources.config.authored.type";
import type { ResourcesConfigAppInit } from "../../../../types/config/resources/resources.config.app-init.type";

type Input = Readonly<{
  authored: ResourcesConfigAuthored;
}>;

export const resolveResourcesConfigAppInit = ({
  authored,
}: Input): ResourcesConfigAppInit => ({
  preloads: authored.preloads.map((preload) => ({
    ...preload,
    type: preload.type ?? null,
    crossorigin: preload.crossorigin ?? null,
  })),
});
