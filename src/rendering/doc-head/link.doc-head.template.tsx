// src/rendering/doc-head/link.doc-head.template.tsx

import type { AppRenderContextDocOpen } from "@app-render-context/types/doc-open.app-render-context.types";
import type { AppRenderContextPreloadAsset } from "@shared-types/config/site-config/app-render-context.preload.config.types";

type AppRenderContextHeadLink = AppRenderContextDocOpen["links"][number];

type CanonicalLinkProps = Readonly<{
  href: string;
}>;

type HeadLinkProps = Readonly<{
  link: AppRenderContextHeadLink;
}>;

type PreloadLinkProps = Readonly<{
  preload: AppRenderContextPreloadAsset;
}>;

export const HeadLink = ({ link }: HeadLinkProps) => (
  <link
    rel={link.rel}
    href={link.href}
    type={"type" in link ? link.type : undefined}
    sizes={"sizes" in link ? link.sizes : undefined}
  />
);

export const PreloadLink = ({ preload }: PreloadLinkProps) => (
  <link
    rel={preload.rel}
    href={preload.href}
    as={preload.as}
    type={preload.type ?? undefined}
    crossOrigin={preload.crossorigin ?? undefined}
  />
);

export const CanonicalLink = ({ href }: CanonicalLinkProps) => (
  <link rel="canonical" href={href} />
);
