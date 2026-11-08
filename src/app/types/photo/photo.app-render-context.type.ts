// src/app/types/photo/photo.app-render-context.type.ts

export type PhotoAppRenderContext = Readonly<{
  id: string;
  title: string;
  alt: string;
  commentary: string | null;
  location: string | null;

  width: number;
  height: number;

  image: Readonly<{
    id: string;
    src: string;
    srcSet: string;
  }>;

  metadata: Readonly<{
    shutter: string;
    aperture: string;
    focalLength: string;
    iso: string;
  }>;
}>;
