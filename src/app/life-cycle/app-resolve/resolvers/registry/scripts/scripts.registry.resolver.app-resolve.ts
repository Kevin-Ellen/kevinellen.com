// src/app/life-cycle/app-resolve/resolvers/registry/scripts/scripts.registry.resolver.app-resolve.ts

import type { AppInit } from "../../../../app-init/class.app-init";
import type { ScriptsRegistryAppResolve } from "../../../../../types/registries/scripts.registry.app-resolve.type";

type Input = Readonly<{
  appInit: AppInit;
}>;

export const resolveScriptsRegistryAppResolve = ({
  appInit,
}: Input): ScriptsRegistryAppResolve => appInit.assets.scripts;
