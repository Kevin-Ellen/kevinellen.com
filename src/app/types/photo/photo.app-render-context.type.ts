// src/app/types/photo/photo.app-render-context.type.ts

import type { PhotoAppResolve } from "./photo.app-resolve.type";
import type { OmitAndReplace } from "../../../shared/types/utilities/omit-replace.utility.shared.type";

export type PhotoAppRenderContext = OmitAndReplace<
  Pick<
    PhotoAppResolve,
    "id" | "title" | "alt" | "commentary" | "width" | "height"
  >,
  Readonly<{
    commentary: string | null;
    location: PhotoAppResolve["readableLocation"];
    species: NonNullable<PhotoAppResolve["species"]>;

    image: Readonly<{
      id: string;
      src: string;
      srcSet: string;
      viewerSrc: string;
    }>;

    metadata: Readonly<{
      shutter: string;
      aperture: string;
      focalLength: string;
      iso: string;
    }>;
  }>
>;
