// src/rendering/shared/link.shared.template.tsx

import type { ReactNode } from "react";

import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";

type LinkTemplateProps = Readonly<{
  link: AppRenderContextLink;
  ariaCurrent?: "page" | null;
  ariaLabel?: string | null;
  className?: string | null;
  children?: ReactNode;
}>;

export const LinkTemplate = ({
  link,
  ariaCurrent = null,
  ariaLabel = null,
  className = null,
  children,
}: LinkTemplateProps) => (
  <a
    className={className ?? undefined}
    href={link.href}
    target={link.openInNewTab ? "_blank" : undefined}
    rel={link.openInNewTab ? "noopener noreferrer" : undefined}
    aria-current={ariaCurrent ?? undefined}
    aria-label={ariaLabel ?? undefined}
  >
    {children ?? link.text}
  </a>
);
