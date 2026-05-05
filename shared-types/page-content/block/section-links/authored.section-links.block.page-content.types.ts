// shared-types/page-content/block/section-links/authored.section-links.block.page-content.types.ts

import type { AuthoredBaseBlockContentModule } from "@shared-types/page-content/block/base/authored.base.block.page-content.types";
import type { AuthoredInternalLink } from "@shared-types/links/authored.links.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import type { AuthoredArticleSectionHeadingBlockContentModule } from "../article-section/authored.article-section.block.page-content.types";

export type AuthoredSectionLinksSection = Readonly<{
  heading: AuthoredArticleSectionHeadingBlockContentModule;
  link: AuthoredInternalLink;
  icon: SvgAssetId;
  intro: string | null;
}>;

export type AuthoredSectionLinksBlockContentModule =
  AuthoredBaseBlockContentModule<
    "sectionLinks",
    {
      sections: readonly AuthoredSectionLinksSection[];
    }
  >;
