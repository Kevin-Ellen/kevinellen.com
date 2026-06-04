// shared-types/page-content/block/sequence/app-context.sequence.block.types.ts

import type { AppStateSequenceBlock } from "@shared-types/page-content/block/sequence/app-state.sequence.block.types";
import type { AppContextResolvedPhoto } from "@shared-types/media/render-image/app-context.render-image.types";
import type { AppContextInline } from "@shared-types/page-content/inline/app-context.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextSequencePhoto = Readonly<{
  position: number;
  photo: AppContextResolvedPhoto;
}>;

type ResolvedFields = Readonly<{
  photos: readonly AppContextSequencePhoto[];
  caption: readonly AppContextInline[];
}>;

export type AppContextSequenceBlock = Replace<
  AppStateSequenceBlock,
  ResolvedFields
>;
