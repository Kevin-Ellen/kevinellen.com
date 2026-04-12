// shared-types/modules/global-footer/app-state.global-footer.module.types.ts

import { AuthoredGlobalFooter } from "@shared-types/modules/global-footer/authored.global-footer.module.types";

export type AppStateGlobalFooterColophon = {
  kind: "colophon";
  copyrightName: string;
  copyrightYear: number;
  allRightsReserved: boolean;
};

export type AppStateGlobalFooter = AuthoredGlobalFooter & {
  colophon: AppStateGlobalFooterColophon;
};
