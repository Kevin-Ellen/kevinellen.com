// shared-types/pages/definitions/authored.base.public.definition.page.types.ts

import type { BasePageDefinition } from "@shared-types/pages/definitions/base.definition.page.types";
import type { PublicPageKind } from "@shared-types/pages/public/kind.public.page.types";
import type { AuthoredAssets } from "@shared-types/pages/shared/assets/authored.assets.shared.page.types";
import type { AuthoredPageRobotsDirectives } from "@shared-types/pages/shared/authored.robots.shared.page.types";
import type { PageIdPublic } from "@shared-types/pages/shared/id.shared.page.types";
import { AuthoredStructuredDataEntry } from "@shared-types/structured-data/authored.structured-data.types";

export type AuthoredBasePublicPageDefinition = Omit<
  BasePageDefinition,
  "id"
> & {
  id: PageIdPublic;
  kind: PublicPageKind;
  slug: `/${string}` | "/";
  label: string;
  robots?: AuthoredPageRobotsDirectives;
  assets?: AuthoredAssets;
  breadcrumbs?: readonly PageIdPublic[];
  structuredData?: readonly AuthoredStructuredDataEntry[];
};
