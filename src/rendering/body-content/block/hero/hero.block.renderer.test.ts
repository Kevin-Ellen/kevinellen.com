// src/rendering/body-content/block/hero/hero.block.renderer.test.ts

import type { AppRenderContextHeroBlock } from "@shared-types/page-content/block/hero/app-render-context.hero.block.types";

import { renderHeroBlock } from "@rendering/body-content/block/hero/hero.block.renderer";
import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";

jest.mock("@rendering/body-content/block/helpers/flow.block.helper", () => ({
  renderBlockFlowClass: jest.fn(),
}));

const normaliseHtml = (html: string): string =>
  html.replace(/\s+/g, " ").trim();

const createModule = (
  overrides: Partial<AppRenderContextHeroBlock> = {},
): AppRenderContextHeroBlock =>
  ({
    kind: "hero",
    immersive: false,
    flow: "content",
    photo: {
      id: "coot-in-soft-light",
      title: "Coot in soft light",
      alt: "A coot swimming through soft light.",
      commentary: "A coot glides through soft evening light.",
      width: 1600,
      height: 1000,
      src: "/media/photo/coot-in-soft-light",
      srcset: [
        "/media/photo/coot-in-soft-light/640/400 640w",
        "/media/photo/coot-in-soft-light/960/600 960w",
      ],
      sizes: "(min-width: 1200px) 1200px, 100vw",
      attribution: "Kevin Ellen",
      ratio: {
        width: 8,
        height: 5,
      },
      meta: [
        {
          kind: "context",
          items: [
            {
              id: "location",
              label: "Location",
              description: "Where the photo was taken.",
              value: "Epping Forest, Essex",
            },
          ],
        },
        {
          kind: "settings",
          items: [
            {
              id: "iso",
              label: "ISO",
              description: null,
              value: "ISO 12,800",
            },
          ],
        },
      ],
    },
    ...overrides,
  }) as AppRenderContextHeroBlock;

describe("renderHeroBlockContentModule", () => {
  const mockedRenderBlockFlowClass = jest.mocked(renderBlockFlowClass);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderBlockFlowClass.mockReturnValue("l-content");
  });

  it("renders a hero photo block", () => {
    const result = normaliseHtml(renderHeroBlock(createModule()));

    expect(result).toContain(
      `<figure class="m-contentBlock m-photo l-content" data-photo-id="coot-in-soft-light">`,
    );

    expect(result).toContain(`class="m-photo__object"`);
    expect(result).toContain(`src="/media/photo/coot-in-soft-light"`);
    expect(result).toContain(
      `srcset="/media/photo/coot-in-soft-light/640/400 640w, /media/photo/coot-in-soft-light/960/600 960w"`,
    );
    expect(result).toContain(`sizes="(min-width: 1200px) 1200px, 100vw"`);
    expect(result).toContain(`width="1600"`);
    expect(result).toContain(`height="1000"`);
    expect(result).toContain(`alt="A coot swimming through soft light."`);
    expect(result).toContain(`loading="lazy"`);
    expect(result).toContain(`decoding="async"`);

    expect(result).toContain(
      `<p class="m-photo__caption">A coot glides through soft evening light.</p>`,
    );

    expect(mockedRenderBlockFlowClass).toHaveBeenCalledWith("content");
  });

  it("renders immersive hero state", () => {
    const result = normaliseHtml(
      renderHeroBlock(
        createModule({
          immersive: true,
          flow: "breakout",
        }),
      ),
    );

    expect(mockedRenderBlockFlowClass).toHaveBeenCalledWith("breakout");
    expect(result).toContain(
      `class="m-contentBlock m-photo l-content m-photo--immersive"`,
    );
    expect(result).toContain(`loading="eager"`);
  });

  it("renders photo metadata groups", () => {
    const result = normaliseHtml(renderHeroBlock(createModule()));

    expect(result).toContain(`<div class="m-photo__meta-group">`);
    expect(result).toContain(`<dl class="m-photo__meta">`);
    expect(result).toContain(
      `<dl class="m-photo__meta m-photo__meta--settings">`,
    );

    expect(result).toContain(
      `<dt class="m-photo__meta-term"><abbr title="Where the photo was taken.">Location</abbr></dt>`,
    );
    expect(result).toContain(
      `<dd class="m-photo__meta-detail">Epping Forest, Essex</dd>`,
    );

    expect(result).toContain(`<dt class="m-photo__meta-term">ISO</dt>`);
    expect(result).toContain(
      `<dd class="m-photo__meta-detail">ISO 12,800</dd>`,
    );
  });

  it("omits photo metadata when no metadata is present", () => {
    const result = normaliseHtml(
      renderHeroBlock(
        createModule({
          photo: {
            ...createModule().photo,
            meta: [],
          },
        }),
      ),
    );

    expect(result).not.toContain(`m-photo__meta-group`);
    expect(result).not.toContain(`<dl class="m-photo__meta`);
  });

  it("escapes rendered photo values", () => {
    const result = normaliseHtml(
      renderHeroBlock(
        createModule({
          photo: {
            ...createModule().photo,
            id: `photo-"id"`,
            src: `/media/photo/<bad>`,
            srcset: [`/media/photo/<bad>/640/400 640w`],
            sizes: `"bad"`,
            alt: `Alt "text" <bad>`,
            commentary: `Caption <script>alert("x")</script>`,
            meta: [
              {
                kind: "context",
                items: [
                  {
                    id: "location",
                    label: `Location <bad>`,
                    description: `Description "bad" <bad>`,
                    value: `Value <bad>`,
                  },
                ],
              },
            ],
          },
        }),
      ),
    );

    expect(result).toContain(`data-photo-id="photo-&quot;id&quot;"`);
    expect(result).toContain(`src="/media/photo/&lt;bad&gt;"`);
    expect(result).toContain(`srcset="/media/photo/&lt;bad&gt;/640/400 640w"`);
    expect(result).toContain(`sizes="&quot;bad&quot;"`);
    expect(result).toContain(`alt="Alt &quot;text&quot; &lt;bad&gt;"`);
    expect(result).toContain(
      `Caption &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;`,
    );
    expect(result).toContain(
      `<abbr title="Description &quot;bad&quot; &lt;bad&gt;">Location &lt;bad&gt;</abbr>`,
    );
    expect(result).toContain(
      `<dd class="m-photo__meta-detail">Value &lt;bad&gt;</dd>`,
    );
  });

  it("renders datetime metadata values as time elements", () => {
    const result = normaliseHtml(
      renderHeroBlock(
        createModule({
          photo: {
            ...createModule().photo,
            meta: [
              {
                kind: "context",
                items: [
                  {
                    id: "capturedAt",
                    label: "Captured",
                    description: "When the photo was taken.",
                    value: "27 May 2025, 12:15",
                    datetime: "2025-05-27T10:15:43.000Z",
                  },
                ],
              },
            ],
          },
        }),
      ),
    );

    expect(result).toContain(
      `<dd class="m-photo__meta-detail"><time datetime="2025-05-27T10:15:43.000Z">27 May 2025, 12:15</time></dd>`,
    );
  });
});
