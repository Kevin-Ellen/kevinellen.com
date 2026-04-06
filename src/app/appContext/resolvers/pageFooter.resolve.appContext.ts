// src/app/appContext/resolvers/pageFooter.resolve.appContext.ts

import type {
  AppContextFooterAffiliationItem,
  AppContextFooterModule,
  AppContextPageFooter,
} from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { FooterModule } from "@app/config/footer.config.types";

const resolveFooterAffiliationItem = (
  item: Extract<FooterModule, { kind: "affiliations" }>["items"][number],
): AppContextFooterAffiliationItem => {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    svgId: item.svgId,
  };
};

const resolveFooterModule = (module: FooterModule): AppContextFooterModule => {
  if (module.kind === "colophon") {
    return {
      kind: "colophon",
      copyrightName: module.copyrightName,
      copyrightYear: module.copyrightYear,
    };
  }

  return {
    kind: "affiliations",
    title: module.title,
    description: module.description,
    items: module.items.map((item) => resolveFooterAffiliationItem(item)),
  };
};

export const resolvePageFooterAppContext = (
  appState: AppState,
): AppContextPageFooter => {
  return {
    modules: appState.footer.modules.map((module) =>
      resolveFooterModule(module),
    ),
  };
};
