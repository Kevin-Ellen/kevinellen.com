// shared-types/media/render-image/app-render-context.render-image.types.ts

export type AppRenderContextRenderImage = Readonly<{
  src: string;
  srcset: readonly string[];
  sizes: string;
  alt: string;
  width: number;
  height: number;
  ratio: Readonly<{
    width: number;
    height: number;
  }>;
}>;
