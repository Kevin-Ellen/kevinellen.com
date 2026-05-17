// shared-types/page-content/block/image-strip/app-state.image-strip.block.types.ts

import type {
  AuthoredImageStripBlock,
  ImageStripStrategy,
} from "@shared-types/page-content/block/image-strip/authored.image-strip.block.types";
import type { AppStateArticleSectionHeadingBlock } from "@shared-types/page-content/block/article-section/app-state.article-section.block.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  heading: AppStateArticleSectionHeadingBlock;
  strategy: ImageStripStrategy;
  itemCount: number;
  excludePagePhotos: boolean;
}>;

export type AppStateImageStripBlock = Replace<
  AuthoredImageStripBlock,
  DeterministicFields
>;
