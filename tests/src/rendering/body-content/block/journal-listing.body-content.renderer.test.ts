// tests/src/rendering/body-content/block/journal-listing.body-content.renderer.test.ts

import { renderJournalListingBlockContentModule } from "@rendering/body-content/block/journal-listing.body-content.renderer";

import { renderPagination } from "@rendering/shared/pagination.shared.renderer";

jest.mock("@rendering/shared/pagination.shared.renderer", () => ({
  renderPagination: jest.fn(),
}));

describe("renderJournalListingBlockContentModule", () => {
  const mockedRenderPagination = jest.mocked(renderPagination);

  beforeEach(() => {
    jest.clearAllMocks();
    mockedRenderPagination.mockReturnValue("<nav>pagination</nav>");
  });

  it("renders journal listing items with escaped content", () => {
    const module = {
      kind: "journalListing",
      pagination: {
        currentPage: 1,
        totalPages: 3,
      },
      items: [
        {
          href: "/journal/birds",
          title: "Birds & <notes>",
          intro: "Intro & <text>",
          publishedAt: "2026-05-01",
          publishedLabel: "1 May 2026",
          image: {
            src: "/img.jpg",
            srcset: ["/img.jpg 1x", "/img@2x.jpg 2x"],
            sizes: "100vw",
            alt: "Bird & <alt>",
            ratio: {
              width: 400,
              height: 300,
            },
          },
        },
      ],
    };

    const html = renderJournalListingBlockContentModule(module as never);

    expect(html).toContain("m-journal-listing");
    expect(html).toContain("m-journal-listing__item--featured");

    // Escaping checks
    expect(html).toContain("Birds &amp; &lt;notes&gt;");
    expect(html).toContain("Intro &amp; &lt;text&gt;");
    expect(html).toContain("Bird &amp; &lt;alt&gt;");

    // Image rendering
    expect(html).toContain('src="/img.jpg"');
    expect(html).toContain('srcset="/img.jpg 1x, /img@2x.jpg 2x"');

    // Time rendering
    expect(html).toContain("<time");
    expect(html).toContain("1 May 2026");

    expect(mockedRenderPagination).toHaveBeenCalledWith(
      module.pagination,
      "Journal pagination",
    );
  });

  it("does not render image or time when null", () => {
    const module = {
      kind: "journalListing",
      pagination: {
        currentPage: 2,
        totalPages: 3,
      },
      items: [
        {
          href: "/journal/no-image",
          title: "No image",
          intro: "No intro",
          publishedAt: null,
          publishedLabel: null,
          image: null,
        },
      ],
    };

    const html = renderJournalListingBlockContentModule(module as never);

    expect(html).not.toContain("<img");
    expect(html).not.toContain("<time");
    expect(html).not.toContain("m-journal-listing__item--featured");
  });

  it("only renders intro for featured item on page 1", () => {
    const module = {
      kind: "journalListing",
      pagination: {
        currentPage: 1,
        totalPages: 3,
      },
      items: [
        {
          href: "/journal/featured",
          title: "Featured",
          intro: "Visible intro",
          publishedAt: null,
          publishedLabel: null,
          image: null,
        },
        {
          href: "/journal/normal",
          title: "Normal",
          intro: "Hidden intro",
          publishedAt: null,
          publishedLabel: null,
          image: null,
        },
      ],
    };

    const html = renderJournalListingBlockContentModule(module as never);

    expect(html).toContain("Visible intro");
    expect(html).not.toContain("Hidden intro");
  });

  it("does not render intro when featured but intro is missing", () => {
    const module = {
      kind: "journalListing",
      pagination: {
        currentPage: 1,
        totalPages: 3,
      },
      items: [
        {
          href: "/journal/featured-no-intro",
          title: "Featured no intro",
          intro: null,
          publishedAt: null,
          publishedLabel: null,
          image: null,
        },
      ],
    };

    const html = renderJournalListingBlockContentModule(module as never);

    expect(html).toContain("m-journal-listing__item--featured");
    expect(html).not.toContain("m-heading__intro");
  });

  it("renders an empty datetime when published label exists without published date", () => {
    const module = {
      kind: "journalListing",
      pagination: {
        currentPage: 1,
        totalPages: 1,
      },
      items: [
        {
          href: "/journal/date-label-only",
          title: "Date label only",
          intro: null,
          publishedAt: null,
          publishedLabel: "Date unknown",
          image: null,
        },
      ],
    };

    const html = renderJournalListingBlockContentModule(module as never);

    expect(html).toContain(
      `<time class="m-heading__eyebrow" datetime="">Date unknown</time>`,
    );
  });
});
