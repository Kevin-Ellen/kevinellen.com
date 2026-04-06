// src/app/appContext/content/inline-content/inline-content.types.ts

type TextContentInlineResolved = {
  kind: "text";
  value: string;
};

type LinkContentInlineResolved = {
  kind: "link";
  text: string;
  href: string;
  isExternal: boolean;
};

type EmphasisContentInlineResolved = {
  kind: "emphasis";
  content: readonly ContentInlineResolved[];
};

type StrongContentInlineResolved = {
  kind: "strong";
  content: readonly ContentInlineResolved[];
};

type CodeContentInlineResolved = {
  kind: "code";
  value: string;
};

type LineBreakContentInlineResolved = {
  kind: "lineBreak";
};

export type ContentInlineResolved =
  | TextContentInlineResolved
  | LinkContentInlineResolved
  | EmphasisContentInlineResolved
  | StrongContentInlineResolved
  | CodeContentInlineResolved
  | LineBreakContentInlineResolved;
