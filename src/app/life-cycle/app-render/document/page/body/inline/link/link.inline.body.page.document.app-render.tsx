// src/app/life-cycle/app-render/document/page/body/inline/link/link.inline.body.page.document.app-render.tsx

import type { LinkInlineContentAppRenderContext } from "../../../../../../../types/document/page/content/inline/link/link.inline.content.page.document.app-render-context.type";

import { Link } from "../../../../../primitives/link/link.primitive.app-render";

type Props = Readonly<{
  content: LinkInlineContentAppRenderContext;
}>;

export const LinkInline = ({ content }: Props) => <Link link={content.link} />;
