import type { AppRenderContextPhoto } from "@shared-types/media/photo/app-render-context.photo.types";

export type AppRenderContextRenderImage = Pick<
  AppRenderContextPhoto,
  "src" | "srcset" | "sizes" | "alt" | "width" | "height" | "ratio"
>;
