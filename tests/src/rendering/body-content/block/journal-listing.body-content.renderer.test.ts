// tests/src/rendering/body-content/block/journal-listing.body-content.renderer.test.ts

import { renderJournalListingBlockContentModule } from "@rendering/body-content/block/journal-listing.body-content.renderer";

describe("renderJournalListingBlockContentModule", () => {
  it("renders the journal listing placeholder JSON safely", () => {
    const html = renderJournalListingBlockContentModule({
      kind: "journalListing",
      flow: "content",
      entries: [
        {
          title: `Birds & <notes>`,
        },
      ],
    } as never);

    expect(html).toContain(
      `<section class="m-contentBlock m-journalListing" aria-label="Journal listing">`,
    );
    expect(html).toContain(`Birds &amp; &lt;notes&gt;`);
  });
});
