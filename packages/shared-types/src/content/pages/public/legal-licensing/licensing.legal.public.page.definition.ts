// packages/shared-types/src/content/pages/public/legal-licensing/licensing.legal.public.page.definition.ts

import type {
  BasePublicPageDefinitionCore,
  PublicPageDefinition,
} from "@shared-types/content/pages/public/base.public.page.definition";
import type { LicensingLegalPageContentAuthored } from "@shared-types/content/pages/public/legal-licensing/licensing.legal.public.page.content";

export type TermsLegalPageDefinitionCore = BasePublicPageDefinitionCore & {
  kind: "longForm";
};

export type LicensingLegalPageDefinition = PublicPageDefinition<
  TermsLegalPageDefinitionCore,
  LicensingLegalPageContentAuthored
>;
