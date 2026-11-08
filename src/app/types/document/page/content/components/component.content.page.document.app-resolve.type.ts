// src/app/types/document/page/content/components/component.content.page.document.app-resolve.type.ts

import type { ParagraphComponentContentAppResolve } from "./paragraph/paragraph.component.content.page.document.app-resolve.type";
import type { ListComponentContentAppResolve } from "./list/list.component.content.page.document.app-resolve.type";
import type { PhotoComponentContentAppResolve } from "./photo/photo.component.content.page.document.app-resolve.type";
import type { EditorialPhotoComponentContentAppResolve } from "./editorial-photo/editorial-photo.component.content.page.document.app-resolve.type";
import type { RichListComponentContentAppResolve } from "./rich-list/rich-list.component.content.page.document.app-resolve.type";

export type ComponentContentAppResolve =
  | ParagraphComponentContentAppResolve
  | ListComponentContentAppResolve
  | PhotoComponentContentAppResolve
  | EditorialPhotoComponentContentAppResolve
  | RichListComponentContentAppResolve;
