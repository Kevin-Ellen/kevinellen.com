// shared-types/pages/definitions/public/legal/terms/app-context.terms.legal.public.definition.page.types.ts

import type { AuthoredTermsLegalPublicPage } from "@shared-types/pages/definitions/public/legal/terms/authored.terms.legal.public.definition.page.types";
import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextTermsLegalPublicPage = Replace<
  AuthoredTermsLegalPublicPage,
  AppContextPublicBasePageDefinition
>;
