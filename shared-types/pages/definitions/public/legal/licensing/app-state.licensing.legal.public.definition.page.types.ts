// shared-types/pages/definitions/public/legal/licensing/app-state.licensing.legal.public.definition.page.types.ts

import type { AuthoredLicensingLegalPublicPage } from "@shared-types/pages/definitions/public/legal/licensing/authored.licensing.legal.public.definition.page.types";
import type { AppStatePublicBasePageDefinitionDeterministicFields } from "@shared-types/pages/definitions/public/base/app-state.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppStateLicensingLegalPublicPage = Replace<
  AuthoredLicensingLegalPublicPage,
  AppStatePublicBasePageDefinitionDeterministicFields
>;
