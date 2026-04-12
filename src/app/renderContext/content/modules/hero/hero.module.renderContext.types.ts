// src/app/renderContext/content/modules/hero/hero.module.renderContext.types.ts

import type { RenderContextContentFlow } from "@app/renderContext/content/content.renderContext.types";
import type { RenderContextResponsiveImage } from "@app/renderContext/content/modules/shared-types/images.modules.renderContext.types";

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
  flow: RenderContextContentFlow;
  immersive: boolean;
  image: RenderContextResponsiveImage;
  caption: string;
  meta: readonly RenderContextHeroMetaItem[];
  settings: readonly RenderContextHeroSettingItem[];
};
