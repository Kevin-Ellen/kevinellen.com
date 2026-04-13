// shared-types/links/shared.links.types.ts

export type LinkOpenBehaviour = Readonly<{
  openInNewTab: boolean;
}>;

export type LinkKind = "internal" | "external" | "social";
