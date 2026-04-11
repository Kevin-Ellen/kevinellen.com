// src/app/appContext/content/modules/hero/hero.module.appContext.types.ts

import { AppContextPhoto } from "@app/appContext/appContext.types";

export type AppContextHeroMetaKey = "location";

export type AppContextContentFlow = "content" | "breakout";

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
  flow: AppContextContentFlow;
  photo: AppContextPhoto;
  caption: string;
  meta: readonly AppContextHeroMetaItem[];
  settings: readonly AppContextHeroSettingItem[];
};
