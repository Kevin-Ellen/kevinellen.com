// src/shared/resolvers/content/modules/page-intro/page-intro.module.content.resolver.shared.app-init.ts

import type { PageIntroModuleContentAuthored } from "../../../../../content-schema/content/modules/page-intro.module.content.content-schema.authored.type";
import type { PageIntroModuleContentAppInit } from "../../../../types/content/modules/page-intro.module.content.shared.app-init.type";
import type { ContentDatesAppInit } from "../../../../types/content/content.shared.app-init.type";

type Input = Readonly<{
  authored: PageIntroModuleContentAuthored;
  dates: ContentDatesAppInit;
}>;

export const resolvePageIntroModuleContentAppInit = ({
  authored,
  dates,
}: Input): PageIntroModuleContentAppInit => ({
  ...authored,
  eyebrow: authored.eyebrow ?? null,
  description: authored.description ?? null,
  location: authored.location ?? null,
  date: dates.created,
});
