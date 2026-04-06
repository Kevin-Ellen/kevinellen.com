// packages/shared-types/src/content/pages/public/legal-privacy/privacy.legal.public.page.definition.ts

import type {
  BasePublicPageDefinitionCore,
  PublicPageDefinition,
} from "@shared-types/content/pages/public/base.public.page.definition";
import type { PrivacyLegalPageContentAuthored } from "@shared-types/content/pages/public/legal-privacy/privacy.legal.public.page.content";

export type PrivacyLegalPageDefinitionCore = BasePublicPageDefinitionCore & {
  kind: "longForm";
};

export type PrivacyLegalPageDefinition = PublicPageDefinition<
  PrivacyLegalPageDefinitionCore,
  PrivacyLegalPageContentAuthored
>;
