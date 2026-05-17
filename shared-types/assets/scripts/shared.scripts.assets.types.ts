// shared-types/assets/scripts/shared.scripts.assets.types.ts

export type ScriptAssetLoading =
  | { loading?: undefined }
  | { loading: "defer" }
  | { loading: "async" };
