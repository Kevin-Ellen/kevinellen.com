// shared-types/page-content/block/sequence/app-render-context.sequence.block.types.ts

import type { AppContextSequenceBlock } from "@shared-types/page-content/block/sequence/app-context.sequence.block.types";
import type { AppRenderContextPhoto } from "@shared-types/media/photo/app-render-context.photo.types";
import type { AppRenderContextInline } from "@shared-types/page-content/inline/app-render-context.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextSequencePhoto = Readonly<{
  position: number;
  photo: AppRenderContextPhoto;
}>;

type ReplacementFields = Readonly<{
  photos: readonly AppRenderContextSequencePhoto[];
  caption: readonly AppRenderContextInline[];
}>;

export type AppRenderContextSequenceBlock = Replace<
  AppContextSequenceBlock,
  ReplacementFields
>;
