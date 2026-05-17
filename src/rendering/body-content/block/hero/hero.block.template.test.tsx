// src/rendering/body-content/block/hero/hero.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextHeroBlock } from "@shared-types/page-content/block/hero/app-render-context.hero.block.types";

import { HeroBlockTemplate } from "@rendering/body-content/block/hero/hero.block.template";

const heroBlock = (
  overrides: Partial<AppRenderContextHeroBlock> = {},
): AppRenderContextHeroBlock =>
  ({
    kind: "hero",
    flow: "content",
    immersive: false,
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
      alt: "Kingfisher diving over water",
      commentary: "A kingfisher breaking the surface.",
      meta: [
        {
          kind: "settings",
          items: [
            {
              label: "ISO",
              value: "3200",
              description: "Sensor sensitivity",
            },
            {
              label: "Captured",
              value: "16 May 2026",
              datetime: "2026-05-16",
            },
          ],
        },
      ],
    },
    ...overrides,
  }) as AppRenderContextHeroBlock;

describe("HeroBlockTemplate", () => {
  it("renders a hero photo block", () => {
    expect(
      renderToStaticMarkup(<HeroBlockTemplate block={heroBlock()} />),
    ).toBe(
      '<figure class="m-contentBlock m-photo l-content" data-photo-id="kingfisher-001"><img class="m-photo__object" src="/media/photo/kingfisher-001/1200" srcSet="/media/photo/kingfisher-001/800 800w, /media/photo/kingfisher-001/1200 1200w" sizes="(min-width: 900px) 80vw, 100vw" width="1200" height="800" alt="Kingfisher diving over water" loading="lazy" decoding="async"/><figcaption class="m-photo__annotation"><p class="m-photo__caption">A kingfisher breaking the surface.</p><div class="m-photo__meta-group"><dl class="m-photo__meta m-photo__meta--settings"><div class="m-photo__meta-item"><dt class="m-photo__meta-term"><abbr title="Sensor sensitivity">ISO</abbr></dt><dd class="m-photo__meta-detail">3200</dd></div><div class="m-photo__meta-item"><dt class="m-photo__meta-term">Captured</dt><dd class="m-photo__meta-detail"><time dateTime="2026-05-16">16 May 2026</time></dd></div></dl></div></figcaption></figure>',
    );
  });

  it("renders immersive hero photos as eager", () => {
    const html = renderToStaticMarkup(
      <HeroBlockTemplate block={heroBlock({ immersive: true })} />,
    );

    expect(html).toContain("m-photo--immersive");
    expect(html).toContain('loading="eager"');
  });

  it("omits metadata when no photo meta is present", () => {
    const html = renderToStaticMarkup(
      <HeroBlockTemplate
        block={heroBlock({
          photo: {
            ...heroBlock().photo,
            meta: [],
          },
        })}
      />,
    );

    expect(html).not.toContain("m-photo__meta-group");
  });

  it("uses breakout flow class", () => {
    const html = renderToStaticMarkup(
      <HeroBlockTemplate block={heroBlock({ flow: "breakout" })} />,
    );

    expect(html).toContain("m-contentBlock--breakout");
  });

  it("renders context photo meta without settings modifier", () => {
    const html = renderToStaticMarkup(
      <HeroBlockTemplate
        block={heroBlock({
          photo: {
            ...heroBlock().photo,
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
                ],
              },
            ],
          },
        })}
      />,
    );

    expect(html).toContain('class="m-photo__meta"');
    expect(html).not.toContain("m-photo__meta--settings");
  });
});
