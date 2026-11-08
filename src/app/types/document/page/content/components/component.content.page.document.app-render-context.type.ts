// src/app/types/document/page/content/components/component.content.page.document.app-render-context.type.ts

import type { ParagraphComponentContentAppRenderContext } from "./paragraph/paragraph.component.content.page.document.app-render-context.type";
import type { ListComponentContentAppRenderContext } from "./list/list.component.content.page.document.app-render-context.type";
import type { PhotoComponentContentAppRenderContext } from "./photo/photo.component.content.page.document.app-render-context.type";
import type { EditorialPhotoComponentContentAppRenderContext } from "./editorial-photo/editorial-photo.component.content.page.document.app-render-context.type";
import type { RichListComponentContentAppRenderContext } from "./rich-list/rich-list.component.content.page.document.app-render-context.type";

export type ComponentContentAppRenderContext =
  | ParagraphComponentContentAppRenderContext
  | ListComponentContentAppRenderContext
  | PhotoComponentContentAppRenderContext
  | EditorialPhotoComponentContentAppRenderContext
  | RichListComponentContentAppRenderContext;
