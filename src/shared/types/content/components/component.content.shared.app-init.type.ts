// src/shared/types/content/components/component.content.shared.app-init.type.ts

import type { ParagraphComponentContentAppInit } from "./paragraph.component.content.shared.app-init.type";
import type { ListComponentContentAppInit } from "./list.component.content.shared.app-init.type";
import type { PhotoComponentContentAppInit } from "./photo.component.content.shared.app-init.type";
import type { EditorialPhotoComponentContentAppInit } from "./editorial-photo.component.content.shared.app-init.type";
import type { RichListComponentContentAppInit } from "./rich-list.component.content.shared.app-init.type";

export type ComponentContentAppInit =
  | ParagraphComponentContentAppInit
  | ListComponentContentAppInit
  | PhotoComponentContentAppInit
  | EditorialPhotoComponentContentAppInit
  | RichListComponentContentAppInit;
