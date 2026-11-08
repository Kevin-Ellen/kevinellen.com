// src/content-schema/primitives/link.primitive.content-schema.authored.type.ts

import type { LinkTarget, LinkRel } from "./link.primitive.content-schema.type";

export type LinkIconAuthored = Readonly<{
  id: string;
}>;

export type LinkVariant = "editorial" | "editorial-subtle";

export type LinkCommonAuthored = Readonly<{
  label?: string;
  ariaLabel?: string;
  title?: string;
  variant?: LinkVariant;
  icon?: LinkIconAuthored;
  target?: LinkTarget;
  rel?: readonly LinkRel[];
}>;

export type InternalLinkAuthored = LinkCommonAuthored &
  Readonly<{
    kind: "internal";
    pageId: string;
  }>;

export type SocialLinkAuthored = LinkCommonAuthored &
  Readonly<{
    kind: "social";
    profile: string;
  }>;

export type ExternalLinkAuthored = LinkCommonAuthored &
  Readonly<{
    kind: "external";
    href: string;
  }>;

export type LinkAuthored =
  | InternalLinkAuthored
  | SocialLinkAuthored
  | ExternalLinkAuthored;
