// src/shared/types/content/modules/hero.module.content.shared.app-init.type.ts

import type { HeroModuleContentSchemaAuthored } from "../../../../content-schema/content/modules/hero.module.content.content-schema.authored.type";
import type { SvgReferenceAppInit } from "../../assets/svg.asset.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type HeroModuleContentSharedAppInit = OmitAndReplace<
  HeroModuleContentSchemaAuthored,
  {
    location: Readonly<{
      label: string;
      icon: SvgReferenceAppInit;
    }> | null;
  }
>;
