// shared-types/page-content/site/global-footer/app-state.global-footer.page-content.types.ts

import type { AuthoredGlobalFooter } from "@shared-types/page-content/site/global-footer/authored.global-footer.page-content.types";

export type AppStateGlobalFooterColophon = Readonly<{
  kind: "colophon";
  copyrightName: string;
  copyrightYear: number;
  allRightsReserved: boolean;
}>;

type AppStateGlobalFooterRuntime = Readonly<{
  colophon: AppStateGlobalFooterColophon;
}>;

export type AppStateGlobalFooter = Readonly<
  AuthoredGlobalFooter & AppStateGlobalFooterRuntime
>;
