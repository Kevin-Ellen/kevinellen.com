// src/app/renderContext/resolvers/content.resolve.renderContext.ts

import type { AppContextPageBodyContent } from "@app/appContext/content/content.appContext.types";
import type { RenderContextPageBodyContent } from "@app/renderContext/content/content.renderContext.types";

export const resolveContentRenderContext = (
  content: AppContextPageBodyContent,
): RenderContextPageBodyContent => {
  return {
    head: {
      eyebrow: content.head.eyebrow,
      title: content.head.title,
      intro: content.head.intro,
    },

    sections: content.sections.map((section) => ({
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
