// src/app/appContext/resolvers/footer.resolve.appContext.ts

import type { AppState } from "@app/appState/class.appState";
import type {
  AppContextFooter,
  AppContextFooterAffiliation,
} from "@app/appContext/appContext.types";

import { footerConfig } from "@config/footer.config";

export const resolveFooterAppContext = (
  _appState: AppState,
): AppContextFooter => {
  let affiliations: AppContextFooter["affiliations"] = null;
  let colophon: AppContextFooter["colophon"] = null;

  for (const module of footerConfig.modules) {
    if (module.kind === "affiliations") {
      const items: AppContextFooterAffiliation[] = module.items.map((item) => ({
        id: item.id,
        label: item.label,
        href: item.href,
        svgId: item.svgId,
      }));

      affiliations = {
        title: module.title,
        description: module.description,
        items,
      };
    }

    if (module.kind === "colophon") {
      colophon = {
        copyrightName: module.copyrightName,
        copyrightYear: module.copyrightYear,
      };
    }
  }

  return Object.freeze({
    affiliations,
    colophon,
  });
};
