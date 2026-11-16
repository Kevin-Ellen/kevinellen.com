// src/app/life-cycle/app-resolve/resolvers/content/journal-navigation/journal-navigation.content.resolver.app-resolve.test.ts

import type { PublishedRegistry } from "../../../../../../shared/types/content/kv-ledger.content.shared.type";

import { resolveJournalNavigationAppResolve } from "./journal-navigation.content.resolver.app-resolve";

type JournalEntry = PublishedRegistry["newestFirst"][number];

const createEntry = (
  slug: string,
  overrides: Partial<JournalEntry> = {},
): JournalEntry => ({
  id: slug,
  kind: "journal",
  slug,
  dateCreated: "2026-11-15",
  label: slug,
  sitemap: true,
  breadcrumbs: [],
  title: `Title: ${slug}`,
  intro: `Introduction: ${slug}`,
  photos: [],
  topics: [],
  ...overrides,
});

const createLedger = (entries: readonly JournalEntry[]): PublishedRegistry => ({
  newestFirst: entries,
  bySlug: Object.fromEntries(entries.map((entry) => [entry.slug, entry])),
});

describe("resolveJournalNavigationAppResolve", () => {
  const newest = createEntry("/journal/newest");
  const middle = createEntry("/journal/middle");
  const oldest = createEntry("/journal/oldest");

  const ledger = createLedger([newest, middle, oldest]);

  it("returns the older and newer entries for a middle journal", () => {
    expect(
      resolveJournalNavigationAppResolve({
        currentSlug: middle.slug,
        journalLedger: ledger,
      }),
    ).toEqual({
      previous: {
        slug: oldest.slug,
        title: oldest.title,
      },
      next: {
        slug: newest.slug,
        title: newest.title,
      },
    });
  });

  it("returns no next entry for the newest journal", () => {
    expect(
      resolveJournalNavigationAppResolve({
        currentSlug: newest.slug,
        journalLedger: ledger,
      }),
    ).toEqual({
      previous: {
        slug: middle.slug,
        title: middle.title,
      },
      next: null,
    });
  });

  it("returns no previous entry for the oldest journal", () => {
    expect(
      resolveJournalNavigationAppResolve({
        currentSlug: oldest.slug,
        journalLedger: ledger,
      }),
    ).toEqual({
      previous: null,
      next: {
        slug: middle.slug,
        title: middle.title,
      },
    });
  });

  it("returns no navigation for an unknown slug", () => {
    expect(
      resolveJournalNavigationAppResolve({
        currentSlug: "/journal/missing",
        journalLedger: ledger,
      }),
    ).toEqual({
      previous: null,
      next: null,
    });
  });

  it("returns no navigation for an empty ledger", () => {
    expect(
      resolveJournalNavigationAppResolve({
        currentSlug: middle.slug,
        journalLedger: createLedger([]),
      }),
    ).toEqual({
      previous: null,
      next: null,
    });
  });

  it("returns no neighbouring entries when the ledger contains one journal", () => {
    expect(
      resolveJournalNavigationAppResolve({
        currentSlug: middle.slug,
        journalLedger: createLedger([middle]),
      }),
    ).toEqual({
      previous: null,
      next: null,
    });
  });

  it("skips entries excluded from the sitemap", () => {
    const hiddenNewer = createEntry("/journal/hidden-newer", {
      sitemap: false,
    });

    const hiddenOlder = createEntry("/journal/hidden-older", {
      sitemap: false,
    });

    const filteredLedger = createLedger([
      newest,
      hiddenNewer,
      middle,
      hiddenOlder,
      oldest,
    ]);

    expect(
      resolveJournalNavigationAppResolve({
        currentSlug: middle.slug,
        journalLedger: filteredLedger,
      }),
    ).toEqual({
      previous: {
        slug: oldest.slug,
        title: oldest.title,
      },
      next: {
        slug: newest.slug,
        title: newest.title,
      },
    });
  });

  it("returns no navigation for a journal excluded from the sitemap", () => {
    const hidden = createEntry("/journal/hidden", {
      sitemap: false,
    });

    expect(
      resolveJournalNavigationAppResolve({
        currentSlug: hidden.slug,
        journalLedger: createLedger([newest, hidden, oldest]),
      }),
    ).toEqual({
      previous: null,
      next: null,
    });
  });

  it("does not include the current journal as its own neighbour", () => {
    const result = resolveJournalNavigationAppResolve({
      currentSlug: middle.slug,
      journalLedger: ledger,
    });

    expect(result.previous?.slug).not.toBe(middle.slug);
    expect(result.next?.slug).not.toBe(middle.slug);
  });

  it("does not mutate the published registry", () => {
    const entries = Object.freeze([
      Object.freeze(newest),
      Object.freeze(middle),
      Object.freeze(oldest),
    ]);

    const immutableLedger = Object.freeze(createLedger(entries));

    resolveJournalNavigationAppResolve({
      currentSlug: middle.slug,
      journalLedger: immutableLedger,
    });

    expect(immutableLedger.newestFirst).toEqual([newest, middle, oldest]);
  });

  it("returns only the slug and title of neighbouring entries", () => {
    const result = resolveJournalNavigationAppResolve({
      currentSlug: middle.slug,
      journalLedger: ledger,
    });

    expect(Object.keys(result.previous ?? {})).toEqual(["slug", "title"]);
    expect(Object.keys(result.next ?? {})).toEqual(["slug", "title"]);
  });
});
