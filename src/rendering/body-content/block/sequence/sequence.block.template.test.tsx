// src/rendering/body-content/block/sequence/sequence.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextSequenceBlock } from "@shared-types/page-content/block/sequence/app-render-context.sequence.block.types";

import { SequenceBlockTemplate } from "@rendering/body-content/block/sequence/sequence.block.template";

const sequenceBlock = (
  overrides: Partial<AppRenderContextSequenceBlock> = {},
): AppRenderContextSequenceBlock =>
  ({
    kind: "sequence",
    flow: "content",
    immersive: false,
    caption: [
      {
        kind: "text",
        value: "A kingfisher exits the water across three frames.",
      },
    ],
    meta: [],
    photos: [
      {
        position: 1,
        photo: {
          id: "kingfisher-001",
          src: "/media/photo/kingfisher-001/1200",
          srcset: [
            "/media/photo/kingfisher-001/800 800w",
            "/media/photo/kingfisher-001/1200 1200w",
          ],
          sizes: "(min-width: 900px) 80vw, 100vw",
          width: 1200,
          height: 800,
          alt: "Kingfisher leaving the water",
          commentary: "Frame one.",
          meta: [],
        },
      },
      {
        position: 2,
        photo: {
          id: "kingfisher-002",
          src: "/media/photo/kingfisher-002/1200",
          srcset: [
            "/media/photo/kingfisher-002/800 800w",
            "/media/photo/kingfisher-002/1200 1200w",
          ],
          sizes: "(min-width: 900px) 80vw, 100vw",
          width: 1200,
          height: 800,
          alt: "Kingfisher rising from the splash",
          commentary: "Frame two.",
          meta: [],
        },
      },
    ],
    ...overrides,
  }) as AppRenderContextSequenceBlock;

describe("SequenceBlockTemplate", () => {
  it("renders a sequence block", () => {
    expect(
      renderToStaticMarkup(<SequenceBlockTemplate block={sequenceBlock()} />),
    ).toBe(
      '<figure class="m-contentBlock m-sequence l-content"><div class="m-sequence__items"><figure class="m-sequence__item" data-photo-id="kingfisher-001" data-sequence-position="1"><img class="m-sequence__object" src="/media/photo/kingfisher-001/1200" srcSet="/media/photo/kingfisher-001/800 800w, /media/photo/kingfisher-001/1200 1200w" sizes="(min-width: 900px) 80vw, 100vw" width="1200" height="800" alt="Kingfisher leaving the water" loading="lazy" decoding="async"/></figure><figure class="m-sequence__item" data-photo-id="kingfisher-002" data-sequence-position="2"><img class="m-sequence__object" src="/media/photo/kingfisher-002/1200" srcSet="/media/photo/kingfisher-002/800 800w, /media/photo/kingfisher-002/1200 1200w" sizes="(min-width: 900px) 80vw, 100vw" width="1200" height="800" alt="Kingfisher rising from the splash" loading="lazy" decoding="async"/></figure></div><figcaption class="m-sequence__annotation"><div class="m-sequence__caption">A kingfisher exits the water across three frames.</div></figcaption></figure>',
    );
  });

  it("renders immersive sequences as eager", () => {
    const html = renderToStaticMarkup(
      <SequenceBlockTemplate block={sequenceBlock({ immersive: true })} />,
    );

    expect(html).toContain("m-sequence--immersive");
    expect(html).toContain('loading="eager"');
  });

  it("uses breakout flow class", () => {
    const html = renderToStaticMarkup(
      <SequenceBlockTemplate block={sequenceBlock({ flow: "breakout" })} />,
    );

    expect(html).toContain("m-contentBlock--breakout");
  });

  it("renders sequence positions", () => {
    const html = renderToStaticMarkup(
      <SequenceBlockTemplate block={sequenceBlock()} />,
    );

    expect(html).toContain('data-sequence-position="1"');
    expect(html).toContain('data-sequence-position="2"');
  });

  it("renders sequence metadata", () => {
    const html = renderToStaticMarkup(
      <SequenceBlockTemplate
        block={sequenceBlock({
          meta: [
            {
              kind: "context",
              items: [
                {
                  id: "location",
                  label: "Location",
                  description: null,
                  value: "Rye Meads",
                },
                {
                  id: "capturedAt",
                  label: "Captured",
                  description: null,
                  value: "14 May 2026, 08:58",
                  datetime: "2026-05-14T07:58:49.000Z",
                },
              ],
            },
            {
              kind: "settings",
              items: [
                {
                  id: "iso",
                  label: "ISO",
                  description: "The camera’s sensitivity to light.",
                  value: "ISO 5,000–6,400",
                },
              ],
            },
          ],
        })}
      />,
    );

    expect(html).toContain("m-sequence__meta-group");
    expect(html).toContain("Rye Meads");
    expect(html).toContain(
      '<time dateTime="2026-05-14T07:58:49.000Z">14 May 2026, 08:58</time>',
    );
    expect(html).toContain(
      '<abbr title="The camera’s sensitivity to light.">ISO</abbr>',
    );
    expect(html).toContain("ISO 5,000–6,400");
    expect(html).toContain("m-sequence__meta--settings");
  });
});
