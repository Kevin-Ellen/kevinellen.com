// src/rendering/body-content/footer/footer.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextPageContentFooter } from "@shared-types/page-content/footer/app-render-context.page-footer.types";

import { BodyContentFooterTemplate } from "@rendering/body-content/footer/footer.template";

describe("BodyContentFooterTemplate", () => {
  it("renders journal and note footers", () => {
    const footer = [
      {
        kind: "journalEntryFooter",

        publication: {
          author: "Kevin Ellen",
          publishedAt: "16 May 2026",
          updatedAt: "17 May 2026",
        },

        equipment: {
          cameras: ["Canon EOS R7"],
          lenses: ["RF 100-500mm"],
        },
      },

      {
        kind: "noteEntryFooter",

        publication: {
          author: "Kevin Ellen",
          publishedAt: "10 May 2026",
          updatedAt: "11 May 2026",
        },

        topic: "Rendering",
        tags: [],
      },
    ] as readonly AppRenderContextPageContentFooter[];

    const html = renderToStaticMarkup(
      <BodyContentFooterTemplate footer={footer} />,
    );

    expect(html).toContain('class="l-content m-article-footer"');

    expect(html).toContain(">Field notes<");
    expect(html).toContain(">Note details<");
  });

  it("renders nothing when footer modules are empty", () => {
    expect(
      renderToStaticMarkup(<BodyContentFooterTemplate footer={[]} />),
    ).toBe("");
  });
});
