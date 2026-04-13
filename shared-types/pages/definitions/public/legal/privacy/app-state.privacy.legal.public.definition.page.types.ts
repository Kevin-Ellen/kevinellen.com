// shared-types/pages/definitions/public/legal/privacy/app-state.privacy.legal.public.definition.page.types.ts

import type { AuthoredPrivacyLegalPublicPage } from "@shared-types/pages/definitions/public/legal/privacy/authored.privacy.legal.public.definition.page.types";
import type { AppStatePublicBasePageDefinitionDeterministicFields } from "@shared-types/pages/definitions/public/base/app-state.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppStatePrivacyLegalPublicPage = Replace<
  AuthoredPrivacyLegalPublicPage,
  AppStatePublicBasePageDefinitionDeterministicFields
>;
