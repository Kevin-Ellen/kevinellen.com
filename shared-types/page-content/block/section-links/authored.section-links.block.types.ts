// shared-types/page-content/block/section-links/authored.section-links.block.types.ts

import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";
import type { AuthoredInternalLink } from "@shared-types/links/authored.links.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import type { AuthoredArticleSectionHeadingBlock } from "@shared-types/page-content/block/article-section/authored.article-section.block.types";

type SectionLinksSection = Readonly<{
  heading: AuthoredArticleSectionHeadingBlock;
  link: AuthoredInternalLink;
  icon: SvgAssetId;
  intro: string | null;
}>;

export type AuthoredSectionLinksBlock = AuthoredBaseBlock<
  "sectionLinks",
  {
    sections: readonly SectionLinksSection[];
  }
>;
