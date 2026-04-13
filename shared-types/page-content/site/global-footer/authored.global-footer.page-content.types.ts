// shared-types/page-content/site/global-footer/authored.global-footer.page-content.types.ts

import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";

type AuthoredGlobalFooterAffiliationId =
  | "rspb"
  | "national-trust"
  | "vogelbescherming-nederland";

type AuthoredGlobalFooterAffiliationEntry = Readonly<{
  id: AuthoredGlobalFooterAffiliationId;
  label: string;
  href: string;
  svgId: SvgAssetId;
}>;

export type AuthoredGlobalFooterAffiliations = Readonly<{
  kind: "affiliations";
  title: string;
  description: string;
  items: readonly AuthoredGlobalFooterAffiliationEntry[];
}>;

export type AuthoredGlobalFooter = Readonly<{
  affiliations: AuthoredGlobalFooterAffiliations;
}>;
