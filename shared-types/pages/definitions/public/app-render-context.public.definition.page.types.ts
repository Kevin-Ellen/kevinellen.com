// shared-types/pages/definitions/public/app-render-context.public.definition.page.types.ts

// Home
import type { AppRenderContextHomePublicPage } from "@shared-types/pages/definitions/public/home/app-render-context.home.public.definition.page.types";

// Legal
import type { AppRenderContextTermsLegalPublicPage } from "@shared-types/pages/definitions/public/legal/terms/app-render-context.terms.legal.public.definition.page.types";
import type { AppRenderContextPrivacyLegalPublicPage } from "@shared-types/pages/definitions/public/legal/privacy/app-render-context.privacy.legal.public.definition.page.types";
import type { AppRenderContextLicensingLegalPublicPage } from "@shared-types/pages/definitions/public/legal/licensing/app-render-context.licensing.legal.public.definition.page.types";

// About
import type { AppRenderContextAboutPublicPage } from "@shared-types/pages/definitions/public/about/app-render-context.about.public.definition.page.types";
import type { AppRenderContextTechnologyAboutPublicPage } from "@shared-types/pages/definitions/public/about/technology/app-render-context.technology.about.public.definition.page.types";
import type { AppRenderContextEquipmentAboutPublicPage } from "@shared-types/pages/definitions/public/about/equipment/app-render-context.equipment.about.public.definition.page.types";

export type AppRenderContextPublicPageDefinition =
  | AppRenderContextHomePublicPage
  | AppRenderContextTermsLegalPublicPage
  | AppRenderContextPrivacyLegalPublicPage
  | AppRenderContextLicensingLegalPublicPage
  | AppRenderContextAboutPublicPage
  | AppRenderContextTechnologyAboutPublicPage
  | AppRenderContextEquipmentAboutPublicPage;
