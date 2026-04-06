// src/app/appContext/resolvers/content.resolve.appContext

import type { AppContextPageBodyContent } from "@app/appContext/content/content.appContext.types";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";

export const resolveContentAppContext = (
  page: PublicPage | ErrorPage,
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
      modules: section.modules.map((module) => {
        switch (module.kind) {
          case "paragraph":
            return {
              kind: "paragraph",
              text: module.text,
            };

          case "quote":
            return {
              kind: "quote",
              text: module.text,
              attribution: module.attribution,
            };
        }
      }),
    })),
  };
};
