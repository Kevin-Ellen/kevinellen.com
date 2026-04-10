// src/app/renderContext/resolvers/pageFooter.resolver.renderContext.ts

import type { AppContext } from "@app/appContext/class.appContext";

import { resolveSvgReference } from "@app/renderContext/resolvers/reference.svg.asset.resolve.renderContext";

export const resolvePageFooterRenderContext = (appContext: AppContext) => {
  const affiliationsModule = appContext.pageFooter.modules.find(
    (module) => module.kind === "affiliations",
  );

  const colophonModule = appContext.pageFooter.modules.find(
    (module) => module.kind === "colophon",
  );

  return {
    navigation: {
      sections: appContext.navigation.footer.sections.map((section) => ({
        id: section.id,
        label: section.label,
        items: section.items.map((item) => ({
          label: item.label,
          href: item.href,
          isExternal: item.isExternal,
          openInNewTab: item.openInNewTab,
        })),
      })),
    },
    affiliations: affiliationsModule
      ? {
          title: affiliationsModule.title,
          description: affiliationsModule.description,
          items: affiliationsModule.items.map((item) => ({
            href: item.href,
            label: item.label,
            svg: resolveSvgReference(appContext.assets.svgs, item.svgId),
          })),
        }
      : null,
    colophon: colophonModule
      ? {
          copyrightYear: colophonModule.copyrightYear,
          copyrightName: colophonModule.copyrightName,
          allRightsReserved: colophonModule.allRightsReserved ?? false,
        }
      : null,
  };
};
