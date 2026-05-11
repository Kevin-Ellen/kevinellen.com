// src/rendering/body-content/block/section-links/section-links.block.renderer.test.ts

import type { AppRenderContextSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-render-context.section-links.block.types";

import { renderSectionLinksBlock } from "@rendering/body-content/block/section-links/section-links.block.renderer";
import { renderHeading } from "@rendering/shared/heading.shared.renderer";

jest.mock("@rendering/shared/heading.shared.renderer", () => ({
  renderHeading: jest.fn(),
}));

const createModule = (
  overrides: Partial<AppRenderContextSectionLinksBlock> = {},
): AppRenderContextSectionLinksBlock =>
  ({
    kind: "sectionLinks",
    sections: [
      {
        heading: {
          level: 2,
          text: "Journal",
        },
        intro: "Field notes and sightings.",
        link: {
          kind: "internal",
          href: "/journal",
          text: "Read the journal",
          openInNewTab: false,
          svg: null,
        },
        icon: {
          id: "icon-journal",
          width: 24,
          height: 24,
        },
      },
      {
        heading: {
          level: 2,
          text: "Articles",
        },
        intro: null,
        link: {
          kind: "internal",
          href: "/articles",
          text: "Read articles",
          openInNewTab: false,
          svg: null,
        },
        icon: null,
      },
    ],
    ...overrides,
  }) as AppRenderContextSectionLinksBlock;

describe("renderSectionLinksBlock", () => {
  const mockedRenderHeading = jest.mocked(renderHeading);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderHeading
      .mockReturnValueOnce(`<h2 class="m-section-links__heading">Journal</h2>`)
      .mockReturnValueOnce(
        `<h2 class="m-section-links__heading">Articles</h2>`,
      );
  });

  it("renders section links block", () => {
    expect(renderSectionLinksBlock(createModule())).toBe(
      `<section class="m-section-links l-content"><div class="m-section-links__grid"><article class="m-section-links__item"><a class="m-section-links__link" href="/journal"><svg class="m-section-links__icon" width="24" height="24" aria-hidden="true" focusable="false"><use href="#icon-journal"></use></svg><div class="m-section-links__content"><h2 class="m-section-links__heading">Journal</h2><p class="m-section-links__text">Field notes and sightings.</p><p class="m-section-links__action">Read the journal</p></div></a></article><article class="m-section-links__item"><a class="m-section-links__link" href="/articles"><div class="m-section-links__content"><h2 class="m-section-links__heading">Articles</h2><p class="m-section-links__action">Read articles</p></div></a></article></div></section>`,
    );

    const module = createModule();

    expect(mockedRenderHeading).toHaveBeenNthCalledWith(
      1,
      module.sections[0].heading,
      {
        className: "m-section-links__heading",
      },
    );

    expect(mockedRenderHeading).toHaveBeenNthCalledWith(
      2,
      module.sections[1].heading,
      {
        className: "m-section-links__heading",
      },
    );
  });

  it("renders empty section links block", () => {
    expect(
      renderSectionLinksBlock(
        createModule({
          sections: [],
        }),
      ),
    ).toBe(
      `<section class="m-section-links l-content"><div class="m-section-links__grid"></div></section>`,
    );
  });

  it("escapes rendered values", () => {
    mockedRenderHeading.mockReset();
    mockedRenderHeading.mockReturnValue(
      `<h2 class="m-section-links__heading">Escaped heading</h2>`,
    );

    const result = renderSectionLinksBlock(
      createModule({
        sections: [
          {
            heading: {
              level: 2,
              text: `Bad <heading>`,
            },
            intro: `Intro <script>alert("x")</script>`,
            link: {
              kind: "internal",
              href: `/journal/"bad"`,
              text: `Read <journal>`,
              openInNewTab: false,
              svg: null,
            },
            icon: {
              id: "icon-home",
              width: 24,
              height: 24,
            },
          },
        ],
      }),
    );

    expect(result).toContain(`href="/journal/&quot;bad&quot;"`);
    expect(result).toContain(`href="#icon-home"`);
    expect(result).toContain(
      `Intro &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;`,
    );
    expect(result).toContain(`Read &lt;journal&gt;`);
  });
});
