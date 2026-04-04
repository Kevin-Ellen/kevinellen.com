// src/config/assets.config.types.ts

export type ScriptAssetId = "header-condense";
export type SvgAssetId =
  | "icon-home"
  | "icon-github"
  | "icon-instagram"
  | "icon-linkedin"
  | "logo-rspb"
  | "logo-national-trust"
  | "logo-vogelbescherming-nederland";

type ScriptLoading =
  | { loading?: undefined }
  | { loading: "defer" }
  | { loading: "async" };

export type ScriptAssetConfig =
  | ({
      kind: "external";
      src: string;
    } & ScriptLoading & {
        id: ScriptAssetId;
        location: "header" | "footer";
      })
  | {
      kind: "inline";
      content: string;
      id: ScriptAssetId;
      location: "header" | "footer";
    };

export type SvgAssetConfig = {
  id: SvgAssetId;
  viewBox: string;
  content: string;
};

export type AssetsConfig = {
  scripts: readonly ScriptAssetConfig[];
  svgs: readonly SvgAssetConfig[];
};
