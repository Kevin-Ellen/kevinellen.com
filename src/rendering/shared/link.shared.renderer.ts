// src/rendering/shared/link.shared.renderer.ts

import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

export const renderLinkAttributes = (
  link: AppRenderContextLink & {
    ariaCurrent?: "page" | null;
    ariaLabel?: string | null;
    className?: string | null;
  },
): string => {
  const attributes = [
    link.className ? `class="${escapeAttribute(link.className)}"` : "",
    `href="${escapeAttribute(link.href)}"`,
    link.openInNewTab ? `target="_blank"` : "",
    link.openInNewTab ? `rel="noopener noreferrer"` : "",
    link.ariaCurrent
      ? `aria-current="${escapeAttribute(link.ariaCurrent)}"`
      : "",
    link.ariaLabel ? `aria-label="${escapeAttribute(link.ariaLabel)}"` : "",
  ];

  return attributes.filter(Boolean).join(" ");
};

export const renderTextLink = (
  link: AppRenderContextLink & {
    ariaCurrent?: "page" | null;
    className?: string | null;
  },
): string => `<a ${renderLinkAttributes(link)}>${escapeHtml(link.text)}</a>`;
