// src/rendering/body-content/body-content.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

import { BodyContentTemplate } from "@rendering/body-content/body-content.template";

const bodyContent = (
  overrides: Partial<AppRenderContextBodyContent> = {},
): AppRenderContextBodyContent =>
  ({
    header: {
      title: "Wildlife Journal",
      eyebrow: "Field Notes",
      intro: "Observations from the marsh.",
      showInBody: true,
    },

    content: [
      {
        kind: "paragraph",
        flow: "content",
        content: [
          {
            kind: "text",
            value: "A calm morning beside the reeds.",
          },
        ],
      },
    ],

    footer: [
      {
        kind: "noteEntryFooter",

        publication: {
          author: "Kevin Ellen",
          publishedAt: "16 May 2026",
          updatedAt: "17 May 2026",
        },

        topic: "Rendering",
        tags: [],
      },
    ],

    ...overrides,
  }) as AppRenderContextBodyContent;

describe("BodyContentTemplate", () => {
  it("renders body content", () => {
    const html = renderToStaticMarkup(
      <BodyContentTemplate bodyContent={bodyContent()} />,
    );

    expect(html).toContain('<main class="l-main">');
    expect(html).toContain('class="m-heading__title">Wildlife Journal<');
    expect(html).toContain(
      'class="m-contentBlock m-contentBlock--paragraph l-content"',
    );
    expect(html).toContain('class="l-content m-article-footer"');
  });

  it("renders without footer", () => {
    const html = renderToStaticMarkup(
      <BodyContentTemplate
        bodyContent={bodyContent({
          footer: [],
        })}
      />,
    );

    expect(html).not.toContain("m-article-footer");
  });

  it("renders without header", () => {
    const html = renderToStaticMarkup(
      <BodyContentTemplate
        bodyContent={bodyContent({
          header: null,
        })}
      />,
    );

    expect(html).not.toContain("m-heading__title");
  });

  it("renders empty content", () => {
    const html = renderToStaticMarkup(
      <BodyContentTemplate
        bodyContent={bodyContent({
          content: [],
        })}
      />,
    );

    expect(html).toContain('<main class="l-main">');
  });
});
