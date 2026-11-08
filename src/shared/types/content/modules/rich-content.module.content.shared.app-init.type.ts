// src/shared/types/content/modules/rich-content.module.content.shared.app-init.type.ts

import type { RichContentModuleContentAuthored } from "../../../../content-schema/content/modules/rich-content.module.content.content-schema.authored.type";
import type { ComponentContentAppInit } from "../components/component.content.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type RichContentModuleContentAppInit = OmitAndReplace<
  RichContentModuleContentAuthored,
  Readonly<{
    components: readonly ComponentContentAppInit[];
  }>
>;
