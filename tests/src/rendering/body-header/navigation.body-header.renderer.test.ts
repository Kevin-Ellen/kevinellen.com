// tests/src/rendering/body-header/navigation.body-header.renderer.test.ts

import { renderBodyHeaderNavigation } from "@rendering/body-header/navigation.body-header.renderer";

describe("renderBodyHeaderNavigation", () => {
  it("renders primary and social navigation links", () => {
    const result = renderBodyHeaderNavigation({
      primary: [
        {
          kind: "internal",
          href: "/about",
          text: "About",
          openInNewTab: false,
          svg: null,
          ariaCurrent: "page",
        },
      ],
      social: [
        {
          kind: "social",
          href: "https://github.com/Kevin-Ellen",
          text: "GitHub",
          openInNewTab: true,
          svg: {
            id: "icon-github",
            width: 100,
            height: 100,
          },
          ariaCurrent: null,
        },
      ],
    });

    expect(result).toContain(
      '<nav class="l-header__primary" aria-label="Primary">',
    );
    expect(result).toContain(
      '<a class="l-header__link" href="/about" aria-current="page">About</a>',
    );
    expect(result).toContain(
      '<a class="l-header__link" href="https://github.com/Kevin-Ellen" target="_blank" rel="noopener noreferrer" aria-label="GitHub">',
    );
    expect(result).toContain('<use href="#icon-github"></use>');
  });

  it("renders social navigation text links when no SVG is provided", () => {
    const result = renderBodyHeaderNavigation({
      primary: [],
      social: [
        {
          kind: "social",
          href: "https://example.com",
          text: "Example",
          openInNewTab: true,
          svg: null,
          ariaCurrent: null,
        },
      ],
    });

    expect(result).toContain(
      '<a class="l-header__link" href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a>',
    );
    expect(result).not.toContain("<svg");
  });
});
