// src/rendering/shared/heading.shared.template.tsx

import type { HeadingLevel } from "@shared-types/page-content/site/content-head/shared.content-head.types";

export type RenderableHeading = Readonly<{
  text: string;
  level: HeadingLevel;
  visuallyHidden?: boolean;
}>;

type HeadingTag = `h${HeadingLevel}`;

type HeadingTemplateProps = Readonly<{
  heading: RenderableHeading;
  className?: string;
}>;

export const HeadingTemplate = ({
  heading,
  className,
}: HeadingTemplateProps) => {
  const Tag = `h${heading.level}` as HeadingTag;

  const classNames = [className, heading.visuallyHidden ? "u-sr-only" : null]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classNames || undefined}>{heading.text}</Tag>;
};
