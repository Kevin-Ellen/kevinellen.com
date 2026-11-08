// src/shared/types/registries/svg.registry.app-resolve.type.ts

import type { SvgAssetAppInit } from "../assets/svg.asset.shared.app-init.type";

export type SvgRegistryAppInit = Readonly<Record<string, SvgAssetAppInit>>;
