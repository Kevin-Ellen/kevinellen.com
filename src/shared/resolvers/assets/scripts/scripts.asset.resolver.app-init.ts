// src/shared/resolvers/assets/scripts/scripts.asset.resolver.app-init.ts

import type { ScriptsAssetsConfigAuthored } from "../../../types/assets/scripts.assets.config.authored.type";
import type { ScriptsAssetsConfigAppInit } from "../../../types/config/scripts.assets.config.shared.app-init.type";
import type { ScriptAssetAppInit } from "../../../types/assets/script.asset.shared.app-init.type";
import type { ScriptAssetId } from "../../..//types/assets/script-id.asset.shared.type";

type Input = Readonly<{
  authored: ScriptsAssetsConfigAuthored;
}>;

export const resolveScriptsAssetConfigAppInit = ({
  authored,
}: Input): ScriptsAssetsConfigAppInit => {
  const registry = Object.fromEntries(
    Object.entries(authored.registry).map(([id, script]) => {
      if (script.kind === "inline" && script.loading !== undefined) {
        throw new Error(`Inline script cannot specify loading: ${id}`);
      }

      const resolved: ScriptAssetAppInit = {
        ...script,
        id: id as ScriptAssetId,
        scriptType: script.scriptType ?? "module",
        loading: script.loading ?? null,
      };

      return [id, resolved];
    }),
  ) as Record<ScriptAssetId, ScriptAssetAppInit>;

  const global = authored.global.map((id) => {
    if (!Object.hasOwn(registry, id)) {
      throw new Error(`Unknown global script: ${id}`);
    }

    return id as ScriptAssetId;
  });

  return {
    registry,
    global,
  };
};
