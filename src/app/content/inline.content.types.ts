// src/app/content/inline.content.page.types.ts

import type { PageId } from "@app/pages/page.definition";

export type ContentTextInline = {
  kind: "text";
  text: string;
};

export type ContentInternalLinkInline = {
  kind: "internal-link";
  pageId: PageId;
  label: string;
  href: string;
};

export type ContentExternalLinkInline = {
  kind: "external-link";
  label: string;
  href: string;
};

export type ContentLinkInline =
  | ContentInternalLinkInline
  | ContentExternalLinkInline;

export type ContentInline = ContentTextInline | ContentLinkInline;
