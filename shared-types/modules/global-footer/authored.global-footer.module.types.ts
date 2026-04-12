// shared-types/modules/global-footer/authored.global-footer.module.types.ts

import { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";

type AffiliationId = "rspb" | "national-trust" | "vogelbescherming-nederland";

type AffiliationEntry = {
  id: AffiliationId;
  label: string;
  href: string;
  svgId: SvgAssetId;
};

export type AuthoredGlobalFooterAffiliations = {
  kind: "affiliations";
  title: string;
  description: string;
  items: readonly AffiliationEntry[];
};

export type AuthoredGlobalFooter = {
  affiliations: AuthoredGlobalFooterAffiliations;
};
