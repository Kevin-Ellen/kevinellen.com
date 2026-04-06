// src/app/renderContext/content/inline-content/inline-content.types.ts

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

export type ContentInlineResolved =
  | TextContentInlineResolved
  | LinkContentInlineResolved;
