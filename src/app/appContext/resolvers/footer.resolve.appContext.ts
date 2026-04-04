// src/app/appContext/resolvers/footer.resolve.appContext.ts

import type { AppState } from "@app/appState/class.appState";
import type {
  AppContextFooter,
  AppContextFooterAffiliation,
} from "@app/appContext/appContext.types";

import { footerConfig } from "@config/footer.config";

const getSvgDimensionsFromViewBox = (
  viewBox: string,
): {
  width: number;
  height: number;
} => {
  const parts = viewBox.split(" ");

  if (parts.length !== 4) {
    throw new Error(`Invalid viewBox: ${viewBox}`);
  }

  const width = Number(parts[2]);
  const height = Number(parts[3]);

  if (!width || !height) {
    throw new Error(`Invalid viewBox dimensions: ${viewBox}`);
  }

  return { width, height };
};

export const resolveFooterAppContext = (
  appState: AppState,
): AppContextFooter => {
  const assets = appState.getAssetsConfig();

  const svgMap = new Map(assets.svgs.map((svg) => [svg.id, svg]));

  let affiliations: AppContextFooter["affiliations"] = null;
  let colophon: AppContextFooter["colophon"] = null;

  for (const module of footerConfig.modules) {
    if (module.kind === "affiliations") {
      const items: AppContextFooterAffiliation[] = module.items.map((item) => {
        const svg = svgMap.get(item.svgId);

        if (!svg) {
          throw new Error(
            `Missing SVG asset for footer affiliation: ${item.svgId}`,
          );
        }

        const { width, height } = getSvgDimensionsFromViewBox(svg.viewBox);

        return {
          id: item.id,
          label: item.label,
          href: item.href,
          svgId: item.svgId,
          viewBox: svg.viewBox,
          width,
          height,
        };
      });

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
