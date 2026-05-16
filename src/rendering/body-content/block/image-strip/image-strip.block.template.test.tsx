// src/rendering/body-content/block/image-strip/image-strip.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextImageStripBlock } from "@shared-types/page-content/block/image-strip/app-render-context.image-strip.block.types";

import { ImageStripBlockTemplate } from "@rendering/body-content/block/image-strip/image-strip.block.template";

const block = (
  overrides: Partial<AppRenderContextImageStripBlock> = {},
): AppRenderContextImageStripBlock =>
  ({
    kind: "imageStrip",
    flow: "content",
    heading: {
      text: "Recent photographs",
      level: 2,
      visuallyHidden: false,
    },
    photos: [
      {
        src: "/media/photo/coot/800",
        srcset: ["/media/photo/coot/400 400w", "/media/photo/coot/800 800w"],
        sizes: "(min-width: 900px) 33vw, 100vw",
        alt: "A coot on water",
        width: 800,
        height: 600,
      },
    ],
    ...overrides,
  }) as AppRenderContextImageStripBlock;

describe("ImageStripBlockTemplate", () => {
  it("renders an image strip", () => {
    expect(
      renderToStaticMarkup(<ImageStripBlockTemplate block={block()} />),
    ).toBe(
      '<section class="m-image-strip l-content"><h2 class="m-image-strip__heading">Recent photographs</h2><div class="m-image-strip__inner"><img class="m-image-strip__image" src="/media/photo/coot/800" srcSet="/media/photo/coot/400 400w, /media/photo/coot/800 800w" sizes="(min-width: 900px) 33vw, 100vw" alt="A coot on water" width="800" height="600" loading="lazy" decoding="async"/></div></section>',
    );
  });

  it("renders breakout flow", () => {
    const html = renderToStaticMarkup(
      <ImageStripBlockTemplate block={block({ flow: "breakout" })} />,
    );

    expect(html).toContain("m-contentBlock--breakout");
  });
});
