// src/rendering/body-content/block/homepage-hero/homepage-hero.block.renderer.test.ts

import type { AppRenderContextHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-render-context.homepage-hero.block.types";

import { renderHomepageHeroBlock } from "@rendering/body-content/block/homepage-hero/homepage-hero.block.renderer";
import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";
import { renderInlineContent } from "@rendering/body-content/inline/inline.renderer";
import { renderTextLink } from "@rendering/shared/link.shared.renderer";

jest.mock("@rendering/body-content/block/helpers/flow.block.helper", () => ({
  renderBlockFlowClass: jest.fn(),
}));

jest.mock("@rendering/body-content/inline/inline.renderer", () => ({
  renderInlineContent: jest.fn(),
}));

jest.mock("@rendering/shared/link.shared.renderer", () => ({
  renderTextLink: jest.fn(),
}));

const createModule = (
  overrides: Partial<AppRenderContextHomepageHeroBlock> = {},
): AppRenderContextHomepageHeroBlock =>
  ({
    kind: "homepageHero",
    flow: "breakout",
    eyebrow: "Field notes",
    title: "Photography Duck",
    intro: [{ kind: "text", value: "Nature, notes, and technical craft." }],
    primaryLink: {
      href: "/journal",
      text: "Read the journal",
      openInNewTab: false,
      svg: null,
    },
    photo: {
      id: "coot-in-soft-light",
      title: "Coot in soft light",
      alt: "A coot swimming through soft light.",
      commentary: null,
      width: 1600,
      height: 1000,
      src: "/media/photo/coot-in-soft-light",
      srcset: [
        "/media/photo/coot-in-soft-light/640/400 640w",
        "/media/photo/coot-in-soft-light/960/600 960w",
      ],
      sizes: "(min-width: 1200px) 1200px, 100vw",
      attribution: "Kevin Ellen",
      ratio: { width: 8, height: 5 },
      meta: [],
    },
    ...overrides,
  }) as AppRenderContextHomepageHeroBlock;

describe("renderHomepageHeroBlock", () => {
  const mockedRenderBlockFlowClass = jest.mocked(renderBlockFlowClass);
  const mockedRenderInlineContent = jest.mocked(renderInlineContent);
  const mockedRenderTextLink = jest.mocked(renderTextLink);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderBlockFlowClass.mockReturnValue("m-contentBlock--breakout");
    mockedRenderInlineContent.mockReturnValue(
      "Nature, notes, and technical craft.",
    );
    mockedRenderTextLink.mockReturnValue(
      `<a class="m-homepage-hero__action" href="/journal">Read the journal</a>`,
    );
  });

  it("renders the homepage hero block", () => {
    expect(renderHomepageHeroBlock(createModule())).toBe(
      `<section class="m-homepage-hero m-contentBlock--breakout"><div class="m-homepage-hero__media"><img
      class="m-homepage-hero__image"
      src="/media/photo/coot-in-soft-light"
      srcset="/media/photo/coot-in-soft-light/640/400 640w, /media/photo/coot-in-soft-light/960/600 960w"
      sizes="(min-width: 1200px) 1200px, 100vw"
      alt="A coot swimming through soft light."
      width="1600"
      height="1000"
      loading="eager"
      decoding="async"
      fetchpriority="high"
    ></div><div class="m-homepage-hero__content m-heading"><p class="m-homepage-hero__eyebrow m-heading__eyebrow">Field notes</p><h1 class="m-homepage-hero__title m-heading__title">Photography Duck</h1><p class="m-homepage-hero__intro m-heading__intro">Nature, notes, and technical craft.</p><a class="m-homepage-hero__action" href="/journal">Read the journal</a></div></section>`,
    );

    expect(mockedRenderBlockFlowClass).toHaveBeenCalledWith("breakout");
    expect(mockedRenderInlineContent).toHaveBeenCalledWith(
      createModule().intro,
    );
    expect(mockedRenderTextLink).toHaveBeenCalledWith({
      ...createModule().primaryLink,
      className: "m-homepage-hero__action",
    });
  });

  it("omits optional eyebrow and primary link", () => {
    mockedRenderTextLink.mockReturnValue("");

    expect(
      renderHomepageHeroBlock(
        createModule({
          eyebrow: null,
          primaryLink: null,
        }),
      ),
    ).not.toContain("m-homepage-hero__eyebrow");

    expect(mockedRenderTextLink).not.toHaveBeenCalled();
  });

  it("omits intro paragraph when rendered intro is empty", () => {
    mockedRenderInlineContent.mockReturnValue("");

    expect(renderHomepageHeroBlock(createModule())).not.toContain(
      "m-homepage-hero__intro",
    );
  });

  it("escapes text and image attributes", () => {
    const result = renderHomepageHeroBlock(
      createModule({
        eyebrow: `Field <notes>`,
        title: `Photography "Duck" <site>`,
        photo: {
          ...createModule().photo,
          src: `/media/photo/<bad>`,
          srcset: [`/media/photo/<bad>/640/400 640w`],
          sizes: `"bad"`,
          alt: `Alt "text" <bad>`,
        },
      }),
    );

    expect(result).toContain(`Field &lt;notes&gt;`);
    expect(result).toContain(`Photography &quot;Duck&quot; &lt;site&gt;`);
    expect(result).toContain(`src="/media/photo/&lt;bad&gt;"`);
    expect(result).toContain(`srcset="/media/photo/&lt;bad&gt;/640/400 640w"`);
    expect(result).toContain(`sizes="&quot;bad&quot;"`);
    expect(result).toContain(`alt="Alt &quot;text&quot; &lt;bad&gt;"`);
  });
});
