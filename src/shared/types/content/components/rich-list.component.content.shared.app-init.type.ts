// src/shared/types/content/components/rich-list.component.content.shared.app-init.type.ts

import type { RichListComponentContentAuthored } from "../../../../content-schema/content/components/rich-list.component.content.content-schema.authored.type";
import type { SvgReferenceAppInit } from "../../assets/svg.asset.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type RichListComponentContentAppInit = OmitAndReplace<
  RichListComponentContentAuthored,
  {
    items: readonly Readonly<{
      icon: SvgReferenceAppInit;
      label: string;
      values: readonly string[];
    }>[];
  }
>;
