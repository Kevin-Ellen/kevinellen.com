// src/shared/types/content/body/body.content.shared.app-init.type.ts

import type { ContentBodyAuthored } from "../../../../content-schema/content/body/body.content.content-schema.authored.type";
import type { ContentBodyFooterAppInit } from "./footer.content.shared.body.app-init.type";
import type { ModuleContentAppInit } from "../modules/module.content.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type ContentBodyAppInit = OmitAndReplace<
  ContentBodyAuthored,
  {
    modules: readonly ModuleContentAppInit[];
    footer: ContentBodyFooterAppInit;
  }
>;
