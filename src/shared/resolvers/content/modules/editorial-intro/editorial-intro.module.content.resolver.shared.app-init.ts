// src/shared/resolvers/content/modules/editorial-intro/editorial-intro.module.content.resolver.shared.app-init.ts

import type { EditorialIntroModuleContentAuthored } from "../../../../../content-schema/content/modules/editorial-intro.module.content.content-schema.authored.type";
import type { EditorialIntroModuleContentAppInit } from "../../../../types/content/modules/editorial-intro.module.content.shared.app-init.type";

type Input = Readonly<{
  authored: EditorialIntroModuleContentAuthored;
}>;

export const resolveEditorialIntroModuleContentAppInit = ({
  authored,
}: Input): EditorialIntroModuleContentAppInit => ({
  ...authored,
  location: authored.location ?? null,
  portrait: authored.portrait ?? null,
});
