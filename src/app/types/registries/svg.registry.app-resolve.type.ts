// src/app/types/registries/svg.registry.app-resolve.type.ts

import type { SvgAssetAppResolve } from "../primitives/assets/svg/svg.asset.app-resolve.type";

export type SvgRegistryAppResolve = Readonly<
  Record<string, SvgAssetAppResolve>
>;
