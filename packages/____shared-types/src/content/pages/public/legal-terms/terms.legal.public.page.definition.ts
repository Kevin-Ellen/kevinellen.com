// packages/shared-types/src/content/pages/public/legal-terms-of-use/terms-of-use.legal.public.page.definition.ts

import type {
  BasePublicPageDefinitionCore,
  PublicPageDefinition,
} from "@shared-types/content/pages/public/base.public.page.definition";
import type { TermsLegalPageContentAuthored } from "@shared-types/content/pages/public/legal-terms/terms.legal.public.page.content";

export type TermsLegalPageDefinitionCore = BasePublicPageDefinitionCore & {
  kind: "longForm";
};

export type TermsLegalPageDefinition = PublicPageDefinition<
  TermsLegalPageDefinitionCore,
  TermsLegalPageContentAuthored
>;
