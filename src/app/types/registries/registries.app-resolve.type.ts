// src/app/types/registries/registries.app-resolve.type.ts

import type { ContentRegistryAppResolve } from "./content.registry.app-resolve.type";
import type { ScriptsRegistryAppResolve } from "./scripts.registry.app-resolve.type";
import type { SvgRegistryAppResolve } from "./svg.registry.app-resolve.type";
import type { StructuredDataRegistryAppResolve } from "./structured-data.registry.app-resolve.type";

export type RegistriesAppResolve = Readonly<{
  content: ContentRegistryAppResolve;
  scripts: ScriptsRegistryAppResolve;
  svg: SvgRegistryAppResolve;
  structuredData: StructuredDataRegistryAppResolve;
}>;
