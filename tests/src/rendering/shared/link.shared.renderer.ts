// tests/src/rendering/shared/link.shared.renderer.test.ts

import {
  renderLinkAttributes,
  renderTextLink,
} from "@rendering/shared/link.shared.renderer";

describe("link.shared.renderer", () => {
  it("renders safe link attributes", () => {
    const result = renderLinkAttributes({
      kind: "external",
      href: 'https://example.com?a="duck"',
      text: "Example",
      openInNewTab: true,
      svg: null,
      ariaLabel: "External example",
      className: "c-link",
    });

    expect(result).toBe(
      'class="c-link" href="https://example.com?a=&quot;duck&quot;" target="_blank" rel="noopener noreferrer" aria-label="External example"',
    );
  });

  it("renders a text link with escaped text", () => {
    const result = renderTextLink({
      kind: "internal",
      href: "/about",
      text: "About <Kevin>",
      openInNewTab: false,
      svg: null,
      className: "c-link",
    });

    expect(result).toBe(
      '<a class="c-link" href="/about">About &lt;Kevin&gt;</a>',
    );
  });
});
