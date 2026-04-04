// src/app/pages/content/inline.content.page.types.ts

import type { PageId } from "@app/pages/page.definition";

export type PageContentTextInline = {
  kind: "text";
  text: string;
};

export type PageContentInternalLinkInline = {
  kind: "internal-link";
  pageId: PageId;
  label: string;
};

export type PageContentExternalLinkInline = {
  kind: "external-link";
  href: string;
  label: string;
};

export type PageContentLinkInline =
  | PageContentInternalLinkInline
  | PageContentExternalLinkInline;

export type PageContentInline = PageContentTextInline | PageContentLinkInline;
