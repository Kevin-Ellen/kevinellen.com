// src/app/life-cycle/app-resolve/resolvers/registry/svg/svg.registry.resolver.app-resolve.ts

import type { AppInit } from "../../../../app-init/class.app-init";
import type { SvgRegistryAppResolve } from "../../../../../types/registries/svg.registry.app-resolve.type";

type Input = Readonly<{
  appInit: AppInit;
}>;

export const resolveSvgRegistryAppResolve = ({
  appInit,
}: Input): SvgRegistryAppResolve => appInit.assets.svg;
