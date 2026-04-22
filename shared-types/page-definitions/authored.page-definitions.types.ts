// shared-types/page-definitions/authored.page-definitions.types.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/page-definitions/authored.error.page-definition.types";
import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

export type AuthoredPageDefinition =
  | AuthoredPublicPageDefinition
  | AuthoredErrorPageDefinition;
