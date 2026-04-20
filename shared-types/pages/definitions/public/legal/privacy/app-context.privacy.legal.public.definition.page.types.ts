// shared-types/pages/definitions/public/legal/privacy/app-context.privacy.legal.public.definition.page.types.ts

import type { AuthoredPrivacyLegalPublicPage } from "@shared-types/pages/definitions/public/legal/privacy/authored.privacy.legal.public.definition.page.types";
import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextPrivacyLegalPublicPage = Replace<
  AuthoredPrivacyLegalPublicPage,
  AppContextPublicBasePageDefinition
>;
