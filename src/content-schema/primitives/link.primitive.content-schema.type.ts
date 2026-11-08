// src/content-schema/primitives/link.primitive.content-schema.type.ts

export type LinkTarget = "_self" | "_blank" | "_parent" | "_top";

export type LinkRel =
  | "noopener"
  | "noreferrer"
  | "nofollow"
  | "external"
  | "ugc"
  | "sponsored"
  | "author"
  | "me"
  | "license";
