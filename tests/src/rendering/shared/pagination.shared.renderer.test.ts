// tests/src/rendering/shared/pagination.shared.renderer.test.ts

import { renderPagination } from "@rendering/shared/pagination.shared.renderer";

describe("renderPagination", () => {
  it("returns an empty string when there is only one page", () => {
    const html = renderPagination({
      currentPage: 1,
      totalPages: 1,
      label: "Page 1 of 1",
      previousLabel: "← Newer entries",
      nextLabel: "Older entries →",
      previousHref: null,
      nextHref: null,
    } as never);

    expect(html).toBe("");
  });

  it("renders previous and next pagination links", () => {
    const html = renderPagination({
      currentPage: 2,
      totalPages: 3,
      label: "Page 2 of 3",
      previousLabel: "← Newer entries",
      nextLabel: "Older entries →",
      previousHref: "/journal",
      nextHref: "/journal/page/3",
    } as never);

    expect(html).toContain(`class="m-pagination"`);
    expect(html).toContain(`aria-label="Pagination"`);
    expect(html).toContain(`href="/journal"`);
    expect(html).toContain(`← Newer entries`);
    expect(html).toContain(`href="/journal/page/3"`);
    expect(html).toContain(`Older entries →`);
    expect(html).toContain(`Page 2 of 3`);
  });

  it("does not render previous link when previousHref is null", () => {
    const html = renderPagination({
      currentPage: 1,
      totalPages: 3,
      label: "Page 1 of 3",
      previousLabel: "← Newer entries",
      nextLabel: "Older entries →",
      previousHref: null,
      nextHref: "/journal/page/2",
    } as never);

    expect(html).not.toContain(`m-pagination__link--previous`);
    expect(html).toContain(`m-pagination__link--next`);
  });

  it("does not render next link when nextHref is null", () => {
    const html = renderPagination({
      currentPage: 3,
      totalPages: 3,
      label: "Page 3 of 3",
      previousLabel: "← Newer entries",
      nextLabel: "Older entries →",
      previousHref: "/journal/page/2",
      nextHref: null,
    } as never);

    expect(html).toContain(`m-pagination__link--previous`);
    expect(html).not.toContain(`m-pagination__link--next`);
  });

  it("escapes pagination labels, hrefs, and aria label", () => {
    const html = renderPagination(
      {
        currentPage: 2,
        totalPages: 3,
        label: `Page <2> & "test"`,
        previousLabel: `Newer <entries>`,
        nextLabel: `Older & entries`,
        previousHref: `/journal?<prev>=1&x="y"`,
        nextHref: `/journal?<next>=3&x="z"`,
      } as never,
      `Journal <pagination> & "nav"`,
    );

    expect(html).toContain(
      `aria-label="Journal &lt;pagination&gt; &amp; &quot;nav&quot;"`,
    );
    expect(html).toContain(
      `href="/journal?&lt;prev&gt;=1&amp;x=&quot;y&quot;"`,
    );
    expect(html).toContain(`Newer &lt;entries&gt;`);
    expect(html).toContain(
      `href="/journal?&lt;next&gt;=3&amp;x=&quot;z&quot;"`,
    );
    expect(html).toContain(`Older &amp; entries`);
    expect(html).toContain(`Page &lt;2&gt; &amp; &quot;test&quot;`);
  });
});
