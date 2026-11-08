// src/shared/types/assets/scripts.assets.config.authored.type.ts

import type { ScriptAssetAuthored } from "../../../content-schema/assets/script.asset.content-schema.authored.type";

export type ScriptsAssetsConfigAuthored = Readonly<{
  registry: Readonly<Record<string, ScriptAssetAuthored>>;
  global: readonly string[];
}>;
