// src/app/appContext/resolvers/content.resolve.appContext.ts

import type { AppContextPageBodyContent } from "@app/appContext/content/content.appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";

import { resolveContentModuleAppContext } from "@app/appContext/content/modules/module.resolve.appContext";

export const resolveContentAppContext = (
  page: PublicPage | ErrorPage,
  appState: AppState,
): AppContextPageBodyContent => {
  return {
    head: {
      eyebrow: page.content.head.eyebrow,
      title: page.content.head.title,
      intro: page.content.head.intro,
    },

    sections: page.content.body.map((section) => ({
      kind: section.kind,
      heading: section.heading
        ? {
            text: section.heading.text,
            visuallyHidden: section.heading.visuallyHidden,
            level: section.heading.level,
          }
        : undefined,
      modules: section.modules.map((module) =>
        resolveContentModuleAppContext(module, appState),
      ),
    })),
  };
};
