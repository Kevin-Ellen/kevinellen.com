// src/app/life-cycle/system/rss-feed/rss-feed.system.test.ts

import type { AppInit } from "../../app-init/class.app-init";
import type {
  JournalLedgerEntryAppInit,
  PublishedRegistry,
} from "../../../../shared/types/content/kv-ledger.content.shared.type";

import { resolveRssFeedSystem } from "./rss-feed.system";

describe("RSS feed system", () => {
  const canonicalDomain = "https://kevinellen.com";

  const appInit = {
    site: {
      canonicalDomain,
      description: "Wildlife, nature & field notes <from Essex>.",
      language: "en-GB",
    },
  } as AppInit;

  const createEntry = (
    overrides: Partial<JournalLedgerEntryAppInit> = {},
  ): JournalLedgerEntryAppInit => ({
    id: "forest-fox",
    kind: "journal",
    slug: "/journal/forest-fox",
    dateCreated: "2026-11-15T12:30:00.000Z",
    label: "Forest fox",
    sitemap: true,
    breadcrumbs: [],
    title: "Fox in Epping Forest",
    intro: "An encounter in the forest.",
    photos: ["forest-fox-photo"],
    topics: [],
    ...overrides,
  });

  const createLedger = (
    entries: readonly JournalLedgerEntryAppInit[],
  ): PublishedRegistry => ({
    bySlug: Object.fromEntries(entries.map((entry) => [entry.slug, entry])),
    newestFirst: entries,
  });

  const render = (
    entries: readonly JournalLedgerEntryAppInit[] = [createEntry()],
    site: AppInit = appInit,
  ) => resolveRssFeedSystem({ appInit: site, ledger: createLedger(entries) });

  it("returns an XML response with RSS-specific content type", () => {
    const output = render();

    expect(output).toMatchObject({
      kind: "xml",
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    });
  });

  it("renders an RSS 2.0 document with channel metadata", () => {
    const { body } = render();

    expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n')).toBe(
      true,
    );
    expect(body).toContain('<rss version="2.0">');
    expect(body).toContain("<channel>");
    expect(body).toContain(
      "<title>Kevin Ellen — Wildlife Photography & Field Notes</title>",
    );
    expect(body).toContain(`<link>${canonicalDomain}</link>`);
    expect(body).toContain(
      "<description>Wildlife, nature &amp; field notes &lt;from Essex&gt;.</description>",
    );
    expect(body).toContain("<language>en-GB</language>");
    expect(body.endsWith("</channel>\n</rss>")).toBe(true);
  });

  it("renders each included journal with a canonical link and stable URL GUID", () => {
    const { body } = render();
    const url = `${canonicalDomain}/journal/forest-fox`;

    expect(body).toContain("<title>Fox in Epping Forest</title>");
    expect(body).toContain(`<link>${url}</link>`);
    expect(body).toContain(`<guid isPermaLink="true">${url}</guid>`);
    expect(body).toContain(
      "<description>An encounter in the forest.</description>",
    );
    expect(body).toContain("<pubDate>Sun, 15 Nov 2026 12:30:00 GMT</pubDate>");
    expect(body.match(/<item>/g)).toHaveLength(1);
    expect(body.match(/<\/item>/g)).toHaveLength(1);
  });

  it("excludes entries that are not eligible for the sitemap", () => {
    const { body } = render([
      createEntry({
        id: "included",
        slug: "/journal/included",
        title: "Included",
      }),
      createEntry({
        id: "excluded",
        slug: "/journal/excluded",
        title: "Excluded",
        sitemap: false,
      }),
    ]);

    expect(body).toContain("<title>Included</title>");
    expect(body).not.toContain("<title>Excluded</title>");
    expect(body.match(/<item>/g)).toHaveLength(1);
  });

  it("preserves the newestFirst projection order instead of sorting by slug", () => {
    const { body } = render([
      createEntry({ id: "new", slug: "/journal/z-new", title: "Newest" }),
      createEntry({ id: "old", slug: "/journal/a-old", title: "Oldest" }),
    ]);

    expect(body.indexOf("<title>Newest</title>")).toBeLessThan(
      body.indexOf("<title>Oldest</title>"),
    );
  });

  it("limits the feed to 25 eligible entries, filtering before limiting", () => {
    const entries = [
      createEntry({
        id: "excluded",
        slug: "/journal/excluded",
        title: "Excluded",
        sitemap: false,
      }),
      ...Array.from({ length: 27 }, (_, index) =>
        createEntry({
          id: `entry-${index}`,
          slug: `/journal/entry-${index}`,
          title: `Entry ${index}`,
        }),
      ),
    ];

    const { body } = render(entries);

    expect(body.match(/<item>/g)).toHaveLength(25);
    expect(body).toContain("<title>Entry 24</title>");
    expect(body).not.toContain("<title>Entry 25</title>");
    expect(body).not.toContain("<title>Excluded</title>");
  });

  it("escapes XML special characters in editorial fields and URLs", () => {
    const { body } = render([
      createEntry({
        slug: "/journal/fox?view=wide&mode=full",
        title: `Fox & Badger <friends> "at dusk" 'again'`,
        intro: `Notes & observations <near trees> "quoted" 'verbatim'`,
      }),
    ]);

    expect(body).toContain(
      "<title>Fox &amp; Badger &lt;friends&gt; &quot;at dusk&quot; &apos;again&apos;</title>",
    );
    expect(body).toContain(
      "<description>Notes &amp; observations &lt;near trees&gt; &quot;quoted&quot; &apos;verbatim&apos;</description>",
    );
    expect(body).toContain(
      "https://kevinellen.com/journal/fox?view=wide&amp;mode=full",
    );
  });

  it("resolves relative entry slugs against the configured canonical domain", () => {
    const { body } = render([createEntry({ slug: "/journal/kingfisher" })]);

    expect(body).toContain(
      "<link>https://kevinellen.com/journal/kingfisher</link>",
    );
    expect(body).not.toContain("localhost");
  });

  it("formats date-only publication dates as GMT", () => {
    const { body } = render([createEntry({ dateCreated: "2026-11-04" })]);

    expect(body).toContain("<pubDate>Wed, 04 Nov 2026 00:00:00 GMT</pubDate>");
  });

  it("renders a valid empty channel without items", () => {
    const { body } = render([]);

    expect(body).toContain("<channel>");
    expect(body).toContain("</channel>");
    expect(body).not.toContain("<item>");
  });

  it("renders no items when every entry is excluded", () => {
    const { body } = render([createEntry({ sitemap: false })]);

    expect(body).not.toContain("<item>");
  });

  it("does not mutate the published registry projection", () => {
    const entries = Object.freeze([
      Object.freeze(createEntry({ id: "a", slug: "/journal/a" })),
      Object.freeze(createEntry({ id: "b", slug: "/journal/b" })),
    ]);
    const ledger = createLedger(entries);

    resolveRssFeedSystem({ appInit, ledger });

    expect(ledger.newestFirst).toBe(entries);
    expect(ledger.newestFirst.map((entry) => entry.id)).toEqual(["a", "b"]);
  });
});
