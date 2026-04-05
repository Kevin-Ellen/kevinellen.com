// src/config/footer.config.types.ts

import type { SvgAssetId } from "@shared-types/assets/id.asset.types";

type AffiliationId = "rspb" | "national-trust" | "vogelbescherming-nederland";

export type FooterModule =
  | {
      kind: "colophon";
      copyrightName: string;
      copyrightYear: number;
    }
  | {
      kind: "affiliations";
      title: string;
      description: string;
      items: readonly {
        id: AffiliationId;
        label: string;
        href: string;
        svgId: SvgAssetId;
      }[];
    };

export type FooterConfig = {
  modules: readonly FooterModule[];
};
