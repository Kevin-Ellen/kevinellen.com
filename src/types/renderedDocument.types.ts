// src/types/renderedDocument.types.ts

export type RenderedInlineAsset = {
  kind: "style" | "script";
  content: string;
};

export type RenderedFragment = {
  html: string;
  inlineAssets: RenderedInlineAsset[];
};

export type RenderedDocument = {
  html: string;
  inlineAssets: RenderedInlineAsset[];
};
