// src/app/assets/scripts.assets.types.ts

export type ScriptAssetLocation = "head" | "footer";

export type ScriptAsset =
  | {
      readonly id: string;
      readonly kind: "inline";
      readonly content: string;
      readonly type?: string;
      readonly location: ScriptAssetLocation;
    }
  | {
      readonly id: string;
      readonly kind: "external";
      readonly src: string;
      readonly type?: string;
      readonly defer?: boolean;
      readonly async?: boolean;
      readonly location: ScriptAssetLocation;
    };
