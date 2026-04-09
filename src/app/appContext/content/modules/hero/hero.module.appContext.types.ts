// src/app/appContext/content/modules/hero/hero.module.appContext.types.ts

export type AppContextHeroMetaKey = "location";

export type AppContextHeroMetaItem = {
  key: AppContextHeroMetaKey;
  label: string;
  value: string;
  description?: string;
};

export type AppContextHeroSettingKey =
  | "shutterSpeed"
  | "aperture"
  | "focalLength"
  | "iso";

export type AppContextHeroSettingItem = {
  key: AppContextHeroSettingKey;
  label: string;
  shortValue: string;
  description?: string;
};

export type AppContextHeroModule = {
  kind: "hero";
  immersive: boolean;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  caption: string;
  meta: readonly AppContextHeroMetaItem[];
  settings: readonly AppContextHeroSettingItem[];
};
