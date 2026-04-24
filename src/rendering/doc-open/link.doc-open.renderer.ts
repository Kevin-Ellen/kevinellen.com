// src/rendering/doc-open/link.doc-open.renderer.ts

import { escapeAttribute } from "@rendering/utils/html.escape.util.renderer";

export const renderHeadLink = (link: {
  rel: string;
  href: string;
  type?: string | null;
  sizes?: string | null;
}): string => {
  const attributes = [
    `rel="${escapeAttribute(link.rel)}"`,
    `href="${escapeAttribute(link.href)}"`,
    link.type ? `type="${escapeAttribute(link.type)}"` : "",
    link.sizes ? `sizes="${escapeAttribute(link.sizes)}"` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `<link ${attributes}>`;
};

export const renderPreloadLink = (preload: {
  rel: string;
  href: string;
  as: string;
  type?: string | null;
  crossorigin?: string | null;
}): string => {
  const attributes = [
    `rel="${escapeAttribute(preload.rel)}"`,
    `href="${escapeAttribute(preload.href)}"`,
    `as="${escapeAttribute(preload.as)}"`,
    preload.type ? `type="${escapeAttribute(preload.type)}"` : "",
    preload.crossorigin
      ? `crossorigin="${escapeAttribute(preload.crossorigin)}"`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `<link ${attributes}>`;
};

export const renderCanonicalLink = (href: string): string =>
  `<link rel="canonical" href="${escapeAttribute(href)}">`;
