// src/rendering/body-content/inline/link/link.inline.template.tsx

import type { AppRenderContextLinkInline } from "@shared-types/page-content/inline/link/app-render-context.link.inline-content.types";

import { LinkTemplate } from "@rendering/shared/link.shared.template";

type LinkInlineTemplateProps = Readonly<{
  item: AppRenderContextLinkInline;
}>;

export const LinkInlineTemplate = ({ item }: LinkInlineTemplateProps) => (
  <LinkTemplate link={item.link} />
);
