// src/content-schema/content/body/body.content.content-schema.authored.type.ts

import type { ModuleContentAuthored } from "../modules/module.content.content-schema.authored.type";
import type { ContentBodyFooterAuthored } from "./footer.body.content-schema.authored.type";

export type ContentBodyAuthored = Readonly<{
  modules: readonly ModuleContentAuthored[];
  footer?: ContentBodyFooterAuthored;
}>;
