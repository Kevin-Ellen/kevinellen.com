// src/app/renderContext/content/modules/hero/hero.module.renderContext.types.ts

export type RenderContextHeroMetaKey = "location";

export type RenderContextHeroMetaItem = {
  key: RenderContextHeroMetaKey;
  label: string;
  value: string;
  description?: string;
};

export type RenderContextHeroSettingKey =
  | "shutterSpeed"
  | "aperture"
  | "focalLength"
  | "iso";

export type RenderContextHeroSettingItem = {
  key: RenderContextHeroSettingKey;
  label: string;
  shortValue: string;
  description?: string;
};

export type RenderContextHeroModule = {
  kind: "hero";
  immersive: boolean;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  caption: string;
  meta: readonly RenderContextHeroMetaItem[];
  settings: readonly RenderContextHeroSettingItem[];
};
