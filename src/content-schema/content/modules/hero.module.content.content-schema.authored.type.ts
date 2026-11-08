// src/content-schema/content/modules/hero.module.content.content-schema.authored.type.ts

import type { SvgReferenceAuthored } from "../../assets/svg.asset.content-schema.authored.type";
import type { FetchPriority } from "../../primitives/images.asset.content-schema.type";

export type HeroModuleContentSchemaAuthored = Readonly<{
  kind: "hero";
  eyebrow: string;
  title: readonly string[];
  description: string;

  media: Readonly<{
    src: string;
    width: number;
    height: number;
    alt: string;
    fetchPriority: FetchPriority;
    sources: readonly Readonly<{
      src: string;
      media: string;
      width: number;
      height: number;
    }>[];
  }>;

  location: Readonly<{
    label: string;
    icon: SvgReferenceAuthored;
  }> | null;
}>;
