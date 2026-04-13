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

type EmphasisContentInlineAuthored = {
  kind: "emphasis";
  content: ContentInlineAuthored[];
};

type StrongContentInlineAuthored = {
  kind: "strong";
  content: ContentInlineAuthored[];
};

type CodeContentInlineAuthored = {
  kind: "code";
  value: string;
};

type LineBreakContentInlineAuthored = {
  kind: "lineBreak";
};

export type ContentInlineAuthored =
  | TextContentInlineAuthored
  | InternalLinkContentInlineAuthored
  | ExternalLinkContentInlineAuthored
  | EmphasisContentInlineAuthored
  | StrongContentInlineAuthored
  | CodeContentInlineAuthored
  | LineBreakContentInlineAuthored;
