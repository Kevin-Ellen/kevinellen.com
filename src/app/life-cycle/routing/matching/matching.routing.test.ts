// src/app/life-cycle/routing/matching/matching.routing.test.ts

import type { AppInit } from "../../app-init/class.app-init";
import type {
  JournalLedgerEntryAppInit,
  PublishedRegistry,
} from "../../../../shared/types/content/kv-ledger.content.shared.type";

import { matchRouting } from "./matching.routing";

describe("Matching routing", () => {
  type BundledPage = AppInit["content"]["bySlug"][string];

  const createJournal = (
    slug: string,
    topics: JournalLedgerEntryAppInit["topics"] = [],
  ): JournalLedgerEntryAppInit => ({
    id: slug,
    kind: "journal",
    slug,
    dateCreated: "2026-11-04",
    label: slug,
    sitemap: true,
    breadcrumbs: [],
    title: slug,
    intro: "Test journal",
    photos: [],
    topics,
  });

  const createLedger = (
    entries: readonly JournalLedgerEntryAppInit[] = [],
  ): PublishedRegistry => ({
    newestFirst: entries,
    bySlug: Object.fromEntries(entries.map((entry) => [entry.slug, entry])),
  });

  const createPage = (modules: readonly unknown[] = []): BundledPage =>
    ({
      body: { modules },
    }) as BundledPage;

  const createJournalListing = (
    options: {
      pageSize?: number;
      topicId?: JournalLedgerEntryAppInit["topics"][number] | null;
      pagination?: boolean;
    } = {},
  ) => ({
    kind: "journalListing",
    pageSize: options.pageSize ?? 2,
    topicId: options.topicId ?? null,
    pagination: options.pagination ?? true,
  });

  const createTopicListing = (
    items: readonly unknown[],
    pagination = true,
  ) => ({
    kind: "topicListing",
    items,
    pageSize: 2,
    pagination,
  });

  const resolve = (
    pathname: string,
    bundled: Record<string, BundledPage> = {},
    ledger: PublishedRegistry = createLedger(),
  ) =>
    matchRouting({
      pathname,
      appInit: {
        content: { bySlug: bundled },
      } as AppInit,
      ledger,
    });

  const journals = [
    createJournal("/journal/one"),
    createJournal("/journal/two"),
    createJournal("/journal/three"),
    createJournal("/journal/four"),
  ];

  describe("Direct routing", () => {
    it("selects bundled content", () => {
      const ledger = createLedger();

      const result = resolve("/about", { "/about": createPage() }, ledger);

      expect(result).toEqual({
        kind: "selected",
        pathname: "/about",
        contentPathname: "/about",
        source: "bundled",
        ledger,
      });
    });

    it("selects published content", () => {
      const journal = createJournal("/journal/example");
      const ledger = createLedger([journal]);

      const result = resolve("/journal/example", {}, ledger);

      expect(result).toEqual({
        kind: "selected",
        pathname: "/journal/example",
        contentPathname: "/journal/example",
        source: "published",
        ledger,
      });
    });

    it("prioritises bundled content over published content", () => {
      const pathname = "/journal/example";
      const ledger = createLedger([createJournal(pathname)]);

      const result = resolve(pathname, { [pathname]: createPage() }, ledger);

      expect(result.kind).toBe("selected");

      if (result.kind === "selected") {
        expect(result.source).toBe("bundled");
      }
    });

    it("returns 404 for unknown paths", () => {
      const ledger = createLedger();

      expect(resolve("/unknown", {}, ledger)).toEqual({
        kind: "not-found",
        status: 404,
        pathname: "/unknown",
        ledger,
      });
    });
  });

  describe("Pagination path matching", () => {
    const bundled = {
      "/journal": createPage([createJournalListing()]),
    };

    const ledger = createLedger(journals);

    it("matches journal pagination", () => {
      expect(resolve("/journal/page-2", bundled, ledger)).toEqual({
        kind: "selected",
        pathname: "/journal/page-2",
        contentPathname: "/journal",
        pagination: { page: 2 },
        source: "bundled",
        ledger,
      });
    });

    it("rejects page zero", () => {
      expect(resolve("/journal/page-0", bundled, ledger).kind).toBe(
        "not-found",
      );
    });

    it("rejects unsafe integer page numbers", () => {
      expect(
        resolve("/journal/page-9007199254740992", bundled, ledger).kind,
      ).toBe("not-found");
    });

    it.each([
      "/journal/page-abc",
      "/journal/page--1",
      "/journal/page-2/",
      "/journal/page-2/extra",
      "/journals/page-2",
      "/unknown/page-2",
      "/topics/page-abc",
      "/topics/page-2/extra",
    ])("rejects invalid pagination path %s", (pathname) => {
      expect(resolve(pathname, bundled, ledger).kind).toBe("not-found");
    });

    it("rejects pages beyond the available results", () => {
      expect(resolve("/journal/page-99", bundled, ledger).kind).toBe(
        "not-found",
      );
    });

    it("rejects pagination without matching bundled content", () => {
      expect(resolve("/journal/page-2", {}, ledger).kind).toBe("not-found");
    });

    it("rejects content without a listing module", () => {
      expect(
        resolve("/journal/page-2", { "/journal": createPage([]) }, ledger).kind,
      ).toBe("not-found");
    });

    it("rejects content with unrelated modules", () => {
      expect(
        resolve(
          "/journal/page-2",
          {
            "/journal": createPage([{ kind: "text" }]),
          },
          ledger,
        ).kind,
      ).toBe("not-found");
    });

    it("rejects listings with pagination disabled", () => {
      expect(
        resolve(
          "/journal/page-2",
          {
            "/journal": createPage([
              createJournalListing({
                pagination: false,
              }),
            ]),
          },
          ledger,
        ).kind,
      ).toBe("not-found");
    });

    it("selects the first matching listing module", () => {
      const result = resolve(
        "/journal/page-2",
        {
          "/journal": createPage([{ kind: "text" }, createJournalListing()]),
        },
        ledger,
      );

      expect(result.kind).toBe("selected");
    });
  });

  describe("Journal listing pagination", () => {
    it("paginates all published journals", () => {
      const ledger = createLedger(journals);

      const result = resolve(
        "/journal/page-2",
        {
          "/journal": createPage([
            createJournalListing({
              pageSize: 2,
              topicId: null,
            }),
          ]),
        },
        ledger,
      );

      expect(result.kind).toBe("selected");
    });

    it("filters journal entries by topic before pagination", () => {
      const topicId = "wildlife" as JournalLedgerEntryAppInit["topics"][number];

      const entries = [
        createJournal("/journal/one", [topicId]),
        createJournal("/journal/two", []),
        createJournal("/journal/three", [topicId]),
        createJournal("/journal/four", [topicId]),
      ];

      const ledger = createLedger(entries);

      const result = resolve(
        "/topics/wildlife/page-2",
        {
          "/topics/wildlife": createPage([
            createJournalListing({
              topicId,
              pageSize: 2,
            }),
          ]),
        },
        ledger,
      );

      expect(result).toEqual({
        kind: "selected",
        pathname: "/topics/wildlife/page-2",
        contentPathname: "/topics/wildlife",
        pagination: { page: 2 },
        source: "bundled",
        ledger,
      });
    });

    it("rejects topic pages without sufficient matching entries", () => {
      const topicId = "wildlife" as JournalLedgerEntryAppInit["topics"][number];

      const ledger = createLedger([
        createJournal("/journal/one", [topicId]),
        createJournal("/journal/two"),
        createJournal("/journal/three"),
      ]);

      const result = resolve(
        "/topics/wildlife/page-2",
        {
          "/topics/wildlife": createPage([
            createJournalListing({
              topicId,
              pageSize: 2,
            }),
          ]),
        },
        ledger,
      );

      expect(result.kind).toBe("not-found");
    });
  });

  describe("Topic listing pagination", () => {
    const items = [
      { id: "one" },
      { id: "two" },
      { id: "three" },
      { id: "four" },
    ];

    it("paginates the topics index", () => {
      const ledger = createLedger();

      const result = resolve(
        "/topics/page-2",
        {
          "/topics": createPage([createTopicListing(items)]),
        },
        ledger,
      );

      expect(result).toEqual({
        kind: "selected",
        pathname: "/topics/page-2",
        contentPathname: "/topics",
        pagination: { page: 2 },
        source: "bundled",
        ledger,
      });
    });

    it("rejects topic listing pages beyond available items", () => {
      const result = resolve("/topics/page-99", {
        "/topics": createPage([createTopicListing(items)]),
      });

      expect(result.kind).toBe("not-found");
    });

    it("rejects disabled topic listing pagination", () => {
      const result = resolve("/topics/page-2", {
        "/topics": createPage([createTopicListing(items, false)]),
      });

      expect(result.kind).toBe("not-found");
    });
  });
});
