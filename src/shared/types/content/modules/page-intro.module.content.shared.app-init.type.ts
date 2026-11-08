// src/shared/types/content/modules/page-intro.module.content.shared.app-init.type.ts

import type { PageIntroModuleContentAuthored } from "../../../../content-schema/content/modules/page-intro.module.content.content-schema.authored.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type PageIntroModuleContentAppInit = OmitAndReplace<
  PageIntroModuleContentAuthored,
  Readonly<{
    eyebrow: string | null;
    description: string | null;
    location: string | null;
    date: string;
  }>
>;
