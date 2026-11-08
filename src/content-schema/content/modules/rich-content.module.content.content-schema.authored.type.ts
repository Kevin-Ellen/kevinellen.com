// src/content-schema/content/modules/rich-content.module.content.content-schema.authored.type.ts

import type { ComponentContentAuthored } from "../components/component.content.content-schema.authored.type";

export type RichContentModuleContentAuthored = Readonly<{
  kind: "richContent";
  components: readonly ComponentContentAuthored[];
}>;
