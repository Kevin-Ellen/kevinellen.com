// src/rendering/body-content/block/image-strip.block.renderer.test.ts

import type { AppRenderContextImageStripBlock } from "@shared-types/page-content/block/image-strip/app-render-context.image-strip.block.types";

import { renderImageStripBlock } from "@rendering/body-content/block/image-strip.block.renderer";
import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";
import { renderHeading } from "@rendering/shared/heading.shared.renderer";

jest.mock("@rendering/body-content/block/helpers/flow.block.helper", () => ({
  renderBlockFlowClass: jest.fn(),
}));

jest.mock("@rendering/shared/heading.shared.renderer", () => ({
  renderHeading: jest.fn(),
}));

const createModule = (
  overrides: Partial<AppRenderContextImageStripBlock> = {},
): AppRenderContextImageStripBlock =>
  ({
    kind: "imageStrip",
    flow: "breakout",
    heading: {
      level: 2,
      text: "Recent sightings",
    },
    photos: [
      {
        src: "/media/photo/coot-in-soft-light",
        srcset: [
          "/media/photo/coot-in-soft-light/640/400 640w",
          "/media/photo/coot-in-soft-light/960/600 960w",
        ],
        sizes: "(min-width: 1200px) 1200px, 100vw",
        alt: "A coot swimming through soft light.",
        width: 1600,
        height: 1000,
        ratio: {
          width: 8,
          height: 5,
        },
      },
      {
        src: "/media/photo/misty-morning",
        srcset: ["/media/photo/misty-morning/640/400 640w"],
        sizes: "100vw",
        alt: "Mist over a lake at sunrise.",
        width: 1200,
        height: 800,
        ratio: {
          width: 3,
          height: 2,
        },
      },
    ],
    ...overrides,
  }) as AppRenderContextImageStripBlock;

describe("renderImageStripBlock", () => {
  const mockedRenderBlockFlowClass = jest.mocked(renderBlockFlowClass);
  const mockedRenderHeading = jest.mocked(renderHeading);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderBlockFlowClass.mockReturnValue("m-contentBlock--breakout");

    mockedRenderHeading.mockReturnValue(
      `<h2 class="m-image-strip__heading">Recent sightings</h2>`,
    );
  });

  it("renders image strip block", () => {
    expect(renderImageStripBlock(createModule())).toBe(
      `<section class="m-image-strip m-contentBlock--breakout"><h2 class="m-image-strip__heading">Recent sightings</h2><div class="m-image-strip__inner"><img class="m-image-strip__image" src="/media/photo/coot-in-soft-light" srcset="/media/photo/coot-in-soft-light/640/400 640w, /media/photo/coot-in-soft-light/960/600 960w" sizes="(min-width: 1200px) 1200px, 100vw" alt="A coot swimming through soft light." width="1600" height="1000" loading="lazy" decoding="async"><img class="m-image-strip__image" src="/media/photo/misty-morning" srcset="/media/photo/misty-morning/640/400 640w" sizes="100vw" alt="Mist over a lake at sunrise." width="1200" height="800" loading="lazy" decoding="async"></div></section>`,
    );

    expect(mockedRenderBlockFlowClass).toHaveBeenCalledWith("breakout");

    expect(mockedRenderHeading).toHaveBeenCalledWith(createModule().heading, {
      className: "m-image-strip__heading",
    });
  });

  it("renders empty image strip", () => {
    expect(
      renderImageStripBlock(
        createModule({
          photos: [],
        }),
      ),
    ).toBe(
      `<section class="m-image-strip m-contentBlock--breakout"><h2 class="m-image-strip__heading">Recent sightings</h2><div class="m-image-strip__inner"></div></section>`,
    );
  });

  it("escapes image attributes", () => {
    const result = renderImageStripBlock(
      createModule({
        photos: [
          {
            src: `/media/photo/<bad>`,
            srcset: [`/media/photo/<bad>/640/400 640w`],
            sizes: `"bad"`,
            alt: `Alt "text" <bad>`,
            width: 1600,
            height: 1000,
            ratio: {
              width: 8,
              height: 5,
            },
          },
        ],
      }),
    );

    expect(result).toContain(`src="/media/photo/&lt;bad&gt;"`);

    expect(result).toContain(`srcset="/media/photo/&lt;bad&gt;/640/400 640w"`);

    expect(result).toContain(`sizes="&quot;bad&quot;"`);

    expect(result).toContain(`alt="Alt &quot;text&quot; &lt;bad&gt;"`);
  });
});
