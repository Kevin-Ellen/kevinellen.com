// src/rendering/body-content/block/homepage-hero/homepage-hero.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-render-context.homepage-hero.block.types";

import { HomepageHeroBlockTemplate } from "@rendering/body-content/block/homepage-hero/homepage-hero.block.template";

const homepageHeroBlock = (
  overrides: Partial<AppRenderContextHomepageHeroBlock> = {},
): AppRenderContextHomepageHeroBlock =>
  ({
    kind: "homepageHero",
    flow: "content",

    eyebrow: "Wildlife Photography",

    title: "Observation through photography",

    intro: [
      {
        kind: "text",
        value:
          "Field notes, wildlife photography, and technical experimentation.",
      },
    ],

    primaryLink: {
      kind: "internal",
      href: "/journal",
      text: "Read the journal",
      openInNewTab: false,
    },

    photo: {
      id: "homepage-hero",
      src: "/media/photo/homepage-hero/1600",
      srcset: [
        "/media/photo/homepage-hero/800 800w",
        "/media/photo/homepage-hero/1600 1600w",
      ],
      sizes: "100vw",
      alt: "A kingfisher perched over water",
      width: 1600,
      height: 900,
    },

    ...overrides,
  }) as AppRenderContextHomepageHeroBlock;

describe("HomepageHeroBlockTemplate", () => {
  it("renders the homepage hero block", () => {
    expect(
      renderToStaticMarkup(
        <HomepageHeroBlockTemplate block={homepageHeroBlock()} />,
      ),
    ).toBe(
      '<link rel="preload" as="image" imageSrcSet="/media/photo/homepage-hero/800 800w, /media/photo/homepage-hero/1600 1600w" imageSizes="100vw" fetchPriority="high"/><section class="m-homepage-hero l-content"><div class="m-homepage-hero__media"><img class="m-homepage-hero__image" src="/media/photo/homepage-hero/1600" srcSet="/media/photo/homepage-hero/800 800w, /media/photo/homepage-hero/1600 1600w" sizes="100vw" alt="A kingfisher perched over water" width="1600" height="900" loading="eager" decoding="async" fetchPriority="high"/></div><div class="m-homepage-hero__content m-heading"><p class="m-homepage-hero__eyebrow m-heading__eyebrow">Wildlife Photography</p><h1 class="m-homepage-hero__title m-heading__title">Observation through photography</h1><p class="m-homepage-hero__intro m-heading__intro">Field notes, wildlife photography, and technical experimentation.</p><a class="m-homepage-hero__action" href="/journal">Read the journal</a></div></section>',
    );
  });

  it("omits optional content when not provided", () => {
    const html = renderToStaticMarkup(
      <HomepageHeroBlockTemplate
        block={homepageHeroBlock({
          eyebrow: null,
          intro: [],
          primaryLink: null,
        })}
      />,
    );

    expect(html).not.toContain("m-homepage-hero__eyebrow");
    expect(html).not.toContain("m-homepage-hero__intro");
    expect(html).not.toContain("m-homepage-hero__action");
  });

  it("renders breakout flow classes", () => {
    const html = renderToStaticMarkup(
      <HomepageHeroBlockTemplate
        block={homepageHeroBlock({
          flow: "breakout",
        })}
      />,
    );

    expect(html).toContain("m-contentBlock--breakout");
  });

  it("escapes user content safely", () => {
    const html = renderToStaticMarkup(
      <HomepageHeroBlockTemplate
        block={homepageHeroBlock({
          title: '<script>alert("x")</script>',
        })}
      />,
    );

    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });
});
