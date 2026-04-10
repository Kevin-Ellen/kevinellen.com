// src/app/rendering/content/inline-content/inline-content.render.ts

import type { ContentInlineResolved } from "@app/renderContext/content/inline-content/inline-content.types";

import {
  escapeAttribute,
  escapeHtmlContent,
} from "@app/rendering/utils/escapeContent.util";

export const renderInlineContent = (
  content: readonly ContentInlineResolved[],
): string => {
  return content
    .map((item) => {
      switch (item.kind) {
        case "text":
          return escapeHtmlContent(item.value);

        case "link": {
          const target = item.isExternal ? ' target="_blank"' : "";
          const rel = item.isExternal ? ' rel="noopener noreferrer"' : "";

          return `<a href="${escapeAttribute(item.href)}"${target}${rel}>${escapeHtmlContent(item.text)}</a>`;
        }

        case "emphasis":
          return `<em>${renderInlineContent(item.content)}</em>`;

        case "strong":
          return `<strong>${renderInlineContent(item.content)}</strong>`;

        case "code":
          return `<code>${escapeHtmlContent(item.value)}</code>`;

        case "lineBreak":
          return "<br>";
      }
    })
    .join("");
};
