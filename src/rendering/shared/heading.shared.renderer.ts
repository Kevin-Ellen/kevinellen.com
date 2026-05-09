// src/rendering/shared/heading.shared.renderer.ts

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

export type RenderableHeading = Readonly<{
  text: string;
  level: 2 | 3 | 4 | 5 | 6;
  visuallyHidden?: boolean;
}>;

type RenderHeadingOptions = Readonly<{
  className?: string;
}>;

export const renderHeading = (
  heading: RenderableHeading,
  options: RenderHeadingOptions = {},
): string => {
  const tag = `h${heading.level}`;

  const classNames = [
    options.className,
    heading.visuallyHidden === true ? "u-sr-only" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const classAttribute = classNames
    ? ` class="${escapeAttribute(classNames)}"`
    : "";

  return `<${tag}${classAttribute}>${escapeHtml(heading.text)}</${tag}>`;
};
