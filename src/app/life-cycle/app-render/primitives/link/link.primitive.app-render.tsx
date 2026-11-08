// src/app/life-cycle/app-render/primitives/link/link.primitive.app-render.tsx

import type { LinkVariant } from "../../../../../content-schema/primitives/link.primitive.content-schema.authored.type";
import type { LinkAppRenderContext } from "../../../../types/primitives/link/link.primitive.app-render-context.type";

import { Svg } from "../svg/svg.primitive.app-render";

type Props = Readonly<{
  link: LinkAppRenderContext;
  className?: string;
  iconClassName?: string;
}>;

const linkVariantRegistry = {
  editorial: ["c-editorial-link"],
  "editorial-subtle": ["c-editorial-link", "c-editorial-link--subtle"],
} as const satisfies Record<NonNullable<LinkVariant>, readonly string[]>;

export const Link = ({ link, className, iconClassName }: Props) => {
  const variantClasses = link.variant ? linkVariantRegistry[link.variant] : [];

  const isEditorial = link.variant !== null;

  const classes = [...variantClasses, className].filter(Boolean).join(" ");

  return (
    <a
      className={classes || undefined}
      href={link.href}
      aria-label={link.ariaLabel ?? undefined}
      title={link.title ?? undefined}
      target={link.target ?? undefined}
      rel={link.rel?.join(" ")}
    >
      {isEditorial ? (
        <>
          <span className="c-editorial-link__label">{link.label}</span>
          <span className="c-editorial-link__arrow" aria-hidden="true">
            →
          </span>
        </>
      ) : link.icon ? (
        <Svg svg={link.icon} className={iconClassName} />
      ) : (
        link.label
      )}
    </a>
  );
};
