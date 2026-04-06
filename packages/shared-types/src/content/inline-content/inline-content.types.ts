// packages/shared-types/src/content/inline-content/inline-content.types.ts

type TextContentInlineAuthored = { kind: "text"; value: string };

type InternalLinkContentInlineAuthored = {
  kind: "internalLink";
  pageId: string;
  text: string;
};
type ExternalLinkContentInlineAuthored = {
  kind: "externalLink";
  href: string;
  text: string;
};

export type ContentInlineAuthored =
  | TextContentInlineAuthored
  | InternalLinkContentInlineAuthored
  | ExternalLinkContentInlineAuthored;
