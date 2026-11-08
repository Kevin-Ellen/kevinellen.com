// src/content-schema/assets/svg.asset.content-schema.authored.type.ts

export type SvgAssetAuthored = Readonly<{
  id: string;
  viewBox: string;
  content: string;
}>;

export type SvgReferenceAuthored = Readonly<{
  id: string;
}>;
