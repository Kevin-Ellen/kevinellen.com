// shared-types/pages/definitions/public/legal/terms/app-state.terms.legal.public.definition.page.types.ts

import type { AuthoredTermsLegalPublicPage } from "@shared-types/pages/definitions/public/legal/terms/authored.terms.legal.public.definition.page.types";
import type { AppStatePublicBasePageDefinitionDeterministicFields } from "@shared-types/pages/definitions/public/base/app-state.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppStateTermsLegalPublicPage = Replace<
  AuthoredTermsLegalPublicPage,
  AppStatePublicBasePageDefinitionDeterministicFields
>;
