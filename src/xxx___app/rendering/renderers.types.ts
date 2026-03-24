// src/app/renderers/renderers.types.ts

export type RenderSvgOptions = {
  className?: string;
  ariaHidden?: boolean;
  ariaLabel?: string;
  focusable?: "true" | "false";
};

export type SvgDimensions = {
  width: number;
  height: number;
};

export type ResolvedSvgDimensions = {
  width: string;
  height: string;
} | null;
