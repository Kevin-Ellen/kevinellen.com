// src/rendering/body-content/block/section-links/section-links.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-render-context.section-links.block.types";

import { SectionLinksBlockTemplate } from "@rendering/body-content/block/section-links/section-links.block.template";

const block = (
  overrides: Partial<AppRenderContextSectionLinksBlock> = {},
): AppRenderContextSectionLinksBlock =>
  ({
    kind: "sectionLinks",
    sections: [
      {
        icon: {
          id: "icon-newspaper",
          width: 24,
          height: 24,
        },
        heading: {
          text: "Journal",
          level: 3,
          visuallyHidden: false,
        },
        intro: "Field notes and wildlife observations.",
        link: {
          href: "/journal",
          text: "Read journal",
        },
      },
      {
        icon: null,
        heading: {
          text: "Notes",
          level: 3,
          visuallyHidden: false,
        },
        intro: null,
        link: {
          href: "/notes",
          text: "Read notes",
        },
      },
    ],
    ...overrides,
  }) as AppRenderContextSectionLinksBlock;

describe("SectionLinksBlockTemplate", () => {
  it("renders section links", () => {
    expect(
      renderToStaticMarkup(<SectionLinksBlockTemplate block={block()} />),
    ).toBe(
      '<section class="m-section-links l-content"><div class="m-section-links__grid"><article class="m-section-links__item"><a class="m-section-links__link" href="/journal"><svg class="m-section-links__icon" aria-hidden="true" width="24" height="24"><use href="#icon-newspaper"></use></svg><div class="m-section-links__content"><h3 class="m-section-links__heading">Journal</h3><p class="m-section-links__text">Field notes and wildlife observations.</p><p class="m-section-links__action">Read journal</p></div></a></article><article class="m-section-links__item"><a class="m-section-links__link" href="/notes"><div class="m-section-links__content"><h3 class="m-section-links__heading">Notes</h3><p class="m-section-links__action">Read notes</p></div></a></article></div></section>',
    );
  });

  it("renders an empty section links block", () => {
    expect(
      renderToStaticMarkup(
        <SectionLinksBlockTemplate block={block({ sections: [] })} />,
      ),
    ).toBe(
      '<section class="m-section-links l-content"><div class="m-section-links__grid"></div></section>',
    );
  });
});
